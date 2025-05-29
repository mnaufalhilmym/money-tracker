import { PoolClient } from "pg";

const migrationDatetimes = [new Date("2025-05-29T08:20:00+07:00")];

export default async function migrateCategoriesTable(
  client: PoolClient,
  migrateDatetime: Date
) {
  if (migrateDatetime.getTime() === migrationDatetimes[0].getTime()) {
    console.info("Running migrateCategoriesTable for", migrationDatetimes[0]);

    await client.query(
      "CREATE TABLE IF NOT EXISTS categories (" +
        "id SERIAL PRIMARY KEY," +
        "user_id TEXT NOT NULL," +
        "name TEXT NOT NULL," +
        "color TEXT NOT NULL," +
        "type_id INTEGER NOT NULL," +
        "deleted_at TIMESTAMPTZ NULL" +
        ")"
    );
  }
}
