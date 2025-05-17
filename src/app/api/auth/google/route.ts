import processToken from "@/util/api/processToken";
import { apiRemoveTokenCookie } from "@/util/api/removeTokenCookie";
import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  request.cookies.get("money_tracker_token");
  const cookieStore = await cookies();
  const tokenCookie = cookieStore.get("money_tracker_token");
  const token = tokenCookie?.value;

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
    apiRemoveTokenCookie(response);
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

    response.cookies.set("money_tracker_token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: tokenData.exp,
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
