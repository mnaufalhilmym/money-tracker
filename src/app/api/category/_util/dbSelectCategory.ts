import pool from "../../_lib/db/db";

export async function selectCategory(
  id: string,
  userId: string,
  calculateAmount?: boolean
) {
  let querySql =
    "SELECT" +
    " c.id id," +
    " c.user_id user_id," +
    " c.name name," +
    " c.color color," +
    " c.type_id type_id," +
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
    (calculateAmount ? " LEFT JOIN history h ON h.category_id = c.id" : "") +
    " WHERE c.deleted_at IS NULL AND c.id = $1 AND c.user_id = $2";
  const queryParams: any[] = [id, userId];

  if (calculateAmount) {
    querySql += " GROUP BY c.id, t.id";
  }

  return await pool.query<CategoryI>(querySql, queryParams);
}
