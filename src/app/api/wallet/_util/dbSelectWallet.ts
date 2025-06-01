import pool from "../../_lib/db/db";

export async function selectWallet(
  id: string,
  userId: string,
  calculateAmount?: boolean
) {
  let querySql =
    "SELECT" +
    " w.id id," +
    " w.user_id user_id," +
    " w.name name," +
    " w.type_id type_id," +
    " t.name type_name" +
    (calculateAmount ? ", COALESCE(SUM(h.amount), 0) amount" : "") +
    (calculateAmount
      ? ", COALESCE(ROUND(SUM(h.amount)*100.0/SUM(SUM(h.amount)) OVER(), 2), 0) amount_percentage"
      : "") +
    (calculateAmount
      ? ", COALESCE(ROUND(AVG(h.amount), 2), 0) amount_average"
      : "") +
    " FROM wallets w" +
    " JOIN types t ON t.id = w.type_id" +
    (calculateAmount ? " LEFT JOIN history h ON h.wallet_id = w.id" : "") +
    " WHERE w.deleted_at IS NULL AND w.id = $1 AND w.user_id = $2";
  const queryParams: any[] = [id, userId];

  if (calculateAmount) {
    querySql += " GROUP BY w.id, t.id";
  }

  return await pool.query<WalletI>(querySql, queryParams);
}
