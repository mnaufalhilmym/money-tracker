import { NextResponse } from "next/server";
import { parse } from "tldts";

export default function removeTokenCookie(response: NextResponse) {
  if (process.env.COOKIE_KEY) {
    let rootDomain = undefined;
    if (process.env.COOKIE_DOMAIN) {
      rootDomain = parse(process.env.COOKIE_DOMAIN).domain ?? undefined;
    }
    response.cookies.set(process.env.COOKIE_KEY, "", {
      domain: rootDomain,
      path: "/",
      secure: process.env.NODE_ENV === "production",
      httpOnly: true,
      sameSite: "strict",
      maxAge: 0,
    });
  }
}
