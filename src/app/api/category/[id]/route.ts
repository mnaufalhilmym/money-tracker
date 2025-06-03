import getTokenCookie from "@/util/api/getTokenCookie";
import processToken from "@/util/api/processToken";
import { NextRequest, NextResponse } from "next/server";
import pool from "../../_lib/db/db";
import { selectCategory } from "../_util/dbSelectCategory";
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
    const filterWallets = searchParams.getAll("fw");

    await dbMigrate();

    const category = await selectCategory(
      id,
      tokenData.userId,
      calculateAmount,
      filterDatetimeFrom,
      filterWallets
    );

    return NextResponse.json(category.rows[0]);
  } catch (error) {
    Log.error("Failed to get a category:", error);
    return NextResponse.json(
      {
        error: "Failed to get a category",
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

    const { name, color, type_id } = await request.json();

    await dbMigrate();

    const client = await pool.connect();

    try {
      await client.query("BEGIN");

      await client.query(
        "UPDATE categories SET" +
          " name = $1," +
          " color = $2," +
          " type_id = $3" +
          " WHERE" +
          " deleted_at IS NULL" +
          " AND id = $4" +
          " AND user_id = $5",
        [name, color, type_id, id, tokenData.userId]
      );

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
    Log.error("Failed to update a category:", error);
    return NextResponse.json(
      {
        error: "Failed to update a category",
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
      "UPDATE categories SET deleted_at = NOW() WHERE id = $1 AND user_id = $2",
      [id, tokenData.userId]
    );

    return NextResponse.json({ id });
  } catch (error) {
    Log.error("Failed to delete a category:", error);
    return NextResponse.json(
      {
        error: "Failed to delete a category",
      },
      { status: 500 }
    );
  }
}
