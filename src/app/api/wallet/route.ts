import getTokenCookie from "@/util/api/getTokenCookie";
import processToken from "@/util/api/processToken";
import { NextRequest, NextResponse } from "next/server";
import pool from "../_lib/db/db";
import createWalletsTableIfNotExists from "../_lib/db/table/wallets";

export async function GET(request: NextRequest) {
  const token = getTokenCookie(request);

  try {
    const tokenData = await processToken(token);

    createWalletsTableIfNotExists();

    const wallets = await pool.query<WalletI>(
      "SELECT w.id id, w.user_id user_id, w.name name, w.type_id type_id, t.name type_name" +
        " FROM wallets w" +
        " JOIN types t ON t.id = w.type_id" +
        " WHERE w.deleted_at IS NULL AND w.user_id = $1",
      [tokenData.userId]
    );

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

    createWalletsTableIfNotExists();

    const client = await pool.connect();

    try {
      const insertQuery = await client.query<{ id: number }>(
        "INSERT INTO wallets (name, user_id, type_id) VALUES ($1, $2, $3) RETURNING id",
        [name, tokenData.userId, type_id]
      );

      const id = insertQuery.rows[0].id;

      const wallet = await client.query<WalletI>(
        "SELECT w.id, w.user_id, w.name, w.type_id, t.name" +
          " FROM wallets w" +
          " JOIN types t ON t.id = w.type_id" +
          " WHERE w.deleted_at IS NULL AND w.id = $1",
        [id]
      );

      client.query("COMMIT");

      return NextResponse.json(wallet.rows[0]);
    } catch (error) {
      client.query("ROLLBACK");
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
