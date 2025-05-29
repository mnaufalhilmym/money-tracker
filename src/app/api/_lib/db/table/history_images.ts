import { PoolClient } from "pg";

const migrationDatetimes = [new Date("2025-05-29T08:20:00+07:00")];

export default async function migrateHistoryImagesTable(
  client: PoolClient,
  migrateDatetime: Date
) {
  if (migrateDatetime.getTime() === migrationDatetimes[0].getTime()) {
    console.info(
      "Running migrateHistoryImagesTable for",
      migrationDatetimes[0]
    );

    await client.query(
      "CREATE TABLE IF NOT EXISTS history_images (" +
        "history_id INTEGER NOT NULL," +
        "image_id UUID NOT NULL" +
        ")"
    );
  }
}
