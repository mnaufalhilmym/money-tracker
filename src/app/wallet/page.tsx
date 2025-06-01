"use client";

import AddIcon from "@/component/icon/AddIcon";
import ArrowBackIcon from "@/component/icon/ArrowBackIcon";
import FilterIcon from "@/component/icon/FilterIcon";
import SearchIcon from "@/component/icon/SearchIcon";
import Link from "next/link";
import { useEffect, useMemo, useRef, useState } from "react";
import WalletFormSheet from "./_component/WalletFormSheet";
import WalletFilterSheet from "./_component/WalletFilterSheet";
import Loading from "@/component/loading/Loading";
import NotFound from "@/component/notFound/NotFound";
import useDebounce from "@/hook/useDebounce";
import getTypes from "@/util/fetchData/getTypes";
import apiGetWallets from "@/util/fetchData/getWallets";
import Log from "@/util/log";

async function getWallets(
  abortSignal: AbortSignal,
  params?: { search?: string; filter?: number[]; page?: number }
) {
  const queryParams: { key: string; value: string | number }[] = [
    { key: "l", value: 20 },
    { key: "p", value: params?.page && params.page > 1 ? params.page : 1 },
  ];
  if (params?.search) {
    queryParams.push({ key: "s", value: params.search });
  }
  if (params?.filter && params.filter.length > 0) {
    params.filter.forEach((filter) => {
      queryParams.push({ key: "ft", value: filter });
    });
  }

  const data = await apiGetWallets(queryParams, abortSignal);

  return data;
}

export default function Wallets() {
  const walletsFetchAbortController = useRef<AbortController>(null);
  const loadMoreRef = useRef<HTMLDivElement>(null);

  const [isInitialize, setIsInitialize] = useState(true);

  const [types, setTypes] = useState<TypeI[]>([]);
  const [wallets, setWallets] = useState<{
    data: WalletI[];
    isLoading: boolean;
    page: number;
    canLoadMore: boolean;
  }>({ data: [], isLoading: true, page: 0, canLoadMore: true });

  const [isOpenAddSheet, setIsOpenAddSheet] = useState(false);
  const [isOpenFilterSheet, setIsOpenFilterSheet] = useState(false);
  const [typeFilter, setTypeFilter] = useState<{ [key: string]: boolean }>({});
  const [editWallet, setEditWallet] = useState<WalletI>();

  const [search, setSearch] = useState("");
  const debounceSearch = useDebounce(search, 500);

  const spendingWallets = useMemo(() => {
    return wallets.data.filter((w) => w.type_id === 1);
  }, [wallets.data]);

  const savingWallets = useMemo(() => {
    return wallets.data.filter((w) => w.type_id === 2);
  }, [wallets.data]);

  useEffect(() => {
    resetTypes();
  }, []);

  useEffect(() => {
    if (!loadMoreRef.current) return;

    const intersectionObserver = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting && !isInitialize && wallets.canLoadMore) {
        fetchWallets();
      }
    });

    intersectionObserver.observe(loadMoreRef.current);

    return () => {
      intersectionObserver.disconnect();
    };
  }, [loadMoreRef.current, wallets.data]);

  useEffect(() => {
    if (isInitialize) return;

    fetchWallets(true);
  }, [isInitialize, debounceSearch, typeFilter]);

  async function resetTypes() {
    setIsInitialize(true);

    const typesData = await getTypes();
    setTypes(typesData);

    const types: { [key: string]: boolean } = {};
    for (const t of typesData) {
      types[t.name!] = true;
    }
    setTypeFilter(types);

    setIsInitialize(false);
  }

  async function fetchWallets(reset?: boolean) {
    walletsFetchAbortController.current?.abort();
    walletsFetchAbortController.current = new AbortController();

    let walletsPage = 1;
    if (reset) {
      setWallets({ data: [], isLoading: true, page: 0, canLoadMore: true });
    } else {
      walletsPage = wallets.page + 1;
      setWallets((prev) => ({ ...prev, isLoading: true }));
    }

    const search = debounceSearch.trim() || undefined;

    const filter: number[] = [];
    for (const [key, value] of Object.entries(typeFilter)) {
      if (!value) continue;
      const id = types.find((t) => t.name === key)?.id;
      if (!id) continue;
      filter.push(id);
    }

    try {
      const wallets = await getWallets(
        walletsFetchAbortController.current.signal,
        { search, filter, page: walletsPage }
      );
      setWallets((prev) => ({
        data: [...prev.data, ...wallets.data],
        isLoading: false,
        page: walletsPage,
        canLoadMore: wallets.total > prev.data.length + wallets.data.length,
      }));
    } catch (error: unknown) {
      if (!(error instanceof Error) || error.name !== "AbortError") {
        Log.error("Error fetchWallets", error);
      }
    }
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
          className="p-1 cursor-pointer"
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
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full outline-none placeholder:text-neutral-500"
          />
        </div>
        <button
          type="button"
          onClick={() => setIsOpenFilterSheet(true)}
          className="p-1 text-lg cursor-pointer"
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
                <div className="mt-2 space-y-2.5">
                  {spendingWallets.map((w) => (
                    <button
                      key={w.id}
                      onClick={() => setEditWallet(w)}
                      className="block w-full h-8  px-2 text-left border border-white/20 rounded-lg cursor-pointer"
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
                <div className="mt-2 space-y-2.5">
                  {savingWallets.map((w) => (
                    <button
                      key={w.id}
                      onClick={() => setEditWallet(w)}
                      className="block w-full h-8  px-2 text-left border border-white/20 rounded-lg cursor-pointer"
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

        <div ref={loadMoreRef} />
      </div>

      <WalletFormSheet
        isOpen={isOpenAddSheet || !!editWallet}
        close={() => {
          if (isOpenAddSheet) setIsOpenAddSheet(false);
          if (editWallet) setEditWallet(undefined);
        }}
        wallet={editWallet}
        refreshWallets={() => fetchWallets(true)}
      />

      <WalletFilterSheet
        isOpen={isOpenFilterSheet}
        close={() => setIsOpenFilterSheet(false)}
        types={typeFilter}
        setTypes={setTypeFilter}
      />
    </>
  );
}
