import { clientInternalApiCall } from "../fetch/fromClient";

export default async function getTypes() {
  const response = await clientInternalApiCall("/api/type");
  const types: TypeI[] = await response.json();
  return types;
}
