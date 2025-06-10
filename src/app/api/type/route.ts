import getTokenCookie from "@/util/api/getTokenCookie";
import processToken from "@/util/api/processToken";
import { NextRequest, NextResponse } from "next/server";
import pool from "../_lib/db/db";
import Log from "@/util/log";

export async function GET(request: NextRequest) {
  const token = getTokenCookie(request);

  try {
    await processToken(token);

    const types = await pool.query<TypeI>("SELECT id, name FROM types");

    return NextResponse.json(types.rows);
  } catch (error) {
    Log.error("Failed to get all types:", error);
    return NextResponse.json(
      {
        error: "Failed to get all types",
      },
      { status: 500 }
    );
  }
}
