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
    const filterCategories = searchParams.getAll("fc");
    let limit = Number(searchParams.get("l"));
    let page = Number(searchParams.get("p"));

    await dbMigrate();

    let querySql =
      "SELECT" +
      " w.id id," +
      " w.user_id user_id," +
      " w.name name," +
      " t.id type_id," +
      " t.name type_name" +
      (calculateAmount ? ", COALESCE(SUM(h.amount), 0) amount" : "") +
      (calculateAmount
        ? ", COALESCE(ROUND(SUM(h.amount)*100.0/SUM(SUM(h.amount)) OVER(), 2), 0) amount_percentage"
        : "") +
      (calculateAmount
        ? ", COALESCE(ROUND(SUM(h.amount) * 1.0 / NULLIF(COUNT(DISTINCT DATE(h.datetime)), 0), 2), 0) amount_average_per_day"
        : "") +
      " FROM wallets w" +
      " JOIN types t ON t.id = w.type_id" +
      (calculateAmount || filterCategories.length || filterDatetimeFrom
        ? " LEFT JOIN history h ON h.wallet_id = w.id" +
          (filterDatetimeFrom ? "  AND h.datetime >= $2" : "")
        : "") +
      (filterCategories.length
        ? " LEFT JOIN categories c ON c.id = h.category_id"
        : "") +
      " WHERE w.deleted_at IS NULL AND w.user_id = $1";
    const queryParams: any[] = [tokenData.userId];

    if (filterDatetimeFrom) {
      queryParams.push(filterDatetimeFrom);
    }

    if (search) {
      queryParams.push(`%${search}%`);
      querySql += ` AND w.name ILIKE $${queryParams.length}`;
    }

    queryParams.push(filterTypes);
    querySql += ` AND t.id = ANY($${queryParams.length})`;

    if (filterCategories.length) {
      queryParams.push(filterCategories);
      querySql += ` AND c.id = ANY($${queryParams.length})`;
    }

    if (calculateAmount) {
      querySql += " GROUP BY w.id, t.id";
    }

    const queryTotalParams = [...queryParams];
    const queryTotalSql = `SELECT COUNT(1) total FROM (${querySql})`;

    querySql += " ORDER BY";
    if (sortTypeFirst) {
      querySql += " t.id ASC,";
    }
    querySql += " w.name ASC";

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

    const [wallets, total] = await Promise.all([
      pool.query<WalletI>(querySql, queryParams),
      pool.query<{ total: number }>(queryTotalSql, queryTotalParams),
    ]);

    return NextResponse.json<ApiResponse<WalletI[]>>({
      data: wallets.rows,
      total: total.rows[0].total,
    });
  } catch (error) {
    Log.error("Failed to get many wallets:", error);
    return NextResponse.json(
      {
        error: "Failed to get many wallets",
      },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  const token = getTokenCookie(request);

  try {
    const tokenData = await processToken(token);

    const { name, type_id } = await request.json();

    await dbMigrate();

    const client = await pool.connect();

    try {
      await client.query("BEGIN");

      const insertQuery = await client.query<{ id: number }>(
        "INSERT INTO wallets (name, user_id, type_id) VALUES ($1, $2, $3) RETURNING id",
        [name, tokenData.userId, type_id]
      );

      const id = insertQuery.rows[0].id;

      const wallet = await client.query<WalletI>(
        "SELECT w.id, w.user_id, w.name, w.type_id, t.name" +
          " FROM wallets w" +
          " JOIN types t ON t.id = w.type_id" +
          " WHERE w.deleted_at IS NULL AND w.id = $1 AND w.user_id = $2",
        [id, tokenData.userId]
      );

      await client.query("COMMIT");

      return NextResponse.json(wallet.rows[0]);
    } catch (error) {
      await client.query("ROLLBACK");
      throw error;
    } finally {
      client.release();
    }
  } catch (error) {
    Log.error("Failed to add new wallet:", error);
    return NextResponse.json(
      {
        error: "Failed to add new wallet",
      },
      { status: 500 }
    );
  }
}
