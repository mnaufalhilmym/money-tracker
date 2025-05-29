import { PoolClient } from "pg";

const migrationDatetimes = [new Date("2025-05-29T08:20:00+07:00")];

export default async function migrateImagesTable(
  client: PoolClient,
  migrateDatetime: Date
) {
  if (migrateDatetime.getTime() === migrationDatetimes[0].getTime()) {
    console.info("Running migrateImagesTable for", migrationDatetimes[0]);

    await client.query(
      "CREATE TABLE IF NOT EXISTS images (" +
        "id UUID PRIMARY KEY," +
        "file_name TEXT NOT NULL," +
        "content_type TEXT NOT NULL," +
        "size BIGINT NOT NULL," +
        "driver TEXT NOT NULL," +
        "path TEXT NOT NULL" +
        ")"
    );
  }
}
