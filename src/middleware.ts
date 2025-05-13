import { NextRequest, NextResponse } from "next/server";

export function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname;
  const token = request.cookies.get("money_tracker_token")?.value;

  const isSignInPath = pathname === "/signin";
  const isPublicPath =
    isSignInPath ||
    pathname.startsWith("/_next") ||
    pathname.startsWith("/api");

  if (isSignInPath && token) {
    return NextResponse.redirect(new URL("/", request.url));
  }

  if (!isPublicPath && !token) {
    return NextResponse.redirect(new URL("/signin", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/:path*"],
};
