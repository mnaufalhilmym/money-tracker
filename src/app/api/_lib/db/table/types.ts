import pool from "../db";

let hasRun = false;

export default async function createTypesTableIfNotExists() {
  if (hasRun) return;

  console.info("Running createTypesTableIfNotExists");

  await pool.query(
    "CREATE TABLE IF NOT EXISTS types (" +
      "id SERIAL PRIMARY KEY," +
      "name TEXT NOT NULL" +
      ")"
  );

  await pool.query(
    "INSERT INTO types (id, name) VALUES" +
      " (1, 'SPENDING')," +
      " (2, 'SAVING')" +
      " ON CONFLICT (id) DO NOTHING"
  );

  hasRun = true;
}
