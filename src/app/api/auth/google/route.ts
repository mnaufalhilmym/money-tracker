import { OAuth2Client } from "google-auth-library";
import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

const CLIENT_ID = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID;

const client = new OAuth2Client(CLIENT_ID);

export async function GET(request: NextRequest) {
  request.cookies.get("money_tracker_token");
  const cookieStore = await cookies();
  const tokenCookie = cookieStore.get("money_tracker_token");
  const token = tokenCookie?.value;

  return processToken(token);
}

export async function POST(request: NextRequest) {
  const body = await request.json();
  const token = body.credential;

  return processToken(token);
}

async function processToken(token?: string) {
  if (!token) {
    return NextResponse.json({ error: "No token provided" }, { status: 400 });
  }

  try {
    const ticket = await client.verifyIdToken({
      idToken: token,
      audience: CLIENT_ID,
    });

    const payload = ticket.getPayload();
    if (!payload) {
      return NextResponse.json(
        { error: "Token payload is empty" },
        { status: 400 }
      );
    }

    const { sub, email, name, picture } = payload;

    const response = NextResponse.json({
      googleId: sub,
      email,
      name,
      picture,
    });

    response.cookies.set("money_tracker_token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 60 * 60 * 24 * 7,
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
