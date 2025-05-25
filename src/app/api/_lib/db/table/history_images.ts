import pool from "../db";
import createHistoryTableIfNotExists from "./history";
import createImagesTableIfNotExists from "./images";

let hasRun = false;

export default async function createHistoryImagesTableIfNotExists() {
  if (hasRun) return;

  console.info("Running createHistoryImagesTableIfNotExists");

  await createHistoryTableIfNotExists();
  await createImagesTableIfNotExists();

  await pool.query(
    "CREATE TABLE IF NOT EXISTS history_images (" +
      "history_id INTEGER NOT NULL," +
      "image_id UUID NOT NULL" +
      ")"
  );

  hasRun = true;
}
