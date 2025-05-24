import pool from "../db";
import createTypesTableIfNotExists from "./types";

let hasRun = false;

export default async function createCategoriesTableIfNotExists() {
  if (hasRun) return;

  console.info("Running createCategoriesTableIfNotExists");

  await createTypesTableIfNotExists();

  await pool.query(
    "CREATE TABLE IF NOT EXISTS categories (" +
      "id SERIAL PRIMARY KEY," +
      "user_id TEXT NOT NULL," +
      "name TEXT NOT NULL," +
      "color TEXT NOT NULL," +
      "type_id INTEGER NOT NULL," +
      "deleted_at TIMESTAMPTZ NULL" +
      ")"
  );

  hasRun = true;
}
