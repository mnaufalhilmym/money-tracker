import pool from "../../_lib/db/db";

export async function selectCategory(id: string, userId: string) {
  return await pool.query<CategoryI>(
    "SELECT c.id, c.user_id, c.name, c.color, c.type_id, t.name" +
      " FROM categories c" +
      " JOIN types t ON t.id = c.type_id" +
      " WHERE w.deleted_at IS NULL AND c.id = $1 AND c.user_id = $2",
    [id, userId]
  );
}
