import pool from "../db";
import createTypesTableIfNotExists from "./types";

let hasRun = false;

export default async function createWalletsTableIfNotExists() {
  if (hasRun) return;

  createTypesTableIfNotExists();

  await pool.query(
    "CREATE TABLE IF NOT EXISTS wallets (" +
      "id SERIAL PRIMARY KEY," +
      "user_id TEXT NOT NULL," +
      "name TEXT NOT NULL," +
      "type_id INTEGER NOT NULL," +
      "deleted_at TIMESTAMPTZ NULL" +
      ")"
  );

  hasRun = true;
}
