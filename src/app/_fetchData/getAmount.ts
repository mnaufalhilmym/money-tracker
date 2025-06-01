import { clientInternalApiCall } from "@/util/fetch/fromClient";

export default async function getAmount(
  filterQueryParams: {
    key: string;
    value: string | number | Date;
  }[],
  abortSignal: AbortSignal
) {
  const response = await clientInternalApiCall(
    "/api/amount",
    filterQueryParams,
    {
      signal: abortSignal,
    }
  );
  const data: { amount: AmountI; graph: { key: string; value: number }[] } =
    await response.json();
  return data;
}
