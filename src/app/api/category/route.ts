import getTokenCookie from "@/util/api/getTokenCookie";
import processToken from "@/util/api/processToken";
import { NextRequest, NextResponse } from "next/server";
import createCategoriesTableIfNotExists from "../_lib/db/table/categories";
import pool from "../_lib/db/db";

export async function GET(request: NextRequest) {
  const token = getTokenCookie(request);

  try {
    const tokenData = await processToken(token);

    const { searchParams } = new URL(request.url);

    const search = searchParams.get("s");
    const filters = searchParams.getAll("f");

    await createCategoriesTableIfNotExists();

    let querySql =
      "SELECT c.id id, c.user_id user_id, c.name name, c.color color, t.id type_id, t.name type_name" +
      " FROM categories c" +
      " JOIN types t ON t.id = c.type_id" +
      " WHERE c.deleted_at IS NULL AND c.user_id = $1";
    const queryParams: any[] = [tokenData.userId];
    if (search) {
      queryParams.push(`%${search}%`);
      querySql += ` AND c.name ILIKE $${queryParams.length}`;
    }

    queryParams.push(filters);
    querySql += ` AND t.id = ANY($${queryParams.length})`;

    const categories = await pool.query<CategoryI>(querySql, queryParams);

    return NextResponse.json(categories.rows);
  } catch (error) {
    console.error("Failed to get many categories:", error);
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

    await createCategoriesTableIfNotExists();

    const client = await pool.connect();

    try {
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

      client.query("COMMIT");

      return NextResponse.json(category.rows[0]);
    } catch (error) {
      client.query("ROLLBACK");
      throw error;
    } finally {
      client.release();
    }
  } catch (error) {
    console.error("Failed to add new category:", error);
    return NextResponse.json(
      {
        error: "Failed to add new category",
      },
      { status: 500 }
    );
  }
}
