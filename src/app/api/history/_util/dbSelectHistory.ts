import { PoolClient } from "pg";

export async function selectHistoryTx(
  client: PoolClient,
  id: number,
  userId: string
) {
  return await client.query<HistoryI>(
    "SELECT h.id, h.description, t.id type_id, t.name type_name, w.id wallet_id, w.name wallet_name, c.id category_id, c.name category_name, h.datetime, h.amount, ARRAY_AGG(hi.image_id) image_ids, h.location, h.location_name, h.location_display_name" +
      " FROM history h" +
      " JOIN wallets w ON w.id = h.wallet_id" +
      " JOIN categories c ON c.id = h.category_id" +
      " JOIN types t ON t.id = c.type_id" +
      " LEFT JOIN history_images hi ON hi.history_id = h.id" +
      " WHERE h.id = $1 AND h.user_id = $2",
    [id, userId]
  );
}
