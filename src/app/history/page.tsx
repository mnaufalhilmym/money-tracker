"use client";

import BottomSheet from "@/component/sheet/BottomSheet";
import AddIcon from "@/component/icon/AddIcon";
import ArrowBackIcon from "@/component/icon/ArrowBackIcon";
import FilterIcon from "@/component/icon/FilterIcon";
import SearchIcon from "@/component/icon/SearchIcon";
import Link from "next/link";
import { useState } from "react";

export default function History() {
  const [addSheet, setAddSheet] = useState(false);

  return (
    <>
      <div className="pb-4 flex items-center justify-between">
        <Link href="/" className="p-2 text-base">
          <ArrowBackIcon />
        </Link>
        <p className="font-bold text-center text-lg">History</p>
        <button
          type="button"
          onClick={() => setAddSheet(true)}
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
            placeholder="Search history"
            className="w-full outline-none"
          />
        </div>
        <button type="button" className="p-2">
          <FilterIcon />
        </button>
      </div>

      <div className="mt-4 space-y-4">
        <div>
          <p className="font-bold text-lg">Today</p>
          <div className="mt-2 space-y-2">
            <div className="flex items-center gap-x-2 justify-between">
              <div className="flex items-center gap-x-2">
                <div className="w-8 h-8 bg-red-500 rounded-full" />
                <div>
                  <p className="font-bold">Spotify</p>
                  <p className="text-xs text-white/70">
                    Apr 02, 2024, 02:33 pm
                  </p>
                </div>
              </div>
              <div>
                <p className="font-bold">-100.000</p>
              </div>
            </div>
            <div className="flex items-center gap-x-2 justify-between">
              <div className="flex items-center gap-x-2">
                <div className="w-8 h-8 bg-green-500 rounded-full" />
                <div>
                  <p className="font-bold">Paypal</p>
                  <p className="text-xs text-white/70">
                    Mar 22, 2024, 01:33 pm
                  </p>
                </div>
              </div>
              <div>
                <p className="font-bold">-59.000</p>
              </div>
            </div>
            <div className="flex items-center gap-x-2 justify-between">
              <div className="flex items-center gap-x-2">
                <div className="w-8 h-8 bg-blue-500 rounded-full" />
                <div>
                  <p className="font-bold">Stripe</p>
                  <p className="text-xs text-white/70">
                    Mar 22, 2024, 01:33 pm
                  </p>
                </div>
              </div>
              <div>
                <p className="font-bold">-59.000</p>
              </div>
            </div>
            <div className="flex items-center gap-x-2 justify-between">
              <div className="flex items-center gap-x-2">
                <div className="w-8 h-8 bg-yellow-500 rounded-full" />
                <div>
                  <p className="font-bold">Wise</p>
                  <p className="text-xs text-white/70">
                    Mar 22, 2024, 01:33 pm
                  </p>
                </div>
              </div>
              <div>
                <p className="font-bold">-59.000</p>
              </div>
            </div>
          </div>
        </div>
        <div>
          <p className="font-bold text-lg">Yesterday</p>
          <div className="mt-2 space-y-2">
            <div className="flex items-center gap-x-2 justify-between">
              <div className="flex items-center gap-x-2">
                <div className="w-8 h-8 bg-red-500 rounded-full" />
                <div>
                  <p className="font-bold">Spotify</p>
                  <p className="text-xs text-white/70">
                    Apr 02, 2024, 02:33 pm
                  </p>
                </div>
              </div>
              <div>
                <p className="font-bold">-100.000</p>
              </div>
            </div>
            <div className="flex items-center gap-x-2 justify-between">
              <div className="flex items-center gap-x-2">
                <div className="w-8 h-8 bg-green-500 rounded-full" />
                <div>
                  <p className="font-bold">Paypal</p>
                  <p className="text-xs text-white/70">
                    Mar 22, 2024, 01:33 pm
                  </p>
                </div>
              </div>
              <div>
                <p className="font-bold">-59.000</p>
              </div>
            </div>
            <div className="flex items-center gap-x-2 justify-between">
              <div className="flex items-center gap-x-2">
                <div className="w-8 h-8 bg-blue-500 rounded-full" />
                <div>
                  <p className="font-bold">Stripe</p>
                  <p className="text-xs text-white/70">
                    Mar 22, 2024, 01:33 pm
                  </p>
                </div>
              </div>
              <div>
                <p className="font-bold">-59.000</p>
              </div>
            </div>
            <div className="flex items-center gap-x-2 justify-between">
              <div className="flex items-center gap-x-2">
                <div className="w-8 h-8 bg-yellow-500 rounded-full" />
                <div>
                  <p className="font-bold">Wise</p>
                  <p className="text-xs text-white/70">
                    Mar 22, 2024, 01:33 pm
                  </p>
                </div>
              </div>
              <div>
                <p className="font-bold">-59.000</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <BottomSheet isOpen={addSheet} setIsOpen={setAddSheet}>
        a
      </BottomSheet>
    </>
  );
}
