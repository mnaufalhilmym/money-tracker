import pool from "../db";

let hasRun = false;

export default async function createImagesTableIfNotExists() {
  if (hasRun) return;

  console.info("Running createImagesTableIfNotExists");

  await pool.query(
    "CREATE TABLE IF NOT EXISTS images (" +
      "id UUID PRIMARY KEY," +
      "file_name TEXT NOT NULL," +
      "content_type TEXT NOT NULL," +
      "size BIGINT NOT NULL," +
      "driver TEXT NOT NULL," +
      "path TEXT NOT NULL" +
      ")"
  );

  hasRun = true;
}
