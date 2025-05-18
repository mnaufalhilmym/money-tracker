"use client";

import AddIcon from "@/component/icon/AddIcon";
import ArrowBackIcon from "@/component/icon/ArrowBackIcon";
import FilterIcon from "@/component/icon/FilterIcon";
import SearchIcon from "@/component/icon/SearchIcon";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import WalletFormSheet from "./_component/WalletFormSheet";
import WalletFilterSheet from "./_component/WalletFilterSheet";
import { clientInternalApiCall } from "@/util/fetch/fromClient";
import Loading from "@/component/loading/Loading";
import NotFound from "@/component/notFound/NotFound";
import useDebounce from "@/hook/useDebounce";

async function getWallets(params?: { search?: string; filter?: number[] }) {
  const queryParams: { key: string; value: string | number }[] = [];
  if (params?.search) {
    queryParams.push({ key: "s", value: params.search });
  }
  if (params?.filter && params.filter.length > 0) {
    params.filter.forEach((filter) => {
      queryParams.push({ key: "f", value: filter });
    });
  }

  const response = await clientInternalApiCall("/api/wallet", queryParams);

  const data: WalletI[] = await response.json();

  return data;
}

export default function Wallets() {
  const [wallets, setWallets] = useState<{
    data: WalletI[];
    isLoading: boolean;
  }>({ data: [], isLoading: true });

  const [isOpenAddSheet, setIsOpenAddSheet] = useState(false);
  const [isOpenFilterSheet, setIsOpenFilterSheet] = useState(false);
  const [types, setTypes] = useState({ spending: true, saving: true });
  const [editWallet, setEditWallet] = useState<WalletI>();

  const [search, setSearch] = useState("");
  const debounceSearch = useDebounce(search, 500);

  useEffect(() => {
    refreshWallets();
  }, [debounceSearch, types]);

  const spendingWallets = useMemo(() => {
    return wallets.data.filter((w) => w.type_id === 1);
  }, [wallets]);

  const savingWallets = useMemo(() => {
    return wallets.data.filter((w) => w.type_id === 2);
  }, [wallets]);

  async function refreshWallets() {
    const debounceSearchTrim = debounceSearch.trim();
    const search = debounceSearchTrim || undefined;

    const filter: number[] = [];
    if (types.spending) {
      filter.push(1);
    }
    if (types.saving) {
      filter.push(2);
    }

    setWallets((prev) => ({ ...prev, isLoading: true }));
    const data = await getWallets({ search, filter });
    setWallets({ data, isLoading: false });
  }

  return (
    <>
      <div className="pb-4 flex items-center justify-between text-lg">
        <Link href="/" className="p-1">
          <ArrowBackIcon />
        </Link>
        <p className="font-bold text-center">Wallets</p>
        <button
          type="button"
          onClick={() => setIsOpenAddSheet(true)}
          className="p-1"
        >
          <AddIcon />
        </button>
      </div>

      <div className="flex item-center gap-x-2">
        <div className="flex-1 px-4 py-2 flex items-center gap-x-2 rounded-full border border-white/20">
          <SearchIcon />
          <input
            type="text"
            placeholder="Search wallet"
            onChange={(e) => setSearch(e.target.value)}
            className="w-full outline-none"
          />
        </div>
        <button
          type="button"
          onClick={() => setIsOpenFilterSheet(true)}
          className="p-1 text-lg"
        >
          <FilterIcon />
        </button>
      </div>

      <div className="mt-4 space-y-4">
        {!wallets.isLoading ? (
          <>
            {!!spendingWallets.length && (
              <div>
                <p className="font-bold text-lg">Spending</p>
                <div className="mt-2 space-y-2">
                  {spendingWallets.map((w) => (
                    <button
                      key={w.id}
                      onClick={() => setEditWallet(w)}
                      className="block w-full h-8  px-2 text-left border border-white/20 rounded-lg"
                    >
                      <p>{w.name}</p>
                    </button>
                  ))}
                </div>
              </div>
            )}
            {!!savingWallets.length && (
              <div>
                <p className="font-bold text-lg">Saving</p>
                <div className="mt-2 space-y-2">
                  {savingWallets.map((w) => (
                    <button
                      key={w.id}
                      onClick={() => setEditWallet(w)}
                      className="block w-full h-8  px-2 text-left border border-white/20 rounded-lg"
                    >
                      <p>{w.name}</p>
                    </button>
                  ))}
                </div>
              </div>
            )}
            {!spendingWallets.length && !savingWallets.length && <NotFound />}
          </>
        ) : (
          <Loading />
        )}
      </div>

      <WalletFormSheet
        isOpen={isOpenAddSheet || !!editWallet}
        close={() => {
          if (isOpenAddSheet) setIsOpenAddSheet(false);
          if (editWallet) setEditWallet(undefined);
        }}
        wallet={editWallet}
        refreshWallets={refreshWallets}
      />

      <WalletFilterSheet
        isOpen={isOpenFilterSheet}
        close={() => setIsOpenFilterSheet(false)}
        types={types}
        setTypes={setTypes}
      />
    </>
  );
}
