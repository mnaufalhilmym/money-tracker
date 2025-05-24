import getTokenCookie from "@/util/api/getTokenCookie";
import processToken from "@/util/api/processToken";
import { NextRequest, NextResponse } from "next/server";
import createHistoryImagesTableIfNotExists from "../_lib/db/table/history_images";
import pool from "../_lib/db/db";
import parseFormData from "@/util/api/parseFormData";
import formidable from "formidable";
import { deleteImages, saveImages } from "./_util/imageFiles";
import { insertImagesTx } from "./_util/dbInsertImages";
import { insertHistoryImagesTx } from "./_util/dbInsertHistoryImages";
import { selectHistoryTx } from "./_util/dbSelectHistory";
import { validateCategoryId, validateWalletId } from "./_util/validation";

export async function GET(request: NextRequest) {
  const token = getTokenCookie(request);

  try {
    const tokenData = await processToken(token);

    const { searchParams } = new URL(request.url);

    const search = searchParams.get("s");
    const filters = searchParams.getAll("f");

    await createHistoryImagesTableIfNotExists();

    let querySql =
      "SELECT h.id, h.description, t.id type_id, t.name type_name, w.id wallet_id, w.name wallet_name, c.id category_id, c.name category_name, h.datetime, h.amount, ARRAY_AGG(hi.image_id) image_ids, h.location, h.location_name, h.location_display_name" +
      " FROM history h" +
      " JOIN wallets w ON w.id = h.wallet_id" +
      " JOIN categories c ON c.id = h.category_id" +
      " JOIN types t ON t.id = c.type_id" +
      " LEFT JOIN history_images hi ON hi.history_id = h.id" +
      " WHERE h.user_id = $1";
    const queryParams: any[] = [tokenData.userId];
    if (search) {
      queryParams.push(`(%${search}%)`);
      querySql += ` AND h.description ILIKE $${queryParams.length}`;
    }

    queryParams.push(filters);
    querySql += ` AND t.id = ANY($${queryParams.length})`;

    querySql += " GROUP BY h.id, t.id, w.id, c.id";

    const history = await pool.query<HistoryI>(querySql, queryParams);

    return NextResponse.json(history.rows);
  } catch (error) {
    console.error("Failed to get many history:", error);
    return NextResponse.json(
      {
        error: "Failed to get many history",
      },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  const token = getTokenCookie(request);

  try {
    const tokenData = await processToken(token);

    const { fields, files } = await parseFormData(request);

    const {
      description,
      wallet_id,
      category_id,
      datetime,
      amount,
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
      savedImages = await saveImages(uploadedImages, tokenData.userId);

      await insertImagesTx(client, savedImages);

      const insertQuery = await client.query<{ id: number }>(
        "INSERT INTO history" +
          " (user_id, description, wallet_id, category_id, datetime, amount, location, location_name, location_display_name)" +
          " VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)" +
          " RETURNING id",
        [
          tokenData.userId,
          description,
          wallet_id,
          category_id,
          datetime,
          amount,
          location,
          location_name,
          location_display_name,
        ]
      );
      const id = insertQuery.rows[0].id;

      await insertHistoryImagesTx(client, id, savedImages);

      const history = await selectHistoryTx(client, id, tokenData.userId);

      client.query("COMMIT");

      return NextResponse.json(history.rows[0]);
    } catch (error) {
      console.error("Failed to add new history:", error);
      client.query("ROLLBACK");
      await deleteImages(savedImages.map((i) => i.path));
    } finally {
      client.release();
    }
  } catch (error) {
    console.error("Failed to add new history:", error);
    return NextResponse.json(
      {
        error: "Failed to add new history",
      },
      { status: 500 }
    );
  }
}
