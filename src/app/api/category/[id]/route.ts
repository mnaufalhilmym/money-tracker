import getTokenCookie from "@/util/api/getTokenCookie";
import processToken from "@/util/api/processToken";
import { NextRequest, NextResponse } from "next/server";
import createCategoriesTableIfNotExists from "../../_lib/db/table/categories";
import pool from "../../_lib/db/db";

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const token = getTokenCookie(request);

  try {
    const tokenData = await processToken(token);

    const id = params.id;

    await createCategoriesTableIfNotExists();

    const category = await pool.query<CategoryI>(
      "SELECT c.id, c.user_id, c.name, c.color, c.type_id, t.name" +
        " FROM categories c" +
        " JOIN types t ON t.id = c.type_id" +
        " WHERE w.deleted_at IS NULL AND c.id = $1 AND c.user_id = $2",
      [id, tokenData.userId]
    );

    return NextResponse.json(category.rows[0]);
  } catch (error) {
    console.error("Failed to get a category:", error);
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
  { params }: { params: { id: string } }
) {
  const token = getTokenCookie(request);

  try {
    const tokenData = await processToken(token);

    const id = params.id;

    const { name, color, type_id } = await request.json();

    await createCategoriesTableIfNotExists();

    const client = await pool.connect();

    try {
      await client.query(
        "UPDATE categories SET name = $1, color = $2, type_id = $3 WHERE deleted_at IS NULL AND id = $4 AND user_id = $5",
        [name, color, type_id, id, tokenData.userId]
      );

      const category = await client.query<CategoryI>(
        "SELECT c.id id, c.user_id user_id, c.name name, c.color color, c.type_id type_id, t.name type_name" +
          " FROM categories c" +
          " JOIN types t ON t.id = c.type_id" +
          " WHERE c.deleted_at IS NULL AND c.id = $1 AND c.user_id = $2",
        [id, tokenData.userId]
      );

      return NextResponse.json(category.rows[0]);
    } catch {
      client.query("ROLLBACK");
    } finally {
      client.release();
    }
  } catch (error) {
    console.error("Failed to update a category:", error);
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
  { params }: { params: { id: string } }
) {
  const token = getTokenCookie(request);

  try {
    const tokenData = await processToken(token);

    const id = params.id;

    await createCategoriesTableIfNotExists();

    await pool.query(
      "UPDATE categories SET deleted_at = NOW() WHERE id = $1 AND user_id = $2",
      [id, tokenData.userId]
    );

    return NextResponse.json({ id });
  } catch (error) {
    console.error("Failed to delete a category:", error);
    return NextResponse.json(
      {
        error: "Failed to delete a category",
      },
      { status: 500 }
    );
  }
}
