import { clientInternalApiCall } from "../fetch/fromClient";

export default async function getCategories(
  filterQueryParams: {
    key: string;
    value: string | number;
  }[],
  abortSignal?: AbortSignal
) {
  const respCategories = await clientInternalApiCall(
    "/api/category",
    filterQueryParams,
    { signal: abortSignal }
  );
  const categories: ApiResponse<CategoryI[]> = await respCategories.json();
  return categories;
}
