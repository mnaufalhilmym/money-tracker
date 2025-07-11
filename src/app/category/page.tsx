"use client";

import AddIcon from "@/component/icon/AddIcon";
import ArrowBackIcon from "@/component/icon/ArrowBackIcon";
import FilterIcon from "@/component/icon/FilterIcon";
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
import toTitleCase from "@/util/titleCase";
import SearchInput from "@/component/input/SearchInput";

async function getCategories(
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

  const groupedCategories = useMemo(() => {
    if (!categories.data.length) return [];

    const data: {
      typeId: number;
      formattedTypeName: string;
      data: CategoryI[];
    }[] = [];

    for (const category of categories.data) {
      const group = data.find((d) => d.typeId === category.type_id);
      if (group) {
        group.data.push(category);
      } else {
        data.push({
          typeId: category.type_id!,
          formattedTypeName: toTitleCase(category.type_name!),
          data: [category],
        });
      }
    }

    return data;
  }, [types, categories.data]);

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
        { search, filter, page: categoriesPage },
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
      <div className="flex items-center justify-between pb-4 text-lg">
        <Link href="/" className="p-1">
          <ArrowBackIcon />
        </Link>
        <p className="text-center font-bold">Categories</p>
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
            placeholder="Search category"
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
        {groupedCategories.map((gc) => (
          <div key={`grouped_category_${gc.typeId}`}>
            <p className="text-lg font-bold">{gc.formattedTypeName}</p>
            <div className="mt-2 space-y-2.5">
              {gc.data.map((c) => (
                <button
                  key={c.id}
                  onClick={() => setEditCategory(c)}
                  className="flex w-full cursor-pointer items-center gap-x-2"
                >
                  <div
                    className="h-8 w-8 rounded-full"
                    style={{ backgroundColor: c.color }}
                  />
                  <p className="font-bold">{c.name}</p>
                </button>
              ))}
            </div>
          </div>
        ))}

        {!categories.isLoading && !groupedCategories.length && <NotFound />}

        {categories.isLoading && <Loading />}

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
