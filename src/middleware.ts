import { NextRequest, NextResponse } from "next/server";

export function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname;
  const token = process.env.COOKIE_KEY
    ? request.cookies.get(process.env.COOKIE_KEY)?.value
    : undefined;

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
