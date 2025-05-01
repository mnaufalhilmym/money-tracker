"use client";

import AddIcon from "@/component/icon/AddIcon";
import ArrowBackIcon from "@/component/icon/ArrowBackIcon";
import FilterIcon from "@/component/icon/FilterIcon";
import SearchIcon from "@/component/icon/SearchIcon";
import Link from "next/link";
import { useState } from "react";
import CategoryFormSheet from "./_component/CategoryFormSheet";
import { COLORS } from "@/constant/color";
import CategoryFilterSheet from "./_component/CategoryFilterSheet";

export default function Categories() {
  const [isOpenAddSheet, setIsOpenAddSheet] = useState(false);
  const [isOpenFilterSheet, setIsOpenFilterSheet] = useState(false);
  const [types, setTypes] = useState({ spending: true, saving: true });
  const [editCategory, setEditCategory] = useState<CategoryI>();

  const categories: CategoryI[] = [
    {
      id: "1",
      name: "Medicine",
      color: COLORS.RED,
      type: "spending",
    },
    {
      id: "2",
      name: "Utilities",
      color: COLORS.GREEN,
      type: "spending",
    },
    {
      id: "3",
      name: "Transport",
      color: COLORS.BLUE,
      type: "spending",
    },
    {
      id: "4",
      name: "Restaurants",
      color: COLORS.YELLOW,
      type: "spending",
    },
    {
      id: "5",
      name: "Medicine",
      color: COLORS.RED,
      type: "saving",
    },
    {
      id: "6",
      name: "Utilities",
      color: COLORS.GREEN,
      type: "saving",
    },
    {
      id: "7",
      name: "Transport",
      color: COLORS.BLUE,
      type: "saving",
    },
    {
      id: "8",
      name: "Restaurants",
      color: COLORS.YELLOW,
      type: "saving",
    },
  ];

  const spendingCategories = categories.filter((c) => c.type === "spending");
  const savingCategories = categories.filter((c) => c.type === "saving");

  return (
    <>
      <div className="pb-4 flex items-center justify-between">
        <Link href="/" className="p-2 text-base">
          <ArrowBackIcon />
        </Link>
        <p className="font-bold text-center text-lg">Categories</p>
        <button
          type="button"
          onClick={() => setIsOpenAddSheet(true)}
          className="p-2 text-base"
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
            className="w-full outline-none"
          />
        </div>
        <button
          type="button"
          onClick={() => setIsOpenFilterSheet(true)}
          className="p-2"
        >
          <FilterIcon />
        </button>
      </div>

      <div className="mt-4 space-y-4">
        <div>
          <p className="font-bold text-lg">Spending</p>
          <div className="mt-2 space-y-2">
            {spendingCategories.map((c) => (
              <button
                key={c.id}
                onClick={() => setEditCategory(c)}
                className="flex items-center gap-x-2"
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
        <div>
          <p className="font-bold text-lg">Saving</p>
          <div className="mt-2 space-y-2">
            {savingCategories.map((c) => (
              <button
                key={c.id}
                onClick={() => setEditCategory(c)}
                className="flex items-center gap-x-2"
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
      </div>

      <CategoryFormSheet
        isOpen={isOpenAddSheet || !!editCategory}
        close={() => {
          if (isOpenAddSheet) setIsOpenAddSheet(false);
          if (editCategory) setEditCategory(undefined);
        }}
        category={editCategory}
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
