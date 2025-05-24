import pool from "../db";
import createCategoriesTableIfNotExists from "./categories";
import createWalletsTableIfNotExists from "./wallets";

let hasRun = false;

export default async function createHistoryTableIfNotExists() {
  if (hasRun) return;

  console.info("Running createHistoryTableIfNotExists");

  await createWalletsTableIfNotExists();
  await createCategoriesTableIfNotExists();

  await pool.query("CREATE EXTENSION IF NOT EXISTS postgis");

  await pool.query(
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

  hasRun = true;
}
