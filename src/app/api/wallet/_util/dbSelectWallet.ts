import pool from "../../_lib/db/db";

export async function selectWallet(
  id: string,
  userId: string,
  clientTimezone: string | null,
  calculateAmount?: boolean,
  filterDatetimeFrom?: string | null,
  filterCategories?: string[]
) {
  const queryParams: any[] = [];
  let querySql =
    "SELECT" +
    " w.id id," +
    " w.user_id user_id," +
    " w.name name," +
    " w.type_id type_id," +
    " t.name type_name";

  if (calculateAmount) {
    querySql += ", COALESCE(SUM(h.amount), 0) amount";
    querySql +=
      ", COALESCE(ROUND(SUM(h.amount)*100.0/SUM(SUM(h.amount)) OVER(), 2), 0) amount_percentage";
    queryParams.push(clientTimezone);
    querySql += `, COALESCE(ROUND(SUM(h.amount) * 1.0 / NULLIF(COUNT(DISTINCT DATE(h.datetime AT TIME ZONE $${queryParams.length})), 0), 2), 0) amount_average_per_day`;
  }

  querySql += " FROM wallets w";
  querySql += " JOIN types t ON t.id = w.type_id";

  if (calculateAmount || filterCategories?.length || filterDatetimeFrom) {
    querySql += " LEFT JOIN history h ON h.wallet_id = w.id";
    if (filterDatetimeFrom) {
      queryParams.push(filterDatetimeFrom);
      querySql += ` AND h.datetime >= $${queryParams.length}`;
    }
    if (filterCategories?.length) {
      queryParams.push(filterCategories);
      querySql += ` AND h.category_id = ANY($${queryParams.length})`;
    }
  }

  querySql += " WHERE w.deleted_at IS NULL";
  queryParams.push(id);
  querySql += ` AND w.id = $${queryParams.length}`;
  queryParams.push(userId);
  querySql += ` AND w.user_id = $${queryParams.length}`;

  if (calculateAmount) {
    querySql += " GROUP BY w.id, t.id";
  }

  return await pool.query<WalletI>(querySql, queryParams);
}
