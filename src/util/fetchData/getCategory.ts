import { clientInternalApiCall } from "../fetch/fromClient";

export default async function getCategory(
  id: number,
  filterQueryParams: {
    key: string;
    value: string | number | Date;
  }[],
  abortSignal?: AbortSignal
) {
  const respCategories = await clientInternalApiCall(
    `/api/category/${id}`,
    filterQueryParams,
    { signal: abortSignal }
  );
  const category: CategoryI = await respCategories.json();
  return category;
}
