import getTokenCookie from "@/util/api/getTokenCookie";
import processToken from "@/util/api/processToken";
import { NextRequest, NextResponse } from "next/server";
import pool from "../../_lib/db/db";
import parseFormData from "@/util/api/parseFormData";
import formidable from "formidable";
import { deleteImages, saveImages } from "../_util/imageFiles";
import { insertImagesTx } from "../_util/dbInsertImages";
import { insertHistoryImagesTx } from "../_util/dbInsertHistoryImages";
import { selectHistoryTx } from "../_util/dbSelectHistory";
import { validateCategoryId, validateWalletId } from "../_util/validation";
import Log from "@/util/log";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const token = getTokenCookie(request);

  try {
    const tokenData = await processToken(token);

    const { id } = await params;

    const history = await pool.query<HistoryI>(
      "SELECT" +
        " h.id," +
        " h.description," +
        " t.id type_id," +
        " t.name type_name," +
        " t.amount_prefix type_amount_prefix," +
        " w.id wallet_id," +
        " w.name wallet_name," +
        " c.id category_id," +
        " c.name category_name," +
        " c.color category_color," +
        " h.datetime," +
        " h.amount," +
        " ARRAY_AGG(JSON_BUILD_OBJECT('id', i.id, 'file_name', i.file_name)) FILTER (WHERE i.id IS NOT NULL) images," +
        " CASE WHEN h.location IS NOT NULL THEN JSON_BUILD_OBJECT('lat', ST_Y(h.location::geometry), 'lng', ST_X(h.location::geometry)) ELSE NULL END location," +
        " h.location_name," +
        " h.location_display_name" +
        " FROM history h" +
        " JOIN wallets w ON w.id = h.wallet_id" +
        " JOIN categories c ON c.id = h.category_id" +
        " JOIN types t ON t.id = c.type_id" +
        " LEFT JOIN history_images hi ON hi.history_id = h.id" +
        " LEFT JOIN images i ON i.id = hi.image_id AND i.user_id = h.user_id" +
        " WHERE h.id = $1 AND h.user_id = $2" +
        " GROUP BY h.id, t.id, w.id, c.id",
      [id, tokenData.userId]
    );

    return NextResponse.json(history.rows[0]);
  } catch (error) {
    Log.error("Failed to get a history:", error);
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
  { params }: { params: Promise<{ id: string }> }
) {
  const token = getTokenCookie(request);

  try {
    const tokenData = await processToken(token);

    const clientTimezone = request.headers.get("x-time-zone");

    const { id: idStr } = await params;
    const id = Number(idStr);

    const { fields, files } = await parseFormData(request);

    const {
      description: descriptions,
      wallet_id: wallet_ids,
      category_id: category_ids,
      datetime: datetimes,
      amount: amounts,
      images,
      location: locations,
      location_name: location_names,
      location_display_name: location_display_names,
    } = fields;

    const description = descriptions![0];
    const wallet_id = wallet_ids![0];
    const category_id = category_ids![0];
    const datetime = datetimes![0];
    const amount = amounts![0];
    const imageArrObj = [];
    if (images) {
      for (const image of images) {
        const imgObj: { id: string; file_name: string } = JSON.parse(image);
        imageArrObj.push(imgObj);
      }
    }
    const location = locations?.[0]
      ? (JSON.parse(locations[0]) as HistoryLocationI)
      : undefined;
    const location_name = location_names?.[0];
    const location_display_name = location_display_names?.[0];

    let uploadedImages: formidable.File[] = [];
    if (files.images) {
      if (Array.isArray(files.images)) {
        uploadedImages = files.images;
      } else {
        uploadedImages = [files.images];
      }
    }

    await validateWalletId(clientTimezone, tokenData.userId, wallet_id);
    await validateCategoryId(clientTimezone, tokenData.userId, category_id);

    const client = await pool.connect();

    let savedImages: SavedImage[] = [];
    try {
      await client.query("BEGIN");

      const updatedHistory = await client.query(
        "UPDATE history SET" +
          " description = $1," +
          " wallet_id = $2," +
          " category_id = $3," +
          " datetime = $4," +
          " amount = $5," +
          " location = ST_SetSRID(ST_MakePoint($6, $7), 4326)," +
          " location_name = $8," +
          " location_display_name = $9" +
          " WHERE" +
          " id = $10" +
          " AND user_id = $11",
        [
          description,
          wallet_id,
          category_id,
          datetime,
          amount,
          location?.lng,
          location?.lat,
          location_name,
          location_display_name,
          id,
          tokenData.userId,
        ]
      );
      if (!updatedHistory.rowCount) {
        throw new Error("Invalid history");
      }

      const toBeDeletedImages = [];

      const historyImages = await client.query<HistoryImageI>(
        "SELECT h.id history_id, hi.image_id, i.path image_path" +
          " FROM history_images hi" +
          " JOIN history h ON h.id = hi.history_id" +
          " JOIN images i ON i.id = hi.image_id AND i.user_id = h.user_id" +
          " WHERE h.id = $1 AND h.user_id = $2",
        [id, tokenData.userId]
      );
      for (const historyImage of historyImages.rows) {
        if (
          imageArrObj.findIndex(
            (image) => image.id === historyImage.image_id
          ) === -1
        ) {
          toBeDeletedImages.push({
            id: historyImage.image_id,
            path: historyImage.image_path,
          });
        }
      }
      if (toBeDeletedImages.length) {
        const toBeDeletedImageIds = toBeDeletedImages.map((i) => i.id);
        const deletedImage = await client.query(
          "DELETE FROM images WHERE id = ANY($1) AND user_id = $2",
          [toBeDeletedImageIds, tokenData.userId]
        );
        if (deletedImage.rowCount) {
          await client.query(
            "DELETE FROM history_images WHERE history_id = $1 AND image_id = ANY($2)",
            [id, toBeDeletedImageIds]
          );
        }
      }

      savedImages = await saveImages(uploadedImages, tokenData.userId);

      await insertImagesTx(client, savedImages, tokenData.userId);

      await insertHistoryImagesTx(client, id, savedImages);

      const history = await selectHistoryTx(client, id, tokenData.userId);

      await client.query("COMMIT");

      await deleteImages(toBeDeletedImages.map((i) => i.path!));

      return NextResponse.json(history.rows[0]);
    } catch (error) {
      await client.query("ROLLBACK");
      await deleteImages(savedImages.map((i) => i.path));
      throw error;
    } finally {
      client.release();
    }
  } catch (error) {
    Log.error("Failed to update a history:", error);
    return NextResponse.json(
      {
        error: "Failed to update a history",
      },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const token = getTokenCookie(request);

  try {
    const tokenData = await processToken(token);

    const { id } = await params;

    const client = await pool.connect();

    try {
      await client.query("BEGIN");

      const toBeDeletedImages = [];

      const historyImages = await client.query<HistoryImageI>(
        "SELECT h.id history_id, hi.image_id, i.path image_path" +
          " FROM history_images hi" +
          " JOIN history h ON h.id = hi.history_id" +
          " JOIN images i ON i.id = hi.image_id AND i.user_id = h.user_id" +
          " WHERE h.id = $1 AND h.user_id = $2",
        [id, tokenData.userId]
      );

      const deletedHistory = await client.query(
        "DELETE FROM history WHERE id = $1 AND user_id = $2",
        [id, tokenData.userId]
      );
      if (!deletedHistory.rowCount) {
        throw new Error("Invalid history");
      }

      for (const historyImage of historyImages.rows) {
        toBeDeletedImages.push({
          id: historyImage.image_id,
          path: historyImage.image_path,
        });
      }
      if (toBeDeletedImages.length) {
        const toBeDeletedImageIds = toBeDeletedImages.map((i) => i.id);
        const deletedImage = await client.query(
          "DELETE FROM images WHERE id = ANY($1) AND user_id = $2",
          [toBeDeletedImageIds, tokenData.userId]
        );
        if (deletedImage.rowCount) {
          await client.query(
            "DELETE FROM history_images WHERE history_id = $1 AND image_id = ANY($2)",
            [id, toBeDeletedImageIds]
          );
        }
      }

      await client.query("COMMIT");

      await deleteImages(toBeDeletedImages.map((i) => i.path!));

      return NextResponse.json({ id });
    } catch (error) {
      await client.query("ROLLBACK");
      throw error;
    } finally {
      client.release();
    }
  } catch (error) {
    Log.error("Failed to delete a history:", error);
    return NextResponse.json(
      {
        error: "Failed to delete a history",
      },
      { status: 500 }
    );
  }
}
