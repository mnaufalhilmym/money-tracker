import { clientInternalApiCall } from "../fetch/fromClient";

export default async function getHistory(
  filterQueryParams: {
    key: string;
    value: string | number;
  }[],
  abortSignal?: AbortSignal
) {
  const respHistory = await clientInternalApiCall(
    "/api/history",
    filterQueryParams,
    { signal: abortSignal }
  );
  const history: ApiResponse<HistoryI[]> = await respHistory.json();
  return history;
}
