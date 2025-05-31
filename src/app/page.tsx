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
import Loading from "@/component/loading/Loading";

interface Picker<T> {
  isLoading: boolean;
  active?: { id: number; name: string };
  data: T[];
}

interface Data<T> {
  isLoading: boolean;
  canLoadMore?: boolean;
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

  const [typePicker, setTypePicker] = useState<Picker<TypeI>>(initialHomeData);
  const [walletPicker, setWalletPicker] =
    useState<Picker<WalletI>>(initialHomeData);
  const [categoryPicker, setCategoryPicker] =
    useState<Picker<CategoryI>>(initialHomeData);

  const [wallet, setWallet] = useState<Data<WalletI>>({
    ...initialHomeData,
    canLoadMore: true,
  });
  const [category, setCategory] = useState<Data<CategoryI>>(initialHomeData);
  const [history, setHistory] = useState<Data<HistoryI>>({
    ...initialHomeData,
    canLoadMore: true,
  });

  useEffect(() => {
    const abortController = new AbortController();

    refreshData(abortController.signal);

    return () => {
      abortController.abort("New refresh data request");
    };
  }, []);

  useEffect(() => {
    const abortController = new AbortController();

    getDataWallets(abortController.signal, 1, true);
    getDataCategories(abortController.signal, 1, true);

    return () => {
      abortController.abort("New get data wallets and categories request");
    };
  }, [typePicker]);

  useEffect(() => {
    const abortController = new AbortController();

    getDataHistory(abortController.signal, 1, true);

    return () => {
      abortController.abort("New get data histories request");
    };
  }, [typePicker]);

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
    } catch (error) {
      console.error("Error refreshData", error);
    }
  }

  async function getDataWallets(
    abortSignal: AbortSignal,
    page?: number,
    reset?: boolean
  ) {
    if (!typePicker.active || (!wallet.canLoadMore && !reset)) return;

    const filterPickerQueryParams: { key: string; value: number }[] = [
      { key: "ft", value: typePicker.active.id },
    ];

    const filterQueryParams: { key: string; value: number }[] = [
      ...filterPickerQueryParams,
      { key: "a", value: 1 },
      { key: "l", value: 4 },
      { key: "p", value: page && page > 1 ? page : 1 },
    ];

    const promises = [getWallets(filterQueryParams, abortSignal)];

    if (reset) {
      setWallet({ data: [], isLoading: true, canLoadMore: true });
      setWalletPicker({ data: [], isLoading: true });

      promises.push(getWallets(filterPickerQueryParams, abortSignal));
    } else {
      setWallet((prev) => ({ ...prev, isLoading: true }));
    }

    try {
      const results = await Promise.all(promises);

      const wallets = results[0];
      setWallet((prev) => ({
        data: [...prev.data, ...wallets.data],
        isLoading: false,
        canLoadMore: wallets.total > prev.data.length + wallets.data.length,
      }));

      if (reset) {
        const walletPicker = results[1];
        setWalletPicker({ data: walletPicker.data, isLoading: false });
      }
    } catch (error) {
      console.error("Error getDataWallets", error);
    }
  }

  async function getDataCategories(
    abortSignal: AbortSignal,
    page?: number,
    reset?: boolean
  ) {
    if (!typePicker.active || (!category.canLoadMore && !reset)) return;

    const filterPickerQueryParams: { key: string; value: number }[] = [
      { key: "ft", value: typePicker.active.id },
    ];

    const filterQueryParams: { key: string; value: number }[] = [
      ...filterPickerQueryParams,
      { key: "a", value: 1 },
      { key: "l", value: 4 },
      { key: "p", value: page && page > 1 ? page : 1 },
    ];

    const promises = [getCategories(filterQueryParams, abortSignal)];

    if (reset) {
      setCategory({ data: [], isLoading: true, canLoadMore: true });
      setCategoryPicker({ data: [], isLoading: true });

      promises.push(getCategories(filterPickerQueryParams, abortSignal));
    } else {
      setCategory((prev) => ({ ...prev, isLoading: true }));
    }

    try {
      const results = await Promise.all(promises);

      const categories = results[0];
      setCategory((prev) => ({
        data: [...prev.data, ...categories.data],
        isLoading: false,
        canLoadMore:
          categories.total > prev.data.length + categories.data.length,
      }));

      if (reset) {
        const categoryPicker = results[1];
        setCategoryPicker({ data: categoryPicker.data, isLoading: false });
      }
    } catch (error) {
      console.error("Error getDataCategories", error);
    }
  }

  async function getDataHistory(
    abortSignal: AbortSignal,
    page?: number,
    reset?: boolean
  ) {
    if (!typePicker.active || (!history.canLoadMore && !reset)) return;
    if (reset) {
      setHistory({ data: [], isLoading: true, canLoadMore: true });
    } else {
      setHistory((prev) => ({ ...prev, isLoading: true }));
    }

    const filterQueryParams: { key: string; value: number }[] = [
      { key: "ft", value: typePicker.active.id },
      { key: "l", value: 5 },
      { key: "p", value: page && page > 1 ? page : 1 },
    ];

    const [wallets, categories] = await Promise.all([
      getWallets(filterQueryParams, abortSignal),
      getCategories(filterQueryParams, abortSignal),
    ]);

    wallets.data.forEach((w) => {
      filterQueryParams.push({ key: "fw", value: w.id! });
    });
    categories.data.forEach((c) => {
      filterQueryParams.push({ key: "fc", value: c.id! });
    });

    try {
      const history = await getHistory(filterQueryParams, abortSignal);
      setHistory((prev) => ({
        data: [...prev.data, ...history.data],
        isLoading: false,
        canLoadMore: history.total > prev.data.length + history.data.length,
      }));
    } catch (error) {
      console.error("Error getDataHistory", error);
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
        <Amount />
      </div>

      <div className="mt-4">
        <Graph />
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
