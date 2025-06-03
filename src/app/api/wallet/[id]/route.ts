import getTokenCookie from "@/util/api/getTokenCookie";
import processToken from "@/util/api/processToken";
import { NextRequest, NextResponse } from "next/server";
import pool from "../../_lib/db/db";
import { selectWallet } from "../_util/dbSelectWallet";
import dbMigrate from "../../_lib/db/migrate";
import Log from "@/util/log";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const token = getTokenCookie(request);

  try {
    const tokenData = await processToken(token);

    const { id } = await params;
    const { searchParams } = new URL(request.url);

    const calculateAmount = !!searchParams.get("a");
    const filterDatetimeFrom = searchParams.get("dtf");
    const filterCategories = searchParams.getAll("fc");

    await dbMigrate();

    const wallet = await selectWallet(
      id,
      tokenData.userId,
      calculateAmount,
      filterDatetimeFrom,
      filterCategories
    );

    return NextResponse.json(wallet.rows[0]);
  } catch (error) {
    Log.error("Failed to get a wallet:", error);
    return NextResponse.json(
      {
        error: "Failed to get a wallet",
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

    const { id } = await params;

    const { name, type_id } = await request.json();

    await dbMigrate();

    const client = await pool.connect();

    try {
      await client.query("BEGIN");

      await client.query(
        "UPDATE wallets SET name = $1, type_id = $2 WHERE deleted_at IS NULL AND id = $3 AND user_id = $4",
        [name, type_id, id, tokenData.userId]
      );

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
    Log.error("Failed to update a wallet:", error);
    return NextResponse.json(
      {
        error: "Failed to update a wallet",
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

    await dbMigrate();

    await pool.query(
      "UPDATE wallets SET deleted_at = NOW() WHERE id = $1 AND user_id = $2",
      [id, tokenData.userId]
    );

    return NextResponse.json({ id });
  } catch (error) {
    Log.error("Failed to delete a wallet:", error);
    return NextResponse.json(
      {
        error: "Failed to delete a wallet",
      },
      { status: 500 }
    );
  }
}
