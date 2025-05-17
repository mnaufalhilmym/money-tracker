"use client";

import AddIcon from "@/component/icon/AddIcon";
import ArrowBackIcon from "@/component/icon/ArrowBackIcon";
import FilterIcon from "@/component/icon/FilterIcon";
import SearchIcon from "@/component/icon/SearchIcon";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import CategoryFormSheet from "./_component/CategoryFormSheet";
import { COLORS } from "@/constant/color";
import CategoryFilterSheet from "./_component/CategoryFilterSheet";
import { clientInternalApiCall } from "@/util/fetch/fromClient";
import useDebounce from "@/hook/useDebounce";
import Loading from "@/component/loading/Loading";
import NotFound from "@/component/notFound/NotFound";

async function getCategories(params?: { search?: string; filter?: number[] }) {
  const queryParams: { key: string; value: string | number }[] = [];
  if (params?.search) {
    queryParams.push({ key: "s", value: params.search });
  }
  if (params?.filter && params.filter.length > 0) {
    params.filter.forEach((filter) => {
      queryParams.push({ key: "f", value: filter });
    });
  }

  const response = await clientInternalApiCall("/api/category", queryParams);

  const data: CategoryI[] = await response.json();

  return data;
}

export default function Categories() {
  const [categories, setCategories] = useState<{
    data: CategoryI[];
    isLoading: boolean;
  }>({ data: [], isLoading: true });

  const [isOpenAddSheet, setIsOpenAddSheet] = useState(false);
  const [isOpenFilterSheet, setIsOpenFilterSheet] = useState(false);
  const [types, setTypes] = useState({ spending: true, saving: true });
  const [editCategory, setEditCategory] = useState<CategoryI>();

  const [search, setSearch] = useState("");
  const debounceSearch = useDebounce(search, 500);

  useEffect(() => {
    const debounceSearchTrim = debounceSearch.trim();
    const search = debounceSearchTrim || undefined;

    const filter: number[] = [];
    if (types.spending) {
      filter.push(1);
    }
    if (types.saving) {
      filter.push(2);
    }

    refreshCategories({ search, filter });
  }, [debounceSearch, types]);

  async function refreshCategories(params?: {
    search?: string;
    filter?: number[];
  }) {
    setCategories((prev) => ({ ...prev, isLoading: true }));
    const data = await getCategories(params);
    setCategories({ data, isLoading: false });
  }

  const spendingCategories = useMemo(() => {
    return categories.data.filter((c) => c.type_id === 1);
  }, [categories]);
  const savingCategories = useMemo(() => {
    return categories.data.filter((c) => c.type_id === 2);
  }, [categories]);

  return (
    <>
      <div className="pb-4 flex items-center justify-between text-lg">
        <Link href="/" className="p-1">
          <ArrowBackIcon />
        </Link>
        <p className="font-bold text-center">Categories</p>
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
            placeholder="Search category"
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
        {!categories.isLoading ? (
          <>
            {!!spendingCategories.length && (
              <div>
                <p className="font-bold text-lg">Spending</p>
                <div className="mt-2 space-y-2">
                  {spendingCategories.map((c) => (
                    <button
                      key={c.id}
                      onClick={() => setEditCategory(c)}
                      className="w-full flex items-center gap-x-2"
                    >
                      <div
                        className="w-8 h-8 rounded-full"
                        style={{ backgroundColor: c.color }}
                      />
                      <p className="font-bold">{c.name}</p>
                    </button>
                  ))}
                </div>
              </div>
            )}
            {!!savingCategories.length && (
              <div>
                <p className="font-bold text-lg">Saving</p>
                <div className="mt-2 space-y-2">
                  {savingCategories.map((c) => (
                    <button
                      key={c.id}
                      onClick={() => setEditCategory(c)}
                      className="w-full flex items-center gap-x-2"
                    >
                      <div
                        className="w-8 h-8 rounded-full"
                        style={{ backgroundColor: c.color }}
                      />
                      <p className="font-bold">{c.name}</p>
                    </button>
                  ))}
                </div>
              </div>
            )}
            {!spendingCategories.length && !savingCategories.length && (
              <NotFound />
            )}
          </>
        ) : (
          <Loading />
        )}
      </div>

      <CategoryFormSheet
        isOpen={isOpenAddSheet || !!editCategory}
        close={() => {
          if (isOpenAddSheet) setIsOpenAddSheet(false);
          if (editCategory) setEditCategory(undefined);
        }}
        category={editCategory}
        refreshCategories={refreshCategories}
      />

      <CategoryFilterSheet
        isOpen={isOpenFilterSheet}
        close={() => setIsOpenFilterSheet(false)}
        types={types}
        setTypes={setTypes}
      />
    </>
  );
}
