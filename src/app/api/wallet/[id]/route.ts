import getTokenCookie from "@/util/api/getTokenCookie";
import processToken from "@/util/api/processToken";
import { NextRequest, NextResponse } from "next/server";
import createWalletsTableIfNotExists from "../../_lib/db/table/wallets";
import pool from "../../_lib/db/db";
import { selectWallet } from "../_util/dbSelectWallet";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const token = getTokenCookie(request);

  try {
    const tokenData = await processToken(token);

    const { id } = await params;

    await createWalletsTableIfNotExists();

    const wallet = await selectWallet(id, tokenData.userId);

    return NextResponse.json(wallet.rows[0]);
  } catch (error) {
    console.error("Failed to get a wallet:", error);
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

    await createWalletsTableIfNotExists();

    const client = await pool.connect();

    try {
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

      return NextResponse.json(wallet.rows[0]);
    } catch {
      client.query("ROLLBACK");
    } finally {
      client.release();
    }
  } catch (error) {
    console.error("Failed to update a wallet:", error);
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

    await createWalletsTableIfNotExists();

    await pool.query(
      "UPDATE wallets SET deleted_at = NOW() WHERE id = $1 AND user_id = $2",
      [id, tokenData.userId]
    );

    return NextResponse.json({ id });
  } catch (error) {
    console.error("Failed to delete a wallet:", error);
    return NextResponse.json(
      {
        error: "Failed to delete a wallet",
      },
      { status: 500 }
    );
  }
}
