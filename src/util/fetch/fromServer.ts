"use server";

import { headers } from "next/headers";

export async function serverInternalApiCall(url: string, init?: RequestInit) {
  const clientCookie = (await headers()).get("cookie");

  const clientHeader: HeadersInit = {
    ...(init?.headers || {}),
    ...(clientCookie ? { cookie: clientCookie } : {}),
  };

  return await fetch(new URL(url, process.env.NEXT_PUBLIC_SITE_URL), {
    ...init,
    headers: clientHeader,
  });
}
