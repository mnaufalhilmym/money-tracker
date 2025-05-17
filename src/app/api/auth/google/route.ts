import getTokenCookie from "@/util/api/getTokenCookie";
import processToken from "@/util/api/processToken";
import removeTokenCookie from "@/util/api/removeTokenCookie";
import { NextRequest, NextResponse } from "next/server";

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

    response.cookies.set("money_tracker_token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: secsUntilExpire,
      path: "/",
    });

    return response;
  } catch (error) {
    console.error("Error verifying Google token:", error);
    return NextResponse.json(
      { error: "Token verification failed" },
      { status: 401 }
    );
  }
}
