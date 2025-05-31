import { PoolClient } from "pg";

const migrationDatetimes = [new Date("2025-05-29T08:20:00+07:00")];

export default async function migrateTypesTable(
  client: PoolClient,
  migrateDatetime: Date
) {
  if (migrateDatetime.getTime() === migrationDatetimes[0].getTime()) {
    console.info("Running migrateTypesTable for", migrationDatetimes[0]);

    await client.query(
      "CREATE TABLE IF NOT EXISTS types (" +
        "id SERIAL PRIMARY KEY," +
        "name TEXT NOT NULL," +
        "amount_prefix TEXT NOT NULL" +
        ")"
    );

    await client.query(
      "INSERT INTO types (id, name, amount_prefix) VALUES" +
        " (1, 'SPENDING', '-')," +
        " (2, 'SAVING', '+')" +
        " ON CONFLICT (id) DO NOTHING"
    );
  }
}
