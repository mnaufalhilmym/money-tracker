"use client";

import formatDataField from "../formatDataField";

export async function clientInternalApiCall(
  path: string,
  queryParams?: {
    key: string;
    value: string | number | boolean | Date;
  }[],
  init: RequestInit = {}
) {
  const url = new URL(path, process.env.NEXT_PUBLIC_SITE_URL);

  const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;

  init = {
    ...init,
    headers: {
      ...normalizeHeaders(init.headers),
      "x-time-zone": timezone,
    },
  };

  if (queryParams && queryParams.length > 0) {
    queryParams.forEach(({ key, value }) => {
      if (value !== undefined && value !== null) {
        const formattedValue = formatDataField(value);
        if (formattedValue) {
          if (Array.isArray(formattedValue)) {
            for (const value of formattedValue) {
              url.searchParams.append(key, value);
            }
          } else {
            url.searchParams.append(key, formattedValue);
          }
        }
      }
    });
  }

  return await fetch(url, init);
}

function normalizeHeaders(input?: HeadersInit): Record<string, string> {
  if (!input) return {};

  if (input instanceof Headers) {
    return Object.fromEntries(input.entries());
  }

  if (Array.isArray(input)) {
    return Object.fromEntries(input);
  }

  return { ...input };
}
