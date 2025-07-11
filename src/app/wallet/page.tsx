"use client";

import AddIcon from "@/component/icon/AddIcon";
import ArrowBackIcon from "@/component/icon/ArrowBackIcon";
import FilterIcon from "@/component/icon/FilterIcon";
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
import toTitleCase from "@/util/titleCase";
import SearchInput from "@/component/input/SearchInput";

async function getWallets(
  abortSignal: AbortSignal,
  params?: { search?: string; filter?: number[]; page?: number },
) {
  const queryParams: { key: string; value: string | number }[] = [
    { key: "st", value: 1 },
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

  const groupedWallets = useMemo(() => {
    if (!wallets.data.length) return [];

    const data: {
      typeId: number;
      formattedTypeName: string;
      data: WalletI[];
    }[] = [];

    for (const wallet of wallets.data) {
      const group = data.find((d) => d.typeId === wallet.type_id);
      if (group) {
        group.data.push(wallet);
      } else {
        data.push({
          typeId: wallet.type_id!,
          formattedTypeName: toTitleCase(wallet.type_name!),
          data: [wallet],
        });
      }
    }

    return data;
  }, [types, wallets.data]);

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
        { search, filter, page: walletsPage },
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
      <div className="flex items-center justify-between pb-4 text-lg">
        <Link href="/" className="p-1">
          <ArrowBackIcon />
        </Link>
        <p className="text-center font-bold">Wallets</p>
        <button
          type="button"
          onClick={() => setIsOpenAddSheet(true)}
          className="cursor-pointer p-1"
        >
          <AddIcon />
        </button>
      </div>

      <div className="item-center flex gap-x-2">
        <div className="min-w-0 flex-1">
          <SearchInput
            placeholder="Search wallet"
            search={search}
            setSearch={setSearch}
          />
        </div>
        <button
          type="button"
          onClick={() => setIsOpenFilterSheet(true)}
          className="cursor-pointer p-1 text-lg"
        >
          <FilterIcon />
        </button>
      </div>

      <div className="mt-4 space-y-4">
        {groupedWallets.map((gw) => (
          <div key={`grouped_wallet_${gw.typeId}`}>
            <p className="text-lg font-bold">{gw.formattedTypeName}</p>
            <div className="mt-2 space-y-2.5">
              {gw.data.map((w) => (
                <button
                  key={w.id}
                  onClick={() => setEditWallet(w)}
                  className="block h-8 w-full cursor-pointer rounded-lg border border-white/20 px-2 text-left"
                >
                  <p>{w.name}</p>
                </button>
              ))}
            </div>
          </div>
        ))}

        {!wallets.isLoading && !groupedWallets.length && <NotFound />}

        {wallets.isLoading && <Loading />}

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
