"use client";

import HomeHeader from "./_component/HomeHeader";
import History from "./_component/History";
import Categories from "./_component/Categories";
import Wallets from "./_component/Wallets";
import { useEffect, useState } from "react";
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

interface HomeDataI<T> {
  isLoading: boolean;
  active?: { id: number; name: string };
  data: T[];
}

const initialHomeData = {
  isLoading: true,
  data: [],
};

export default function Home() {
  const [authData, setAuthData] = useState<{
    data?: AuthResponse;
    isLoading: boolean;
  }>({
    isLoading: true,
  });
  const [type, setType] = useState<HomeDataI<TypeI>>(initialHomeData);
  const [wallet, setWallet] = useState<HomeDataI<WalletI>>(initialHomeData);
  const [category, setCategory] =
    useState<HomeDataI<CategoryI>>(initialHomeData);
  const [history, setHistory] = useState<HomeDataI<HistoryI>>(initialHomeData);

  useEffect(() => {
    const abortController = new AbortController();

    refreshData(abortController.signal);

    return () => {
      abortController.abort("New refresh data request");
    };
  }, []);

  useEffect(() => {
    const abortController = new AbortController();

    refreshDataTransaction(abortController.signal);

    return () => {
      abortController.abort("New refresh data transaction request");
    };
  }, [type]);

  async function refreshData(abortSignal: AbortSignal) {
    setAuthData({ isLoading: true });
    setType({ isLoading: true, data: [] });

    try {
      const [authData, types] = await Promise.all([
        getAuthData(abortSignal),
        getTypes(abortSignal),
      ]);

      const activeType = types?.[0]
        ? { id: types[0].id!, name: types[0].name! }
        : undefined;

      setAuthData({ data: authData, isLoading: false });
      setType({
        data: types,
        active: activeType,
        isLoading: false,
      });
    } catch (error) {
      console.error("Error refreshData", error);
    }
  }

  async function refreshDataTransaction(abortSignal: AbortSignal) {
    setWallet({ isLoading: true, data: [] });
    setCategory({ isLoading: true, data: [] });
    setHistory({ isLoading: true, data: [] });

    const filterQueryParams: { key: string; value: number }[] = [
      { key: "a", value: 1 },
    ];

    if (type.active) {
      filterQueryParams.push({ key: "ft", value: type.active.id });
    }

    try {
      const [wallets, categories] = await Promise.all([
        getWallets(filterQueryParams, abortSignal),
        getCategories(filterQueryParams, abortSignal),
      ]);

      setWallet({ data: wallets, isLoading: false });
      setCategory({ data: categories, isLoading: false });

      wallets.forEach((w) => {
        filterQueryParams.push({ key: "fw", value: w.id! });
      });
      categories.forEach((c) => {
        filterQueryParams.push({ key: "fc", value: c.id! });
      });

      const history = await getHistory(filterQueryParams, abortSignal);
      setHistory({ data: history, isLoading: false });
    } catch (error) {
      console.error("Error refreshDataTransaction", error);
    }
  }

  return (
    <>
      <HomeHeader isLoading={authData.isLoading} name={authData.data?.name} />

      <div className="mt-4">
        <TypeSwitcher
          isLoading={type.isLoading}
          active={type.active}
          setActive={(d) => setType((prev) => ({ ...prev, active: d }))}
          data={type.data}
        />
      </div>

      <div className="mt-4 flex items-center gap-x-4 gap-y-2 flex-wrap">
        <WalletPicker
          isLoading={wallet.isLoading}
          active={wallet.active}
          setActive={(d) => setWallet((prev) => ({ ...prev, active: d }))}
          data={wallet.data}
        />

        <CategoryPicker
          isLoading={category.isLoading}
          active={category.active}
          setActive={(d) => setCategory((prev) => ({ ...prev, active: d }))}
          data={category.data}
        />
      </div>

      <div className="mt-4">
        <Amount />
      </div>

      <div className="mt-4">
        <Graph />
      </div>

      <div className="mt-4">
        <Wallets isLoading={wallet.isLoading} data={wallet.data} />
      </div>

      <div className="mt-4">
        <Categories isLoading={category.isLoading} data={category.data} />
      </div>

      <div className="mt-4">
        <History isLoading={history.isLoading} data={history.data} />
      </div>
    </>
  );
}
