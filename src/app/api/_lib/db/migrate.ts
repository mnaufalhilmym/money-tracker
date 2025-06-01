import { Mutex, withTimeout } from "async-mutex";
import pool from "./db";
import migrateCategoriesTable from "./table/categories";
import migrateHistoryTable from "./table/history";
import migrateHistoryImagesTable from "./table/history_images";
import migrateImagesTable from "./table/images";
import migrateTypesTable from "./table/types";
import migrateWalletsTable from "./table/wallets";
import Log from "@/util/log";

const mutex = withTimeout(new Mutex(), 100);

let hasRun = false;

const migrationDatetimes = [new Date("2025-05-29T08:20:00+07:00")];

export default async function dbMigrate() {
  try {
    Log.info("Preparing to run migration");
    const release = await mutex.acquire();
    if (hasRun) {
      Log.info("Canceling migration: Migration has been run previously");
      release();
      return;
    }

    Log.info("Running migration");

    const client = await pool.connect();
    try {
      await client.query(
        "CREATE TABLE IF NOT EXISTS _migration (" +
          "datetime TIMESTAMPTZ PRIMARY KEY" +
          ")"
      );

      const lastMigrationDatetime = (
        await client.query<{ datetime: string }>(
          "SELECT datetime FROM _migration ORDER BY datetime DESC LIMIT 1"
        )
      ).rows[0]?.datetime;

      let startIdx = 0;
      if (lastMigrationDatetime) {
        const migrateDatetime = new Date(lastMigrationDatetime).getTime();
        const idx = migrationDatetimes.findLastIndex(
          (d) => d.getTime() === migrateDatetime
        );
        if (idx >= 0) {
          startIdx = idx + 1;
        }
      }

      for (let idx = startIdx; idx < migrationDatetimes.length; ++idx) {
        await client.query("BEGIN");

        await migrateTypesTable(client, migrationDatetimes[idx]);
        await migrateCategoriesTable(client, migrationDatetimes[idx]);
        await migrateWalletsTable(client, migrationDatetimes[idx]);
        await migrateImagesTable(client, migrationDatetimes[idx]);
        await migrateHistoryTable(client, migrationDatetimes[idx]);
        await migrateHistoryImagesTable(client, migrationDatetimes[idx]);

        await client.query(
          "INSERT INTO _migration (datetime) VALUES ($1) ON CONFLICT (datetime) DO NOTHING",
          [migrationDatetimes[idx]]
        );

        await client.query("COMMIT");
      }

      hasRun = true;
      Log.info("Migration finished");
    } catch (error) {
      Log.error("DB migration failed", error);
      await client.query("ROLLBACK");
    } finally {
      client.release();
      release();
    }
  } catch (error) {
    console.error(error);
    return;
  }
}
