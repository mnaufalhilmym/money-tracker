import { clientInternalApiCall } from "@/util/fetch/fromClient";

export default async function getAuthData(abortSignal?: AbortSignal) {
  const response = await clientInternalApiCall("/api/auth/google", undefined, {
    signal: abortSignal,
  });
  const data: AuthResponse = await response.json();
  return data;
}
