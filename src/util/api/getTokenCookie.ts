import { NextRequest } from "next/server";

export default function getTokenCookie(request: NextRequest) {
  return process.env.COOKIE_KEY
    ? request.cookies.get(process.env.COOKIE_KEY)?.value
    : undefined;
}
