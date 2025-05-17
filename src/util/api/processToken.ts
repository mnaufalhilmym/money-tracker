"use server";

import { OAuth2Client } from "google-auth-library";

const CLIENT_ID = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID;

const client = new OAuth2Client(CLIENT_ID);

export default async function processToken(token?: string) {
  if (!token) {
    throw new Error("No token provided");
  }

  const ticket = await client.verifyIdToken({
    idToken: token,
    audience: CLIENT_ID,
  });

  const payload = ticket.getPayload();
  if (!payload) {
    throw new Error("Token payload is empty");
  }

  const { sub, email, name, picture, exp } = payload;

  const response = {
    googleId: sub,
    email,
    name,
    picture,
    exp,
  };

  return response;
}
