import getTokenCookie from "@/util/api/getTokenCookie";
import processToken from "@/util/api/processToken";
import { NextRequest, NextResponse } from "next/server";
import createHistoryImagesTableIfNotExists from "../../_lib/db/table/history_images";
import pool from "../../_lib/db/db";
import parseFormData from "@/util/api/parseFormData";
import formidable from "formidable";
import { deleteImages, saveImages } from "../_util/imageFiles";
import { insertImagesTx } from "../_util/dbInsertImages";
import { insertHistoryImagesTx } from "../_util/dbInsertHistoryImages";
import { selectHistoryTx } from "../_util/dbSelectHistory";
import { validateCategoryId, validateWalletId } from "../_util/validation";

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const token = getTokenCookie(request);

  try {
    const tokenData = await processToken(token);

    const id = params.id;

    await createHistoryImagesTableIfNotExists();

    const history = await pool.query<HistoryI>(
      "SELECT h.id, h.description, t.id type_id, t.name type_name, w.id wallet_id, w.name wallet_name, c.id category_id, c.name category_name, h.datetime, h.amount, ARRAY_AGG(hi.image_id) image_ids, h.location, h.location_name, h.location_display_name" +
        " FROM history h" +
        " JOIN wallets w ON w.id = h.wallet_id" +
        " JOIN categories c ON c.id = h.category_id" +
        " JOIN types t ON t.id = c.type_id" +
        " LEFT JOIN history_images hi ON hi.history_id = h.id" +
        " WHERE h.id = $1 AND h.user_id = $2",
      [id, tokenData.userId]
    );

    return NextResponse.json(history.rows[0]);
  } catch (error) {
    console.error("Failed to get a history:", error);
    return NextResponse.json(
      {
        error: "Failed to get a history",
      },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const token = getTokenCookie(request);

  try {
    const tokenData = await processToken(token);

    const id = Number(params.id);

    const { fields, files } = await parseFormData(request);

    const {
      description,
      wallet_id,
      category_id,
      datetime,
      amount,
      image_ids,
      location,
      location_name,
      location_display_name,
    } = fields;

    let uploadedImages: formidable.File[] = [];
    if (files.images) {
      if (Array.isArray(files.images)) {
        uploadedImages = files.images;
      } else {
        uploadedImages = [files.images];
      }
    }

    await createHistoryImagesTableIfNotExists();

    await validateWalletId(tokenData.userId, wallet_id?.[0]);
    await validateCategoryId(tokenData.userId, category_id?.[0]);

    const client = await pool.connect();

    let savedImages: SavedImage[] = [];
    try {
      const toBeDeletedImages = [];

      if (image_ids?.length) {
        const historyImages = await client.query<HistoryImageI>(
          "SELECT h.id history_id, hi.image_id, i.path image_path" +
            " FROM history_images hi" +
            " JOIN history h ON h.id = hi.history_id" +
            " JOIN images i ON i.id = hi.image_id" +
            " WHERE h.id = $1 AND h.user_id = $2",
          [id, tokenData.userId]
        );
        for (const historyImage of historyImages.rows) {
          if (!image_ids.includes(historyImage.image_id!)) {
            toBeDeletedImages.push({
              id: historyImage.image_id,
              path: historyImage.image_path,
            });
          }
        }
        if (toBeDeletedImages.length) {
          const toBeDeletedImageIds = toBeDeletedImages.map((i) => i.id);
          await client.query("DELETE FROM images WHERE id = ANY($1)", [
            toBeDeletedImageIds,
          ]);
          await client.query(
            "DELETE FROM history_images WHERE history_id = $1 AND image_id = ANY($2)",
            [id, toBeDeletedImageIds]
          );
        }
      }

      savedImages = await saveImages(uploadedImages, tokenData.userId);

      await insertImagesTx(client, savedImages);

      await client.query(
        "UPDATE history SET" +
          " description = $1," +
          " wallet_id = $2," +
          " category_id = $3," +
          " datetime = $4," +
          " amount = $5," +
          " location = $6," +
          " location_name = $7," +
          " location_display_name = $8" +
          " WHERE" +
          " id = $9" +
          " AND user_id = $10",
        [
          description,
          wallet_id,
          category_id,
          datetime,
          amount,
          location,
          location_name,
          location_display_name,
          id,
          tokenData.userId,
        ]
      );

      await insertHistoryImagesTx(client, id, savedImages);

      const history = await selectHistoryTx(client, id, tokenData.userId);

      client.query("COMMIT");

      await deleteImages(toBeDeletedImages.map((i) => i.path!));

      return NextResponse.json(history.rows[0]);
    } catch (error) {
      console.error("Failed to update a history:", error);
      client.query("ROLLBACK");
      await deleteImages(savedImages.map((i) => i.path));
    } finally {
      client.release();
    }
  } catch (error) {
    console.error("Failed to update a history:", error);
    return NextResponse.json(
      {
        error: "Failed to update a history",
      },
      { status: 500 }
    );
  }
}
