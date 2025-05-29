import { clientInternalApiCall } from "../fetch/fromClient";

export default async function getCategories(
  filterQueryParams: {
    key: string;
    value: number;
  }[]
) {
  const respCategories = await clientInternalApiCall(
    "/api/category",
    filterQueryParams
  );
  const categories: CategoryI[] = await respCategories.json();
  return categories;
}
