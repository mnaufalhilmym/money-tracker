import { PoolClient } from "pg";

const migrationDatetimes = [new Date("2025-05-29T08:20:00+07:00")];

export default async function migrateHistoryTable(
  client: PoolClient,
  migrateDatetime: Date
) {
  if (migrateDatetime.getTime() === migrationDatetimes[0].getTime()) {
    console.info("Running migrateHistoryTable for", migrationDatetimes[0]);

    await client.query("CREATE EXTENSION IF NOT EXISTS postgis");

    await client.query(
      "CREATE TABLE IF NOT EXISTS history (" +
        "id SERIAL PRIMARY KEY," +
        "user_id TEXT NOT NULL," +
        "description TEXT NOT NULL," +
        "wallet_id INTEGER NOT NULL," +
        "category_id INTEGER NOT NULL," +
        "datetime TIMESTAMPTZ NOT NULL," +
        "amount BIGINT NOT NULL," +
        "location GEOGRAPHY(POINT, 4326) NULL," + // 4326 is WGS84 (lat/lng)
        "location_name TEXT NULL," +
        "location_display_name TEXT NULL" +
        ")"
    );
  }
}
