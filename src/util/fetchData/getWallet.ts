import { clientInternalApiCall } from "../fetch/fromClient";

export default async function getWallet(
  id: number,
  filterQueryParams: {
    key: string;
    value: string | number | Date;
  }[],
  abortSignal?: AbortSignal
) {
  const respWallets = await clientInternalApiCall(
    `/api/wallet/${id}`,
    filterQueryParams,
    {
      signal: abortSignal,
    }
  );
  const wallet: WalletI = await respWallets.json();
  return wallet;
}
