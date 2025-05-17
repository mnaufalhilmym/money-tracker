import { apiRemoveTokenCookie } from "@/util/api/removeTokenCookie";
import { NextResponse } from "next/server";

export async function POST() {
  const response = new NextResponse();

  apiRemoveTokenCookie(response);

  return response;
}
