import { clientInternalApiCall } from "../fetch/fromClient";

export default async function getWallets(
  filterQueryParams: {
    key: string;
    value: string | number;
  }[],
  abortSignal?: AbortSignal
) {
  const respWallets = await clientInternalApiCall(
    "/api/wallet",
    filterQueryParams,
    {
      signal: abortSignal,
    }
  );
  const wallets: ApiResponse<WalletI[]> = await respWallets.json();
  return wallets;
}
