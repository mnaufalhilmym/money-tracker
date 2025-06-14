"use client";

import HomeHeader from "./_component/HomeHeader";
import History from "./_component/History";
import Categories from "./_component/Categories";
import Wallets from "./_component/Wallets";
import { useEffect, useMemo, useState } from "react";
import getAuthData from "./_fetchData/getAuthData";
import getTypes from "@/util/fetchData/getTypes";
import TypeSwitcher from "./_component/TypeSwitcher";
import WalletPicker from "./_component/WalletPicker";
import getWallets from "@/util/fetchData/getWallets";
import getCategories from "@/util/fetchData/getCategories";
import CategoryPicker from "./_component/CategoryPicker";
import getHistory from "@/util/fetchData/getHistory";
import Amount from "./_component/Amount";
import Graph from "./_component/Graph";
import Loading from "@/component/loading/Loading";
import getAmount from "./_fetchData/getAmount";
import Log from "@/util/log";
import getCategory from "@/util/fetchData/getCategory";
import getWallet from "@/util/fetchData/getWallet";
import useDateNow from "@/hook/useDateNow";

interface Picker<T> {
  isLoading: boolean;
  active?: { id: number; name: string };
  data: T[];
}

interface Data<T> {
  isLoading: boolean;
  page: number;
  canLoadMore?: boolean;
  data: T[];
}

interface AmountData {
  isLoading: boolean;
  data: AmountI;
  graph: { key: Date; value: number }[];
}

const initialHomeData = {
  isLoading: true,
  data: [],
};

export default function Home() {
  const now = useDateNow();

  const datetimeFromOptions = useMemo(() => {
    if (!now) return [];

    const oneWeekBefore = new Date(now);
    oneWeekBefore.setDate(now.getDate() - 7);
    oneWeekBefore.setHours(0, 0, 0, 0);

    const oneMonthBefore = new Date(now);
    oneMonthBefore.setMonth(now.getMonth() - 1);
    oneMonthBefore.setHours(0, 0, 0, 0);

    const oneYearBefore = new Date(now);
    oneYearBefore.setFullYear(now.getFullYear() - 1);
    oneYearBefore.setHours(0, 0, 0, 0);

    return [
      { per: "day", name: "Last week", datetime: oneWeekBefore },
      { per: "week", name: "Last month", datetime: oneMonthBefore },
      { per: "month", name: "Last year", datetime: oneYearBefore },
      { per: "year", name: "All" },
    ];
  }, [now]);

  const [authData, setAuthData] = useState<{
    data?: AuthResponse;
    isLoading: boolean;
  }>({
    isLoading: true,
  });

  const [typePicker, setTypePicker] = useState<Picker<TypeI>>(initialHomeData);
  const [walletPicker, setWalletPicker] =
    useState<Picker<WalletI>>(initialHomeData);
  const [categoryPicker, setCategoryPicker] =
    useState<Picker<CategoryI>>(initialHomeData);

  const [datetimeFrom, setDatetimeFrom] = useState<AmountDatetimeFrom>();

  const [amount, setAmount] = useState<AmountData>({
    isLoading: true,
    data: { amount: 0, amount_average_per_day: 0 },
    graph: [],
  });

  const [wallet, setWallet] = useState<Data<WalletI>>({
    ...initialHomeData,
    page: 0,
    canLoadMore: true,
  });
  const [category, setCategory] = useState<Data<CategoryI>>({
    ...initialHomeData,
    page: 0,
    canLoadMore: true,
  });
  const [history, setHistory] = useState<Data<HistoryI>>({
    ...initialHomeData,
    page: 0,
    canLoadMore: true,
  });

  useEffect(() => {
    const abortController = new AbortController();

    refreshData(abortController.signal);

    return () => {
      abortController.abort();
    };
  }, []);

  useEffect(() => {
    if (!datetimeFromOptions.length) return;
    setDatetimeFrom(datetimeFromOptions[0]);
  }, [datetimeFromOptions]);

  useEffect(() => {
    const abortController = new AbortController();

    getDataWalletPicker(abortController.signal);
    getDataCategoryPicker(abortController.signal);

    return () => {
      abortController.abort();
    };
  }, [typePicker.active]);

  useEffect(() => {
    const abortController = new AbortController();

    getDataWallets(abortController.signal, true);
    getDataCategories(abortController.signal, true);

    return () => {
      abortController.abort();
    };
  }, [
    typePicker.active,
    walletPicker.active,
    categoryPicker.active,
    datetimeFrom,
  ]);

  useEffect(() => {
    const abortController = new AbortController();

    refreshAmount(abortController.signal);
    getDataHistory(abortController.signal, true);

    return () => {
      abortController.abort();
    };
  }, [
    typePicker.active,
    walletPicker.active,
    walletPicker.data,
    categoryPicker.active,
    categoryPicker.data,
    datetimeFrom,
  ]);

  async function refreshData(abortSignal: AbortSignal) {
    setAuthData({ isLoading: true });
    setTypePicker({ isLoading: true, data: [] });

    try {
      const [authData, types] = await Promise.all([
        getAuthData(abortSignal),
        getTypes(abortSignal),
      ]);

      const activeType = types?.[0]
        ? { id: types[0].id!, name: types[0].name! }
        : undefined;

      setAuthData({ data: authData, isLoading: false });
      setTypePicker({
        data: types,
        active: activeType,
        isLoading: false,
      });
    } catch (error: unknown) {
      if (!(error instanceof Error) || error.name !== "AbortError") {
        Log.error("Error refreshData", error);
      }
    }
  }

  async function getDataWalletPicker(abortSignal: AbortSignal) {
    if (!typePicker.active) {
      setWalletPicker({ data: [], isLoading: false });
      return;
    }

    setWalletPicker({ data: [], isLoading: true });

    const filterPickerQueryParams: { key: string; value: number }[] = [
      { key: "ft", value: typePicker.active.id },
    ];

    try {
      const walletPicker = await getWallets(
        filterPickerQueryParams,
        abortSignal
      );
      setWalletPicker({ data: walletPicker.data, isLoading: false });
    } catch (error: unknown) {
      if (!(error instanceof Error) || error.name !== "AbortError") {
        Log.error("Error getDataWalletPicker", error);
      }
    }
  }

  async function getDataCategoryPicker(abortSignal: AbortSignal) {
    if (!typePicker.active) {
      setCategoryPicker({ data: [], isLoading: false });
      return;
    }

    setCategoryPicker({ data: [], isLoading: true });

    const filterPickerQueryParams: { key: string; value: number }[] = [
      { key: "ft", value: typePicker.active.id },
    ];

    try {
      const categoryPicker = await getCategories(
        filterPickerQueryParams,
        abortSignal
      );
      setCategoryPicker({ data: categoryPicker.data, isLoading: false });
    } catch (error: unknown) {
      if (!(error instanceof Error) || error.name !== "AbortError") {
        Log.error("Error getDataCategoryPicker", error);
      }
    }
  }

  async function getDataWallets(abortSignal: AbortSignal, reset?: boolean) {
    if (!typePicker.active || (!wallet.canLoadMore && !reset)) {
      setWallet({ data: [], isLoading: false, page: 0, canLoadMore: false });
      return;
    }

    try {
      let walletPage = 1;
      if (reset) {
        setWallet({ data: [], isLoading: true, page: 0, canLoadMore: true });
      } else {
        walletPage = wallet.page + 1;
        setWallet((prev) => ({ ...prev, isLoading: true }));
      }

      const filterQueryParams: { key: string; value: number | Date }[] = [
        { key: "a", value: 1 },
      ];

      if (categoryPicker.active) {
        filterQueryParams.push({ key: "fc", value: categoryPicker.active.id });
      }

      if (datetimeFrom?.datetime) {
        filterQueryParams.push({ key: "dtf", value: datetimeFrom.datetime });
      }

      if (walletPicker.active) {
        const wallet = await getWallet(
          walletPicker.active.id,
          filterQueryParams,
          abortSignal
        );
        setWallet({
          data: [wallet],
          isLoading: false,
          page: 1,
          canLoadMore: false,
        });
        return;
      }

      filterQueryParams.push(
        { key: "ft", value: typePicker.active.id },
        { key: "l", value: 4 },
        { key: "p", value: walletPage && walletPage > 1 ? walletPage : 1 }
      );

      const wallets = await getWallets(filterQueryParams, abortSignal);
      setWallet((prev) => ({
        data: [...prev.data, ...wallets.data],
        isLoading: false,
        page: walletPage,
        canLoadMore: wallets.total > prev.data.length + wallets.data.length,
      }));
    } catch (error: unknown) {
      if (!(error instanceof Error) || error.name !== "AbortError") {
        Log.error("Error getDataWallets", error);
      }
    }
  }

  async function getDataCategories(abortSignal: AbortSignal, reset?: boolean) {
    if (!typePicker.active || (!category.canLoadMore && !reset)) {
      setCategory({ data: [], isLoading: false, page: 0, canLoadMore: false });
      return;
    }

    try {
      let categoryPage = 1;
      if (reset) {
        setCategory({ data: [], isLoading: true, page: 0, canLoadMore: true });
      } else {
        categoryPage = category.page + 1;
        setCategory((prev) => ({ ...prev, isLoading: true }));
      }

      const filterQueryParams: { key: string; value: number | Date }[] = [
        { key: "a", value: 1 },
      ];

      if (walletPicker.active) {
        filterQueryParams.push({ key: "fw", value: walletPicker.active.id });
      }

      if (datetimeFrom?.datetime) {
        filterQueryParams.push({ key: "dtf", value: datetimeFrom.datetime });
      }

      if (categoryPicker.active) {
        const category = await getCategory(
          categoryPicker.active.id,
          filterQueryParams,
          abortSignal
        );
        setCategory({
          data: [category],
          isLoading: false,
          page: 1,
          canLoadMore: false,
        });
        return;
      }

      filterQueryParams.push(
        { key: "ft", value: typePicker.active.id },
        { key: "l", value: 4 },
        { key: "p", value: categoryPage && categoryPage > 1 ? categoryPage : 1 }
      );

      const categories = await getCategories(filterQueryParams, abortSignal);
      setCategory((prev) => ({
        data: [...prev.data, ...categories.data],
        isLoading: false,
        page: categoryPage,
        canLoadMore:
          categories.total > prev.data.length + categories.data.length,
      }));
    } catch (error: unknown) {
      if (!(error instanceof Error) || error.name !== "AbortError") {
        Log.error("Error getDataCategories", error);
      }
    }
  }

  async function refreshAmount(abortSignal: AbortSignal) {
    if (!typePicker.active) {
      setAmount({
        data: { amount: 0, amount_average_per_day: 0 },
        graph: [],
        isLoading: false,
      });
      return;
    }

    setAmount((prev) => ({ ...prev, isLoading: true }));

    const filterQueryParams: { key: string; value: string | number | Date }[] =
      [{ key: "ft", value: typePicker.active.id }];

    if (datetimeFrom?.per) {
      filterQueryParams.push({ key: "per", value: datetimeFrom.per });
    }
    if (datetimeFrom?.datetime) {
      filterQueryParams.push({ key: "dtf", value: datetimeFrom.datetime });
    }

    if (walletPicker.active) {
      filterQueryParams.push({ key: "fw", value: walletPicker.active.id });
    } else {
      walletPicker.data.forEach((w) => {
        filterQueryParams.push({ key: "fw", value: w.id! });
      });
    }

    if (categoryPicker.active) {
      filterQueryParams.push({ key: "fc", value: categoryPicker.active.id });
    } else {
      categoryPicker.data.forEach((c) => {
        filterQueryParams.push({ key: "fc", value: c.id! });
      });
    }

    try {
      const amount = await getAmount(filterQueryParams, abortSignal);
      setAmount({
        data: amount.amount,
        graph: amount.graph.map((g) => ({
          key: new Date(g.key),
          value: g.value,
        })),
        isLoading: false,
      });
    } catch (error: unknown) {
      if (!(error instanceof Error) || error.name !== "AbortError") {
        Log.error("Error refreshAmount", error);
      }
    }
  }

  async function getDataHistory(abortSignal: AbortSignal, reset?: boolean) {
    if (
      !typePicker.active ||
      !walletPicker.data.length ||
      !categoryPicker.data.length ||
      (!history.canLoadMore && !reset)
    ) {
      setHistory({ data: [], isLoading: false, page: 0, canLoadMore: false });
      return;
    }

    let historyPage = 1;
    if (reset) {
      setHistory({ data: [], isLoading: true, page: 0, canLoadMore: true });
    } else {
      historyPage = history.page + 1;
      setHistory((prev) => ({ ...prev, isLoading: true }));
    }

    const filterQueryParams: { key: string; value: number | Date }[] = [
      { key: "ft", value: typePicker.active.id },
      { key: "l", value: 5 },
      { key: "p", value: historyPage && historyPage > 1 ? historyPage : 1 },
    ];

    if (datetimeFrom?.datetime) {
      filterQueryParams.push({ key: "dtf", value: datetimeFrom.datetime });
    }

    if (walletPicker.active) {
      filterQueryParams.push({ key: "fw", value: walletPicker.active.id });
    } else {
      walletPicker.data.forEach((w) => {
        filterQueryParams.push({ key: "fw", value: w.id! });
      });
    }

    if (categoryPicker.active) {
      filterQueryParams.push({ key: "fc", value: categoryPicker.active.id });
    } else {
      categoryPicker.data.forEach((c) => {
        filterQueryParams.push({ key: "fc", value: c.id! });
      });
    }

    try {
      const history = await getHistory(filterQueryParams, abortSignal);
      setHistory((prev) => ({
        data: [...prev.data, ...history.data],
        isLoading: false,
        page: historyPage,
        canLoadMore: history.total > prev.data.length + history.data.length,
      }));
    } catch (error: unknown) {
      if (!(error instanceof Error) || error.name !== "AbortError") {
        Log.error("Error getDataHistory", error);
      }
    }
  }

  return (
    <>
      <HomeHeader isLoading={authData.isLoading} name={authData.data?.name} />

      <div className="mt-4">
        <TypeSwitcher
          isLoading={typePicker.isLoading}
          active={typePicker.active}
          setActive={(d) => setTypePicker((prev) => ({ ...prev, active: d }))}
          data={typePicker.data}
        />
      </div>

      <div className="mt-4 flex items-center gap-x-4 gap-y-2 flex-wrap">
        <WalletPicker
          isLoading={walletPicker.isLoading}
          active={walletPicker.active}
          setActive={(d) => setWalletPicker((prev) => ({ ...prev, active: d }))}
          data={walletPicker.data}
        />

        <CategoryPicker
          isLoading={categoryPicker.isLoading}
          active={categoryPicker.active}
          setActive={(d) =>
            setCategoryPicker((prev) => ({ ...prev, active: d }))
          }
          data={categoryPicker.data}
        />
      </div>

      <div className="mt-4">
        <Amount
          isLoading={amount.isLoading}
          data={amount.data}
          datetimeFromOptions={datetimeFromOptions}
          datetimeFrom={datetimeFrom}
          setDatetimeFrom={setDatetimeFrom}
        />
      </div>

      <div className="mt-4">
        <Graph
          isLoading={amount.isLoading}
          datetimeFrom={datetimeFrom}
          graph={amount.graph}
        />
      </div>

      {!typePicker.isLoading ? (
        typePicker.active?.name && (
          <>
            <div className="mt-4">
              <Wallets
                typeName={typePicker.active.name}
                isLoading={wallet.isLoading}
                canLoadMore={wallet.canLoadMore}
                data={wallet.data}
                getWallets={getDataWallets}
              />
            </div>

            <div className="mt-4">
              <Categories
                typeName={typePicker.active.name}
                isLoading={category.isLoading}
                canLoadMore={category.canLoadMore}
                data={category.data}
                getCategories={getDataCategories}
              />
            </div>

            <div className="mt-4">
              <History
                typeName={typePicker.active.name}
                isLoading={history.isLoading}
                canLoadMore={history.canLoadMore}
                data={history.data}
                getHistory={getDataHistory}
              />
            </div>
          </>
        )
      ) : (
        <div className="mt-8">
          <Loading />
        </div>
      )}
    </>
  );
}
