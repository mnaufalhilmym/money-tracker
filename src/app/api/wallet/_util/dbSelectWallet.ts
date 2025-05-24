import pool from "../../_lib/db/db";

export async function selectWallet(id: string, userId: string) {
  return await pool.query<WalletI>(
    "SELECT w.id, w.user_id, w.name, w.type_id, t.name" +
      " FROM wallets w" +
      " JOIN types t ON t.id = w.type_id" +
      " WHERE w.deleted_at IS NULL AND w.id = $1 AND w.user_id = $2",
    [id, userId]
  );
}
