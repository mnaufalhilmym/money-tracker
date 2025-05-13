import { headers } from "next/headers";

export default async function serverApiCall(url: string, init?: RequestInit) {
  const clientCookie = (await headers()).get("cookie");

  const clientHeader: HeadersInit = {
    ...(init?.headers || {}),
    ...(clientCookie ? { cookie: clientCookie } : {}),
  };

  const response = await fetch(new URL(url, process.env.NEXT_PUBLIC_SITE_URL), {
    ...init,
    headers: clientHeader,
  });

  return response;
}
