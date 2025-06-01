import getTokenCookie from "@/util/api/getTokenCookie";
import processToken from "@/util/api/processToken";
import { NextRequest, NextResponse } from "next/server";
import pool from "../_lib/db/db";
import parseFormData from "@/util/api/parseFormData";
import formidable from "formidable";
import { deleteImages, saveImages } from "./_util/imageFiles";
import { insertImagesTx } from "./_util/dbInsertImages";
import { insertHistoryImagesTx } from "./_util/dbInsertHistoryImages";
import { selectHistoryTx } from "./_util/dbSelectHistory";
import { validateCategoryId, validateWalletId } from "./_util/validation";
import dbMigrate from "../_lib/db/migrate";
import Log from "@/util/log";

export async function GET(request: NextRequest) {
  const token = getTokenCookie(request);

  try {
    const tokenData = await processToken(token);

    const { searchParams } = new URL(request.url);

    const search = searchParams.get("s");
    const filterDatetimeFrom = searchParams.get("dtf");
    const filterTypes = searchParams.getAll("ft");
    const filterWallets = searchParams.getAll("fw");
    const filterCategories = searchParams.getAll("fc");
    let limit = Number(searchParams.get("l"));
    let page = Number(searchParams.get("p"));

    await dbMigrate();

    let querySql =
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
      " WHERE h.user_id = $1";
    const queryParams: any[] = [tokenData.userId];

    if (search) {
      queryParams.push(`%${search}%`);
      querySql +=
        " AND (" +
        `h.description ILIKE $${queryParams.length}` +
        ` OR h.location_name ILIKE $${queryParams.length}` +
        ` OR h.location_display_name ILIKE $${queryParams.length}` +
        ")";
    }

    if (filterDatetimeFrom) {
      queryParams.push(filterDatetimeFrom);
      querySql += ` AND h.datetime >= $${queryParams.length}`;
    }

    queryParams.push(filterTypes);
    querySql += ` AND t.id = ANY($${queryParams.length})`;

    queryParams.push(filterWallets);
    querySql += ` AND w.id = ANY($${queryParams.length})`;

    queryParams.push(filterCategories);
    querySql += ` AND c.id = ANY($${queryParams.length})`;

    querySql += " GROUP BY h.id, t.id, w.id, c.id";

    const queryTotalParams = [...queryParams];
    const queryTotalSql = `SELECT COUNT(1) total FROM (${querySql})`;

    querySql += " ORDER BY h.datetime DESC";

    if (!(!isNaN(limit) && limit > 0)) {
      limit = 30;
    }
    queryParams.push(limit);
    querySql += ` LIMIT $${queryParams.length}`;

    if (!(!isNaN(page) && page > 1)) {
      page = 1;
    }
    queryParams.push((page - 1) * limit);
    querySql += ` OFFSET $${queryParams.length}`;

    const [history, total] = await Promise.all([
      pool.query<HistoryI>(querySql, queryParams),
      pool.query<{ total: number }>(queryTotalSql, queryTotalParams),
    ]);

    return NextResponse.json<ApiResponse<HistoryI[]>>({
      data: history.rows,
      total: total.rows[0].total,
    });
  } catch (error) {
    Log.error("Failed to get many history:", error);
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
      description: descriptions,
      wallet_id: wallet_ids,
      category_id: category_ids,
      datetime: datetimes,
      amount: amounts,
      location: locations,
      location_name: location_names,
      location_display_name: location_display_names,
    } = fields;

    const description = descriptions![0];
    const wallet_id = wallet_ids![0];
    const category_id = category_ids![0];
    const datetime = datetimes![0];
    const amount = amounts![0];
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

    await dbMigrate();

    await validateWalletId(tokenData.userId, wallet_id?.[0]);
    await validateCategoryId(tokenData.userId, category_id?.[0]);

    const client = await pool.connect();

    let savedImages: SavedImage[] = [];
    try {
      await client.query("BEGIN");

      savedImages = await saveImages(uploadedImages, tokenData.userId);

      await insertImagesTx(client, savedImages, tokenData.userId);

      const insertQuery = await client.query<{ id: number }>(
        "INSERT INTO history" +
          " (user_id, description, wallet_id, category_id, datetime, amount, location, location_name, location_display_name)" +
          " VALUES ($1, $2, $3, $4, $5, $6, ST_SetSRID(ST_MakePoint($7, $8), 4326), $9, $10)" +
          " RETURNING id",
        [
          tokenData.userId,
          description,
          wallet_id,
          category_id,
          datetime,
          amount,
          location?.lng,
          location?.lat,
          location_name,
          location_display_name,
        ]
      );
      const id = insertQuery.rows[0].id;

      await insertHistoryImagesTx(client, id, savedImages);

      const history = await selectHistoryTx(client, id, tokenData.userId);

      await client.query("COMMIT");

      return NextResponse.json(history.rows[0]);
    } catch (error) {
      await client.query("ROLLBACK");
      await deleteImages(savedImages.map((i) => i.path));
      throw error;
    } finally {
      client.release();
    }
  } catch (error) {
    Log.error("Failed to add new history:", error);
    return NextResponse.json(
      {
        error: "Failed to add new history",
      },
      { status: 500 }
    );
  }
}
