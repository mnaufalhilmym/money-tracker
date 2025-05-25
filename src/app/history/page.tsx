"use client";

import AddIcon from "@/component/icon/AddIcon";
import ArrowBackIcon from "@/component/icon/ArrowBackIcon";
import FilterIcon from "@/component/icon/FilterIcon";
import SearchIcon from "@/component/icon/SearchIcon";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import HistoryFilterSheet from "./_component/HistoryFilterSheet";
import HistoryFormSheet from "./_component/HistoryFormSheet";
import useDebounce from "@/hook/useDebounce";
import { clientInternalApiCall } from "@/util/fetch/fromClient";
import NotFound from "@/component/notFound/NotFound";
import Loading from "@/component/loading/Loading";
import getTypes from "@/util/fetchData/getTypes";

async function getHistory(params?: { search?: string; filter?: number[] }) {
  const queryParams: { key: string; value: string | number }[] = [];
  if (params?.search) {
    queryParams.push({ key: "s", value: params.search });
  }
  if (params?.filter && params.filter.length > 0) {
    params.filter.forEach((filter) => {
      queryParams.push({ key: "f", value: filter });
    });
  }

  const response = await clientInternalApiCall("/api/history", queryParams);

  const data: HistoryI[] = await response.json();

  return data;
}

export default function History() {
  const [isInitialize, setIsInitialize] = useState(true);

  const [types, setTypes] = useState<TypeI[]>([]);
  const [categories, setCategories] = useState<CategoryI[]>([]);
  const [wallets, setWallets] = useState<WalletI[]>([]);
  const [history, setHistory] = useState<{
    data: HistoryI[];
    isLoading: boolean;
  }>({ data: [], isLoading: true });

  const [isOpenAddSheet, setisOpenAddSheet] = useState(false);
  const [isOpenFilterSheet, setIsOpenFilterSheet] = useState(false);
  const [typeFilter, setTypeFilter] = useState<{ [key: string]: boolean }>({});
  const [editHistory, setEditHistory] = useState<HistoryI>();

  const [search, setSearch] = useState("");
  const debounceSearch = useDebounce(search, 500);

  useEffect(() => {
    resetTypesCategoriesWallets();
  }, []);

  useEffect(() => {
    if (isInitialize) return;
    refreshHistory();
  }, [isInitialize, debounceSearch, typeFilter]);

  const groupedHistories = useMemo(() => {
    const grouped = new Map<string, HistoryI[]>();

    if (!history.data.length) return grouped;

    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    const todayKey = today.toLocaleDateString();
    const yesterdayKey = yesterday.toLocaleDateString();

    history.data.forEach((h) => {
      if (h.datetime) {
        const date = new Date(h.datetime);
        h.datetime = date.toLocaleString();

        let dateKey = date.toLocaleDateString();
        if (dateKey === todayKey) dateKey = "Today";
        if (dateKey === yesterdayKey) dateKey = "Yesterday";

        if (!grouped.has(dateKey)) grouped.set(dateKey, []);
        grouped.get(dateKey)!.push(h);
      }
    });

    return grouped;
  }, [history.data]);

  useEffect(() => {
    if (isInitialize) return;
    setHistory((prev) => ({ ...prev, isLoading: false }));
  }, [groupedHistories, types]);

  async function resetTypesCategoriesWallets() {
    setIsInitialize(true);

    const typeData = await getTypes();
    setTypes(typeData);

    const types: { [key: string]: boolean } = {};
    for (const t of typeData) {
      types[t.name!] = true;
    }
    setTypeFilter(types);

    const filterQueryParams: { key: string; value: number }[] = [];
    typeData.forEach((t) => {
      filterQueryParams.push({ key: "f", value: t.id! });
    });

    const respCategories = await clientInternalApiCall(
      "/api/category",
      filterQueryParams
    );
    const categories: CategoryI[] = await respCategories.json();
    setCategories(categories);

    const respWallets = await clientInternalApiCall(
      "/api/wallet",
      filterQueryParams
    );
    const wallets: WalletI[] = await respWallets.json();
    setWallets(wallets);

    setIsInitialize(false);
  }

  async function refreshHistory() {
    const debounceSearchTrim = debounceSearch.trim();
    const search = debounceSearchTrim || undefined;

    const filter: number[] = [];
    for (const [key, value] of Object.entries(typeFilter)) {
      if (!value) continue;
      const id = types.find((t) => t.name === key)?.id;
      if (!id) continue;
      filter.push(id);
    }

    setHistory((prev) => ({ ...prev, isLoading: true }));
    const data = await getHistory({ search, filter });
    setHistory((prev) => ({ ...prev, data }));
  }

  return (
    <>
      <div className="pb-4 flex items-center justify-between text-lg">
        <Link href="/" className="p-1">
          <ArrowBackIcon />
        </Link>
        <p className="font-bold text-center">History</p>
        <button
          type="button"
          onClick={() => setisOpenAddSheet(true)}
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
            placeholder="Search history"
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
        {!history.isLoading ? (
          <>
            {[...groupedHistories].map(([dateKey, items]) => (
              <div key={dateKey}>
                <p className="font-bold text-lg">{dateKey}</p>
                <div className="mt-2 space-y-2">
                  {items.map((i) => (
                    <button
                      key={i.id}
                      onClick={() => setEditHistory(i)}
                      className="w-full flex items-center gap-x-2 justify-between text-left cursor-pointer"
                    >
                      <div className="flex items-center gap-x-2">
                        <div className="w-8 h-8 bg-red-500 rounded-full" />
                        <div>
                          <p className="font-bold">{i.description}</p>
                          <p className="text-xs text-white/70">{i.datetime}</p>
                        </div>
                      </div>
                      <div>
                        <p className="font-bold">{i.amount}</p>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            ))}
            {!groupedHistories.size && <NotFound />}
          </>
        ) : (
          <Loading />
        )}
      </div>

      <HistoryFormSheet
        isOpen={isOpenAddSheet || !!editHistory}
        close={() => {
          if (isOpenAddSheet) setisOpenAddSheet(false);
          if (editHistory) setEditHistory(undefined);
        }}
        history={editHistory}
        types={types}
        categories={categories}
        wallets={wallets}
        refreshHistory={refreshHistory}
      />

      <HistoryFilterSheet
        isOpen={isOpenFilterSheet}
        close={() => setIsOpenFilterSheet(false)}
        types={typeFilter}
        setTypes={setTypeFilter}
      />
    </>
  );
}
