import getTokenCookie from "@/util/api/getTokenCookie";
import processToken from "@/util/api/processToken";
import { NextRequest, NextResponse } from "next/server";
import pool from "../_lib/db/db";
import dbMigrate from "../_lib/db/migrate";

export async function GET(request: NextRequest) {
  const token = getTokenCookie(request);

  try {
    const tokenData = await processToken(token);

    const { searchParams } = new URL(request.url);

    const calculateAmount = !!searchParams.get("a");
    const search = searchParams.get("s");
    const filterDatetimeFrom = searchParams.get("dtf");
    const filters = searchParams.getAll("ft");
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
        ? ", COALESCE(ROUND(AVG(h.amount), 2), 0) amount_average"
        : "") +
      " FROM wallets w" +
      " JOIN types t ON t.id = w.type_id" +
      (calculateAmount ? " LEFT JOIN history h ON h.wallet_id = w.id" : "") +
      " WHERE w.deleted_at IS NULL AND w.user_id = $1";
    const queryParams: any[] = [tokenData.userId];

    if (search) {
      queryParams.push(`%${search}%`);
      querySql += ` AND w.name ILIKE $${queryParams.length}`;
    }

    if (calculateAmount && filterDatetimeFrom) {
      queryParams.push(filterDatetimeFrom);
      querySql += ` AND h.datetime >= $${queryParams.length}`;
    }

    queryParams.push(filters);
    querySql += ` AND t.id = ANY($${queryParams.length})`;

    if (calculateAmount) {
      querySql += " GROUP BY w.id, t.id";
    }

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

    const wallets = await pool.query<WalletI>(querySql, queryParams);

    return NextResponse.json(wallets.rows);
  } catch (error) {
    console.error("Failed to get many wallets:", error);
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
    console.error("Failed to add new wallet:", error);
    return NextResponse.json(
      {
        error: "Failed to add new wallet",
      },
      { status: 500 }
    );
  }
}
