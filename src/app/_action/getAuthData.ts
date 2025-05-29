import { serverInternalApiCall } from "@/util/fetch/fromServer";

export default async function getAuthData() {
  const response = await serverInternalApiCall("/api/auth/google");
  const data: AuthResponse = await response.json();
  return data;
}
