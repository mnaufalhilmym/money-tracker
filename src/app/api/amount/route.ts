import getTokenCookie from "@/util/api/getTokenCookie";
import processToken from "@/util/api/processToken";
import { NextRequest, NextResponse } from "next/server";
import dbMigrate from "../_lib/db/migrate";
import pool from "../_lib/db/db";
import Log from "@/util/log";

export async function GET(request: NextRequest) {
  const token = getTokenCookie(request);

  try {
    const tokenData = await processToken(token);

    const { searchParams } = new URL(request.url);

    const filterDatetimeFromStr = searchParams.get("dtf");
    const amountPer = searchParams.get("per");
    if (!amountPer) {
      throw new Error("Invalid per query");
    }
    const filterTypes = searchParams.getAll("ft");
    const filterWallets = searchParams.getAll("fw");
    const filterCategories = searchParams.getAll("fc");

    await dbMigrate();

    let dateTrunc;

    switch (amountPer) {
      case "day":
        dateTrunc = "day";
        break;
      case "week":
        dateTrunc = "week";
        break;
      case "month":
        dateTrunc = "month";
        break;
      default:
        dateTrunc = "year";
    }

    let queryPerSql =
      "SELECT" +
      ` DATE_TRUNC('${dateTrunc}', h.datetime)::DATE key,` +
      " SUM(h.amount) value" +
      " FROM history h" +
      " JOIN wallets w ON w.id = h.wallet_id" +
      " JOIN categories c ON c.id = h.category_id" +
      " JOIN types t ON t.id = c.type_id" +
      " WHERE h.user_id = $1";
    const queryPerParams: any[] = [tokenData.userId];

    let querySql =
      "SELECT" +
      " COALESCE(SUM(h.amount), 0) amount," +
      " COALESCE(ROUND(SUM(h.amount) * 1.0 / NULLIF(COUNT(DISTINCT DATE(h.datetime)), 0), 2), 0) amount_average_per_day" +
      " FROM history h" +
      " JOIN wallets w ON w.id = h.wallet_id" +
      " JOIN categories c ON c.id = h.category_id" +
      " JOIN types t ON t.id = c.type_id" +
      " WHERE h.user_id = $1";
    const queryParams: any[] = [tokenData.userId];

    if (filterDatetimeFromStr) {
      const filterDatetimeFrom = new Date(filterDatetimeFromStr);
      if (!isNaN(filterDatetimeFrom.getTime())) {
        queryParams.push(filterDatetimeFrom);
        querySql += ` AND h.datetime >= $${queryParams.length}`;

        queryPerParams.push(filterDatetimeFrom);
        queryPerSql += ` AND h.datetime >= $${queryPerParams.length}`;
      }
    }

    queryParams.push(filterTypes);
    querySql += ` AND t.id = ANY($${queryParams.length})`;

    queryPerParams.push(filterTypes);
    queryPerSql += ` AND t.id = ANY($${queryPerParams.length})`;

    queryParams.push(filterWallets);
    querySql += ` AND w.id = ANY($${queryParams.length})`;

    queryPerParams.push(filterWallets);
    queryPerSql += ` AND w.id = ANY($${queryPerParams.length})`;

    queryParams.push(filterCategories);
    querySql += ` AND c.id = ANY($${queryParams.length})`;

    queryPerParams.push(filterCategories);
    queryPerSql += ` AND c.id = ANY($${queryPerParams.length})`;

    queryPerSql += " GROUP BY key ORDER BY key ASC";

    const [amount, amountGraph] = await Promise.all([
      pool.query<AmountI>(querySql, queryParams),
      pool.query<{ key: string; value: number }>(queryPerSql, queryPerParams),
    ]);

    return NextResponse.json({
      amount: amount.rows[0],
      graph: amountGraph.rows,
    });
  } catch (error) {
    Log.error("Failed to get total amount:", error);
    return NextResponse.json(
      {
        error: "Failed to get total amount",
      },
      { status: 500 }
    );
  }
}
