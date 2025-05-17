import getTokenCookie from "@/util/api/getTokenCookie";
import processToken from "@/util/api/processToken";
import { NextRequest, NextResponse } from "next/server";
import createTypesTableIfNotExists from "../_lib/db/table/types";
import pool from "../_lib/db/db";

export async function GET(request: NextRequest) {
  const token = getTokenCookie(request);

  try {
    await processToken(token);

    createTypesTableIfNotExists();

    const types = await pool.query<TypeI>("SELECT id, name FROM types");

    return NextResponse.json(types.rows);
  } catch (error) {
    console.error("Failed to get all types:", error);
    return NextResponse.json(
      {
        error: "Failed to get all types",
      },
      { status: 500 }
    );
  }
}
