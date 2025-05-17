import Button from "@/component/button/Button";
import OpenIcon from "@/component/icon/OpenIcon";
import Link from "next/link";

export default function Categories() {
  return (
    <>
      <div className="flex items-center justify-between font-bold">
        <p className="text-lg">Spending categories</p>
        <Link href="/category" className="text-xl">
          <OpenIcon />
        </Link>
      </div>
      <div className="mt-2 grid grid-cols-2 gap-4">
        <div className="py-2.5 px-3.5 rounded-2xl bg-white/20 border border-white/20">
          <div className="flex items-center gap-x-1.5">
            <div className="w-2 h-2 bg-red-500 rounded-full" />
            <p>Medicine</p>
          </div>
          <div className="mt-1">
            <div className="flex items-end gap-x-1.5">
              <p className="font-bold text-xl">1.000.000</p>
              <p>(23%)</p>
            </div>
            <p className="text-xs">Avg 100.000</p>
          </div>
        </div>
        <div className="py-2.5 px-3.5 rounded-2xl bg-white/20 border border-white/20">
          <div className="flex items-center gap-x-1.5">
            <div className="w-2 h-2 bg-green-500 rounded-full" />
            <p>Utilities</p>
          </div>
          <div className="mt-1">
            <div className="flex items-end gap-x-1.5">
              <p className="font-bold text-xl">100.000.000</p>
              <p>(23%)</p>
            </div>
            <p className="text-xs">Avg 10.000.000</p>
          </div>
        </div>
        <div className="py-2.5 px-3.5 rounded-2xl bg-white/20 border border-white/20">
          <div className="flex items-center gap-x-1.5">
            <div className="w-2 h-2 bg-blue-500 rounded-full" />
            <p>Transport</p>
          </div>
          <div className="mt-1">
            <div className="flex items-end gap-x-1.5">
              <p className="font-bold text-xl">700.000</p>
              <p>(23%)</p>
            </div>
            <p className="text-xs">Avg 100.000</p>
          </div>
        </div>
        <div className="py-2.5 px-3.5 rounded-2xl bg-white/20 border border-white/20">
          <div className="flex items-center gap-x-1.5">
            <div className="w-2 h-2 bg-yellow-500 rounded-full" />
            <p>Restaurants</p>
          </div>
          <div className="mt-1">
            <div className="flex items-end gap-x-1.5">
              <p className="font-bold text-xl">990.000</p>
              <p>(23%)</p>
            </div>
            <p className="text-xs">Avg 200.000</p>
          </div>
        </div>
      </div>
      <div className="mt-4">
        <Button type="button">See more</Button>
      </div>
    </>
  );
}
