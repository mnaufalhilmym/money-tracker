"use client";

export async function clientInternalApiCall(url: string, init?: RequestInit) {
  return await fetch(new URL(url, process.env.NEXT_PUBLIC_SITE_URL), init);
}
