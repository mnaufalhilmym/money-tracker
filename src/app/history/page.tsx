"use client";

import AddIcon from "@/component/icon/AddIcon";
import ArrowBackIcon from "@/component/icon/ArrowBackIcon";
import FilterIcon from "@/component/icon/FilterIcon";
import SearchIcon from "@/component/icon/SearchIcon";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import HistoryFilterSheet from "./_component/HistoryFilterSheet";
import HistoryFormSheet from "./_component/HistoryFormSheet";

export default function History() {
  const [isOpenAddSheet, setisOpenAddSheet] = useState(false);
  const [isOpenFilterSheet, setIsOpenFilterSheet] = useState(false);
  const [types, setTypes] = useState({ spending: true, saving: true });
  const [editHistory, setEditHistory] = useState<HistoryI>();

  const [histories, setHistories] = useState<HistoryI[]>([]);

  useEffect(() => {
    setHistories([
      {
        id: "1",
        title: "Spotify",
        category_id: "1",
        datetime: new Date().toISOString(),
        amount: -100000,
      },
      {
        id: "2",
        title: "Paypal",
        category_id: "1",
        datetime: new Date(Date.now() - 86400000).toISOString(),
        amount: -59000,
      },
      {
        id: "3",
        title: "Stripe",
        category_id: "1",
        datetime: "2024-03-02T15:33:00+07:00",
        amount: -79000,
      },
      {
        id: "4",
        title: "Wise",
        category_id: "1",
        datetime: "2024-03-02T13:33:00+07:00",
        amount: -39000,
      },
    ]);
  }, []);

  const groupedHistories = useMemo(() => {
    const grouped = new Map<string, HistoryI[]>();

    if (!histories.length) return grouped;

    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    const todayKey = today.toLocaleDateString();
    const yesterdayKey = yesterday.toLocaleDateString();

    histories.forEach((h) => {
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
  }, [histories]);

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
            placeholder="Search history"
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
        {[...groupedHistories].map(([dateKey, items]) => (
          <div key={dateKey}>
            <p className="font-bold text-lg">{dateKey}</p>
            <div className="mt-2 space-y-2">
              {items.map((i) => (
                <button
                  key={i.id}
                  onClick={() => setEditHistory(i)}
                  className="w-full flex items-center gap-x-2 justify-between text-left"
                >
                  <div className="flex items-center gap-x-2">
                    <div className="w-8 h-8 bg-red-500 rounded-full" />
                    <div>
                      <p className="font-bold">{i.title}</p>
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
      </div>

      <HistoryFormSheet
        isOpen={isOpenAddSheet || !!editHistory}
        close={() => {
          if (isOpenAddSheet) setisOpenAddSheet(false);
          if (editHistory) setEditHistory(undefined);
        }}
        history={editHistory}
      />

      <HistoryFilterSheet
        isOpen={isOpenFilterSheet}
        close={() => setIsOpenFilterSheet(false)}
        types={types}
        setTypes={setTypes}
      />
    </>
  );
}
