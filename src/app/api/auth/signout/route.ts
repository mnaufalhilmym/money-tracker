import { NextResponse } from "next/server";

export async function POST() {
  const response = new NextResponse();

  response.cookies.set("money_tracker_token", "", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    maxAge: 0,
    path: "/",
  });

  return response;
}
