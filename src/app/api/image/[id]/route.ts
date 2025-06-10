import getTokenCookie from "@/util/api/getTokenCookie";
import processToken from "@/util/api/processToken";
import { NextRequest, NextResponse } from "next/server";
import pool from "../../_lib/db/db";
import { createReadStream } from "fs";
import Log from "@/util/log";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const token = getTokenCookie(request);

  try {
    const tokenData = await processToken(token);

    const { id } = await params;

    const image = await pool.query<ImageI>(
      "SELECT" +
        " id," +
        " user_id," +
        " file_name," +
        " content_type," +
        " size," +
        " driver," +
        " path" +
        " FROM images" +
        " WHERE id = $1 AND user_id = $2",
      [id, tokenData.userId]
    );

    if (!image.rows.length) {
      throw new Error("Image does not exist");
    }

    const stream = createReadStream(image.rows[0].path!);

    return new NextResponse(stream as any, {
      status: 200,
      headers: {
        "Content-Type": image.rows[0].content_type!,
        "Cache-Control": "no-store",
      },
    });
  } catch (error) {
    Log.error("Failed to get an image:", error);
    return NextResponse.json(
      {
        error: "Failed to get an image",
      },
      { status: 500 }
    );
  }
}
