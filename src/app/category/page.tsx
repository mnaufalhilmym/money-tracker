"use client";

import BottomSheet from "@/component/sheet/BottomSheet";
import AddIcon from "@/component/icon/AddIcon";
import ArrowBackIcon from "@/component/icon/ArrowBackIcon";
import FilterIcon from "@/component/icon/FilterIcon";
import SearchIcon from "@/component/icon/SearchIcon";
import Link from "next/link";
import { useMemo, useState } from "react";
import Button from "@/component/button/Button";

export default function Categories() {
  const [isOpenAddSheet, setIsOpenAddSheet] = useState(false);

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
        <button type="button" className="p-2">
          <FilterIcon />
        </button>
      </div>

      <div className="mt-4 space-y-4">
        <div>
          <p className="font-bold text-lg">Spending</p>
          <div className="mt-2 space-y-2">
            <div className="flex items-center gap-x-2">
              <div className="w-8 h-8 bg-red-500 rounded-full" />
              <p className="font-bold">Medicine</p>
            </div>
            <div className="flex items-center gap-x-2">
              <div className="w-8 h-8 bg-green-500 rounded-full" />
              <p className="font-bold">Utilities</p>
            </div>
            <div className="flex items-center gap-x-2">
              <div className="w-8 h-8 bg-blue-500 rounded-full" />
              <p className="font-bold">Transport</p>
            </div>
            <div className="flex items-center gap-x-2">
              <div className="w-8 h-8 bg-yellow-500 rounded-full" />
              <p className="font-bold">Restaurants</p>
            </div>
          </div>
        </div>
        <div>
          <p className="font-bold text-lg">Saving</p>
          <div className="mt-2 space-y-2">
            <div className="flex items-center gap-x-2">
              <div className="w-8 h-8 bg-red-500 rounded-full" />
              <p className="font-bold">Medicine</p>
            </div>
            <div className="flex items-center gap-x-2">
              <div className="w-8 h-8 bg-green-500 rounded-full" />
              <p className="font-bold">Utilities</p>
            </div>
            <div className="flex items-center gap-x-2">
              <div className="w-8 h-8 bg-blue-500 rounded-full" />
              <p className="font-bold">Transport</p>
            </div>
            <div className="flex items-center gap-x-2">
              <div className="w-8 h-8 bg-yellow-500 rounded-full" />
              <p className="font-bold">Restaurants</p>
            </div>
          </div>
        </div>
      </div>

      <CategorySheet
        type="add"
        isOpen={isOpenAddSheet}
        setIsOpen={setIsOpenAddSheet}
      />
    </>
  );
}

interface CategorySheetProps {
  type: "add" | "edit";
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
}

function CategorySheet(props: Readonly<CategorySheetProps>) {
  const title = useMemo(() => {
    let t = "Category";
    switch (props.type) {
      case "add":
        t = "Add " + t;
        break;
      case "edit":
        t = "Edit " + t;
        break;
    }
    return t;
  }, [props.type]);

  return (
    <BottomSheet isOpen={props.isOpen} setIsOpen={props.setIsOpen}>
      <div>
        <p className="font-bold text-center text-lg">{title}</p>
      </div>
      <form className="mt-4 space-y-4">
        <div>
          <p className="font-bold">Name</p>
          <input
            className="outline-none w-full mt-0.5 border-b"
            placeholder="Example: Food"
          />
        </div>

        <div>
          <p className="font-bold">Color</p>
          <div className="mt-0.5 flex flex-wrap gap-2">
            <button
              type="button"
              className="w-7 h-7 mt-0.5 border border-white/100 bg-red-500 rounded-lg"
            />
            <button
              type="button"
              className="w-7 h-7 mt-0.5 border border-white/0 bg-orange-500 rounded-lg"
            />
            <button
              type="button"
              className="w-7 h-7 mt-0.5 border border-white/0 bg-amber-500 rounded-lg"
            />
            <button
              type="button"
              className="w-7 h-7 mt-0.5 border border-white/0 bg-yellow-500 rounded-lg"
            />
            <button
              type="button"
              className="w-7 h-7 mt-0.5 border border-white/0 bg-lime-500 rounded-lg"
            />
            <button
              type="button"
              className="w-7 h-7 mt-0.5 border border-white/0 bg-green-500 rounded-lg"
            />
            <button
              type="button"
              className="w-7 h-7 mt-0.5 border border-white/0 bg-emerald-500 rounded-lg"
            />
            <button
              type="button"
              className="w-7 h-7 mt-0.5 border border-white/0 bg-teal-500 rounded-lg"
            />
            <button
              type="button"
              className="w-7 h-7 mt-0.5 border border-white/0 bg-cyan-500 rounded-lg"
            />
            <button
              type="button"
              className="w-7 h-7 mt-0.5 border border-white/0 bg-sky-500 rounded-lg"
            />
            <button
              type="button"
              className="w-7 h-7 mt-0.5 border border-white/0 bg-blue-500 rounded-lg"
            />
            <button
              type="button"
              className="w-7 h-7 mt-0.5 border border-white/0 bg-indigo-500 rounded-lg"
            />
            <button
              type="button"
              className="w-7 h-7 mt-0.5 border border-white/0 bg-violet-500 rounded-lg"
            />
            <button
              type="button"
              className="w-7 h-7 mt-0.5 border border-white/0 bg-purple-500 rounded-lg"
            />
            <button
              type="button"
              className="w-7 h-7 mt-0.5 border border-white/0 bg-fuchsia-500 rounded-lg"
            />
            <button
              type="button"
              className="w-7 h-7 mt-0.5 border border-white/0 bg-pink-500 rounded-lg"
            />
            <button
              type="button"
              className="w-7 h-7 mt-0.5 border border-white/0 bg-rose-500 rounded-lg"
            />
            <button
              type="button"
              className="w-7 h-7 mt-0.5 border border-white/0 bg-slate-500 rounded-lg"
            />
            <button
              type="button"
              className="w-7 h-7 mt-0.5 border border-white/0 bg-gray-500 rounded-lg"
            />
            <button
              type="button"
              className="w-7 h-7 mt-0.5 border border-white/0 bg-zinc-500 rounded-lg"
            />
            <button
              type="button"
              className="w-7 h-7 mt-0.5 border border-white/0 bg-neutral-500 rounded-lg"
            />
            <button
              type="button"
              className="w-7 h-7 mt-0.5 border border-white/0 bg-stone-500 rounded-lg"
            />
          </div>
        </div>

        <div>
          <p className="font-bold">Type</p>
          <div className="mt-0.5 flex items-center gap-x-6">
            <label className="flex items-center gap-x-1.5">
              <input type="radio" name="category-type" value="spending" />
              <span>Spending</span>
            </label>
            <label className="flex items-center gap-x-1.5">
              <input type="radio" name="category-type" value="saving" />
              <span>Saving</span>
            </label>
          </div>
        </div>

        <Button type="submit">Save</Button>
      </form>
    </BottomSheet>
  );
}
