import pool from "../../_lib/db/db";

export async function selectCategory(
  id: string,
  userId: string,
  calculateAmount?: boolean,
  filterDatetimeFrom?: string | null,
  filterWallets?: string[]
) {
  const queryParams: any[] = [];
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
    " JOIN types t ON t.id = c.type_id";

  if (calculateAmount || filterWallets?.length || filterDatetimeFrom) {
    querySql += " LEFT JOIN history h ON h.category_id = c.id";
    if (filterDatetimeFrom) {
      queryParams.push(filterDatetimeFrom);
      querySql += ` AND h.datetime >= $${queryParams.length}`;
    }
    if (filterWallets?.length) {
      queryParams.push(filterWallets);
      querySql += ` AND h.wallet_id = ANY($${queryParams.length})`;
    }
  }

  querySql += " WHERE c.deleted_at IS NULL";
  queryParams.push(id);
  querySql += ` AND c.id = $${queryParams.length}`;
  queryParams.push(userId);
  querySql += ` AND c.user_id = $${queryParams.length}`;

  if (calculateAmount) {
    querySql += " GROUP BY c.id, t.id";
  }

  return await pool.query<CategoryI>(querySql, queryParams);
}
