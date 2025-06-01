"use client";

import AddIcon from "@/component/icon/AddIcon";
import ArrowBackIcon from "@/component/icon/ArrowBackIcon";
import FilterIcon from "@/component/icon/FilterIcon";
import SearchIcon from "@/component/icon/SearchIcon";
import Link from "next/link";
import { useEffect, useMemo, useRef, useState } from "react";
import CategoryFormSheet from "./_component/CategoryFormSheet";
import CategoryFilterSheet from "./_component/CategoryFilterSheet";
import useDebounce from "@/hook/useDebounce";
import Loading from "@/component/loading/Loading";
import NotFound from "@/component/notFound/NotFound";
import getTypes from "@/util/fetchData/getTypes";
import apiGetCategories from "@/util/fetchData/getCategories";
import Log from "@/util/log";

async function getCategories(
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

  const data = await apiGetCategories(queryParams, abortSignal);

  return data;
}

export default function Categories() {
  const categoriesFetchAbortController = useRef<AbortController>(null);
  const loadMoreRef = useRef<HTMLDivElement>(null);

  const [isInitialize, setIsInitialize] = useState(true);

  const [types, setTypes] = useState<TypeI[]>([]);
  const [categories, setCategories] = useState<{
    data: CategoryI[];
    isLoading: boolean;
    page: number;
    canLoadMore: boolean;
  }>({ data: [], isLoading: true, page: 0, canLoadMore: true });

  const [isOpenAddSheet, setIsOpenAddSheet] = useState(false);
  const [isOpenFilterSheet, setIsOpenFilterSheet] = useState(false);
  const [typeFilter, setTypeFilter] = useState<{ [key: string]: boolean }>({});
  const [editCategory, setEditCategory] = useState<CategoryI>();

  const [search, setSearch] = useState("");
  const debounceSearch = useDebounce(search, 500);

  const spendingCategories = useMemo(() => {
    return categories.data.filter((c) => c.type_id === 1);
  }, [categories.data]);

  const savingCategories = useMemo(() => {
    return categories.data.filter((c) => c.type_id === 2);
  }, [categories.data]);

  useEffect(() => {
    resetTypes();
  }, []);

  useEffect(() => {
    if (!loadMoreRef.current) return;

    const intersectionObserver = new IntersectionObserver((entries) => {
      if (
        entries[0].isIntersecting &&
        !isInitialize &&
        categories.canLoadMore
      ) {
        fetchCategories();
      }
    });

    intersectionObserver.observe(loadMoreRef.current);

    return () => {
      intersectionObserver.disconnect();
    };
  }, [loadMoreRef.current, categories.data]);

  useEffect(() => {
    if (isInitialize) return;

    fetchCategories(true);
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

  async function fetchCategories(reset?: boolean) {
    categoriesFetchAbortController.current?.abort();
    categoriesFetchAbortController.current = new AbortController();

    let categoriesPage = 1;
    if (reset) {
      setCategories({ data: [], isLoading: true, page: 0, canLoadMore: true });
    } else {
      categoriesPage = categories.page + 1;
      setCategories((prev) => ({ ...prev, isLoading: true }));
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
      const categories = await getCategories(
        categoriesFetchAbortController.current.signal,
        { search, filter, page: categoriesPage }
      );
      setCategories((prev) => ({
        data: [...prev.data, ...categories.data],
        isLoading: false,
        page: categoriesPage,
        canLoadMore:
          categories.total > prev.data.length + categories.data.length,
      }));
    } catch (error: unknown) {
      if (!(error instanceof Error) || error.name !== "AbortError") {
        Log.error("Error fetchCategories", error);
      }
    }
  }

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
            placeholder="Search category"
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
        {!categories.isLoading ? (
          <>
            {!!spendingCategories.length && (
              <div>
                <p className="font-bold text-lg">Spending</p>
                <div className="mt-2 space-y-2.5">
                  {spendingCategories.map((c) => (
                    <button
                      key={c.id}
                      onClick={() => setEditCategory(c)}
                      className="w-full flex items-center gap-x-2 cursor-pointer"
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
                <div className="mt-2 space-y-2.5">
                  {savingCategories.map((c) => (
                    <button
                      key={c.id}
                      onClick={() => setEditCategory(c)}
                      className="w-full flex items-center gap-x-2 cursor-pointer"
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

        <div ref={loadMoreRef} />
      </div>

      <CategoryFormSheet
        isOpen={isOpenAddSheet || !!editCategory}
        close={() => {
          if (isOpenAddSheet) setIsOpenAddSheet(false);
          if (editCategory) setEditCategory(undefined);
        }}
        category={editCategory}
        refreshCategories={() => fetchCategories(true)}
      />

      <CategoryFilterSheet
        isOpen={isOpenFilterSheet}
        close={() => setIsOpenFilterSheet(false)}
        types={typeFilter}
        setTypes={setTypeFilter}
      />
    </>
  );
}
