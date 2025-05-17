import { NextRequest } from "next/server";

export default function getTokenCookie(request: NextRequest) {
  return request.cookies.get("money_tracker_token")?.value;
}
