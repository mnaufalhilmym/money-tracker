"use client";

import ChevronDownIcon from "@/component/icon/ChevronDownIcon";
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

  useEffect(() => {
    refreshData();
  }, []);

  async function refreshData() {
    setAuthData({ isLoading: true });
    setType({ isLoading: true, data: [] });

    const [authData, types] = await Promise.all([getAuthData(), getTypes()]);

    setAuthData({ data: authData, isLoading: false });
    setType({
      data: types,
      active: types?.[0]
        ? { id: types[0].id!, name: types[0].name! }
        : undefined,
      isLoading: false,
    });

    const filterQueryParams: { key: string; value: number }[] = [];
    types.forEach((t) => {
      filterQueryParams.push({ key: "f", value: t.id! });
    });

    const [wallets, categories] = await Promise.all([
      getWallets(filterQueryParams),
      getCategories(filterQueryParams),
    ]);

    setWallet({ data: wallets, isLoading: false });
    setCategory({ data: categories, isLoading: false });
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

      <div className="flex items-center justify-between gap-x-4 mt-4">
        <div>
          <p>Amount</p>
          <p className="font-bold text-2xl">10.000.000</p>
          <p className="text-xs">Avg 2.333.333</p>
        </div>
        <button
          type="button"
          className="flex items-center justify-between gap-x-1.5 py-2 px-4 bg-white/20 text-white rounded-full border border-white/20 cursor-pointer"
        >
          <span>Last 7 days</span>
          <ChevronDownIcon />
        </button>
      </div>

      <div className="flex items-end gap-x-2 pt-12 mt-4">
        <div className="min-w-8 w-full">
          <div className="bg-white/30 rounded-xl" style={{ height: "100px" }} />
          <p className="mt-1 text-center">1</p>
        </div>
        <div className="min-w-8 w-full">
          <div className="bg-white/30 rounded-xl" style={{ height: "120px" }} />
          <p className="mt-1 text-center">2</p>
        </div>
        <div className="min-w-8 w-full">
          <div className="bg-white/30 rounded-xl" style={{ height: "110px" }} />
          <p className="mt-1 text-center">3</p>
        </div>
        <div className="min-w-8 w-full">
          <div className="bg-white/30 rounded-xl" style={{ height: "170px" }} />
          <p className="mt-1 text-center">4</p>
        </div>
        <div className="min-w-8 w-full">
          <div className="bg-white/30 rounded-xl" style={{ height: "190px" }} />
          <p className="mt-1 text-center">5</p>
        </div>
        <div className="min-w-8 w-full">
          <div className="bg-white/30 rounded-xl" style={{ height: "140px" }} />
          <p className="mt-1 text-center">6</p>
        </div>
        <div className="relative min-w-8 w-full">
          <div className="absolute -top-12.5 right-0 py-1 px-2 bg-white text-black text-right rounded-l-lg rounded-tr-lg">
            <p className="font-bold">3.000.000</p>
            <p className="text-xs">37%</p>
          </div>
          <div className="bg-white rounded-xl" style={{ height: "200px" }} />
          <p className="mt-1 text-center">7</p>
        </div>
      </div>

      <div className="mt-4">
        <Wallets />
      </div>

      <div className="mt-4">
        <Categories />
      </div>

      <div className="mt-4">
        <History />
      </div>
    </>
  );
}
