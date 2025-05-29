import { clientInternalApiCall } from "../fetch/fromClient";

export default async function getWallets(
  filterQueryParams: {
    key: string;
    value: number;
  }[]
) {
  const respWallets = await clientInternalApiCall(
    "/api/wallet",
    filterQueryParams
  );
  const wallets: WalletI[] = await respWallets.json();
  return wallets;
}
