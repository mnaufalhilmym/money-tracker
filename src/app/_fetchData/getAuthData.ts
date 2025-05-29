import { clientInternalApiCall } from "@/util/fetch/fromClient";

export default async function getAuthData() {
  const response = await clientInternalApiCall("/api/auth/google");
  const data: AuthResponse = await response.json();
  return data;
}
