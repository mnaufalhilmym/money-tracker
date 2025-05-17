"use client";

import AddIcon from "@/component/icon/AddIcon";
import ArrowBackIcon from "@/component/icon/ArrowBackIcon";
import FilterIcon from "@/component/icon/FilterIcon";
import SearchIcon from "@/component/icon/SearchIcon";
import Link from "next/link";
import { useState } from "react";
import WalletFormSheet from "./_component/WalletFormSheet";
import WalletFilterSheet from "./_component/WalletFilterSheet";

export default function Wallets() {
  const [isOpenAddSheet, setIsOpenAddSheet] = useState(false);
  const [isOpenFilterSheet, setIsOpenFilterSheet] = useState(false);
  const [types, setTypes] = useState({ spending: true, saving: true });
  const [editWallet, setEditWallet] = useState<WalletI>();

  const wallets: WalletI[] = [
    {
      id: "1",
      name: "Bank Saqu",
      type: "spending",
    },
    {
      id: "2",
      name: "Bank Jago",
      type: "spending",
    },
    {
      id: "3",
      name: "GoPay",
      type: "spending",
    },
    {
      id: "4",
      name: "AstraPay",
      type: "spending",
    },
    {
      id: "5",
      name: "Bareksa",
      type: "saving",
    },
    {
      id: "6",
      name: "Bibit",
      type: "saving",
    },
    {
      id: "7",
      name: "Pluang",
      type: "saving",
    },
    {
      id: "8",
      name: "Pegadaian",
      type: "saving",
    },
  ];

  const spendingWallets = wallets.filter((w) => w.type === "spending");
  const savingWallets = wallets.filter((w) => w.type === "saving");

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
            placeholder="Search wallet"
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
        <div>
          <p className="font-bold text-lg">Spending</p>
          <div className="mt-2 space-y-2">
            {spendingWallets.map((w) => (
              <button
                key={w.id}
                onClick={() => setEditWallet(w)}
                className="block w-full h-8  px-2 text-left border border-white/20 rounded-lg"
              >
                <p>{w.name}</p>
              </button>
            ))}
          </div>
        </div>
        <div>
          <p className="font-bold text-lg">Saving</p>
          <div className="mt-2 space-y-2">
            {savingWallets.map((w) => (
              <button
                key={w.id}
                onClick={() => setEditWallet(w)}
                className="block w-full h-8  px-2 text-left border border-white/20 rounded-lg"
              >
                <p>{w.name}</p>
              </button>
            ))}
          </div>
        </div>
      </div>

      <WalletFormSheet
        isOpen={isOpenAddSheet || !!editWallet}
        close={() => {
          if (isOpenAddSheet) setIsOpenAddSheet(false);
          if (editWallet) setEditWallet(undefined);
        }}
        wallet={editWallet}
      />

      <WalletFilterSheet
        isOpen={isOpenFilterSheet}
        close={() => setIsOpenFilterSheet(false)}
        types={types}
        setTypes={setTypes}
      />
    </>
  );
}
