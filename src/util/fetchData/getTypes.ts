import { clientInternalApiCall } from "../fetch/fromClient";

export default async function getTypes(abortSignal?: AbortSignal) {
  const response = await clientInternalApiCall("/api/type", undefined, {
    signal: abortSignal,
  });
  const types: TypeI[] = await response.json();
  return types;
}
