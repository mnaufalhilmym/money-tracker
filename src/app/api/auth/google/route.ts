import getTokenCookie from "@/util/api/getTokenCookie";
import processToken from "@/util/api/processToken";
import removeTokenCookie from "@/util/api/removeTokenCookie";
import { NextRequest, NextResponse } from "next/server";
import { parse } from "tldts";

export async function GET(request: NextRequest) {
  const token = getTokenCookie(request);

  try {
    const tokenData = await processToken(token);

    return NextResponse.json({
      email: tokenData.email,
      name: tokenData.name,
      picture: tokenData.picture,
    });
  } catch (error) {
    console.error("Error verifying Google token:", error);
    const response = NextResponse.json(
      { error: "Token verification failed" },
      { status: 401 }
    );
    removeTokenCookie(response);
    return response;
  }
}

export async function POST(request: NextRequest) {
  const body = await request.json();
  const token = body.credential;

  try {
    const tokenData = await processToken(token);

    const response = NextResponse.json({
      email: tokenData.email,
      name: tokenData.name,
      picture: tokenData.picture,
    });

    const currentTime = Math.floor(Date.now() / 1000);
    const secsUntilExpire = tokenData.exp - currentTime;

    if (process.env.COOKIE_KEY) {
      let rootDomain = undefined;
      if (process.env.COOKIE_DOMAIN) {
        rootDomain = parse(process.env.COOKIE_DOMAIN).domain ?? undefined;
      }
      response.cookies.set(process.env.COOKIE_KEY, token, {
        domain: rootDomain,
        path: "/",
        secure: process.env.NODE_ENV === "production",
        httpOnly: true,
        sameSite: "strict",
        maxAge: secsUntilExpire,
      });
    }

    return response;
  } catch (error) {
    console.error("Error verifying Google token:", error);
    return NextResponse.json(
      { error: "Token verification failed" },
      { status: 401 }
    );
  }
}
