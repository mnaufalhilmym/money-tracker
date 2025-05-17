"use client";

export async function clientInternalApiCall(
  path: string,
  queryParams?: {
    key: string;
    value: string | number | boolean;
  }[],
  init?: RequestInit
) {
  const url = new URL(path, process.env.NEXT_PUBLIC_SITE_URL);

  if (queryParams && queryParams.length > 0) {
    queryParams.forEach(({ key, value }) => {
      url.searchParams.append(key, String(value));
    });
  }

  return await fetch(url, init);
}
