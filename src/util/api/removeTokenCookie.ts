import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export function apiRemoveTokenCookie(response: NextResponse) {
  response.cookies.set("money_tracker_token", "", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    maxAge: 0,
    path: "/",
  });
}

export async function serverComponentRemoveTokenCookie() {
  const cookieStore = await cookies();
  cookieStore.set({
    name: "money_tracker_token",
    value: "",
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    maxAge: 0,
    path: "/",
  });
}
