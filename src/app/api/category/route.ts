import getTokenCookie from "@/util/api/getTokenCookie";
import processToken from "@/util/api/processToken";
import { NextRequest, NextResponse } from "next/server";
import pool from "../_lib/db/db";
import dbMigrate from "../_lib/db/migrate";
import Log from "@/util/log";

export async function GET(request: NextRequest) {
  const token = getTokenCookie(request);

  try {
    const tokenData = await processToken(token);

    const { searchParams } = new URL(request.url);

    const calculateAmount = !!searchParams.get("a");
    const sortTypeFirst = !!searchParams.get("st");
    const search = searchParams.get("s");
    const filterDatetimeFrom = searchParams.get("dtf");
    const filterTypes = searchParams.getAll("ft");
    const filterWallets = searchParams.getAll("fw");
    let limit = Number(searchParams.get("l"));
    let page = Number(searchParams.get("p"));

    await dbMigrate();

    let querySql =
      "SELECT" +
      " c.id id," +
      " c.user_id user_id," +
      " c.name name," +
      " c.color color," +
      " t.id type_id," +
      " t.name type_name" +
      (calculateAmount ? ", COALESCE(SUM(h.amount), 0) amount" : "") +
      (calculateAmount
        ? ", COALESCE(ROUND(SUM(h.amount)*100.0/SUM(SUM(h.amount)) OVER(), 2), 0) amount_percentage"
        : "") +
      (calculateAmount
        ? ", COALESCE(ROUND(SUM(h.amount) * 1.0 / NULLIF(COUNT(DISTINCT DATE(h.datetime)), 0), 2), 0) amount_average_per_day"
        : "") +
      " FROM categories c" +
      " JOIN types t ON t.id = c.type_id" +
      (calculateAmount || filterWallets.length
        ? " LEFT JOIN history h ON h.category_id = c.id"
        : "") +
      (filterWallets.length
        ? " LEFT JOIN wallets w ON w.id = h.wallet_id"
        : "") +
      " WHERE c.deleted_at IS NULL AND c.user_id = $1";
    const queryParams: any[] = [tokenData.userId];

    if (search) {
      queryParams.push(`%${search}%`);
      querySql += ` AND c.name ILIKE $${queryParams.length}`;
    }

    if (calculateAmount && filterDatetimeFrom) {
      queryParams.push(filterDatetimeFrom);
      querySql += ` AND h.datetime >= $${queryParams.length}`;
    }

    queryParams.push(filterTypes);
    querySql += ` AND t.id = ANY($${queryParams.length})`;

    if (filterWallets.length) {
      queryParams.push(filterWallets);
      querySql += ` AND w.id = ANY($${queryParams.length})`;
    }

    if (calculateAmount) {
      querySql += " GROUP BY c.id, t.id";
    }

    const queryTotalParams = [...queryParams];
    const queryTotalSql = `SELECT COUNT(1) total FROM (${querySql})`;

    querySql += " ORDER BY";
    if (sortTypeFirst) {
      querySql += " t.id ASC,";
    }
    querySql += " c.name ASC";

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

    const [categories, total] = await Promise.all([
      pool.query<CategoryI>(querySql, queryParams),
      pool.query<{ total: number }>(queryTotalSql, queryTotalParams),
    ]);

    return NextResponse.json<ApiResponse<CategoryI[]>>({
      data: categories.rows,
      total: total.rows[0].total,
    });
  } catch (error) {
    Log.error("Failed to get many categories:", error);
    return NextResponse.json(
      {
        error: "Failed to get many categories",
      },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  const token = getTokenCookie(request);

  try {
    const tokenData = await processToken(token);

    const { name, color, type_id } = await request.json();

    await dbMigrate();

    const client = await pool.connect();

    try {
      await client.query("BEGIN");

      const insertQuery = await client.query<{ id: number }>(
        "INSERT INTO categories" +
          " (user_id, name, color, type_id)" +
          " VALUES ($1, $2, $3, $4)" +
          " RETURNING id",
        [tokenData.userId, name, color, type_id]
      );

      const id = insertQuery.rows[0].id;

      const category = await client.query<CategoryI>(
        "SELECT c.id id, c.user_id user_id, c.name name, c.color color, t.id type_id, t.name type_name" +
          " FROM categories c" +
          " JOIN types t ON t.id = c.type_id" +
          " WHERE c.deleted_at IS NULL AND c.id = $1 AND c.user_id = $2",
        [id, tokenData.userId]
      );

      await client.query("COMMIT");

      return NextResponse.json(category.rows[0]);
    } catch (error) {
      await client.query("ROLLBACK");
      throw error;
    } finally {
      client.release();
    }
  } catch (error) {
    Log.error("Failed to add new category:", error);
    return NextResponse.json(
      {
        error: "Failed to add new category",
      },
      { status: 500 }
    );
  }
}
