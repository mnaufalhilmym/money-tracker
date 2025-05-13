import Button from "@/component/button/Button";
import ChevronDownIcon from "@/component/icon/ChevronDownIcon";
import OpenIcon from "@/component/icon/OpenIcon";
import Link from "next/link";
import HomeHeader from "./_component/HomeHeader";
import serverApiCall from "@/util/fetch";

async function getData() {
  const response = await serverApiCall("/api/auth/google");

  const data: AuthResponse = await response.json();

  return data;
}

export default async function Home() {
  const data = await getData();

  return (
    <>
      <HomeHeader name={data.name} />

      <div className="flex p-1 mt-4 rounded-full bg-white/20 border border-white/20">
        <button
          type="button"
          className="flex-1 py-2 px-4 bg-white text-black rounded-full"
        >
          Spending
        </button>
        <button type="button" className="flex-1 py-2 px-4 rounded-full">
          Saving
        </button>
      </div>

      <div className="flex items-center gap-x-2 mt-4">
        <p>Category:</p>
        <button
          type="button"
          className="flex items-center justify-between gap-x-1.5 py-2 px-4 bg-white/20 text-white rounded-full border border-white/20"
        >
          <span>All</span>
          <ChevronDownIcon />
        </button>
      </div>

      <div className="flex items-center justify-between gap-x-4 mt-4">
        <div>
          <p>Amount</p>
          <p className="font-bold text-2xl">10.000.000</p>
          <p className="text-xs">Avg 2.333.333</p>
        </div>
        <button
          type="button"
          className="flex items-center justify-between gap-x-1.5 py-2 px-4 bg-white/20 text-white rounded-full border border-white/20"
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
      </div>

      <div className="mt-4">
        <div className="flex items-center justify-between font-bold">
          <p className="text-lg">History</p>
          <Link href="/history" className="text-xl">
            <OpenIcon />
          </Link>
        </div>
        <div className="mt-2 space-y-2">
          <div className="flex items-center gap-x-2 justify-between">
            <div className="flex items-center gap-x-2">
              <div className="w-8 h-8 bg-red-500 rounded-full" />
              <div>
                <p className="font-bold">Spotify</p>
                <p className="text-xs text-white/70">Apr 02, 2024, 02:33 pm</p>
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
                <p className="text-xs text-white/70">Mar 22, 2024, 01:33 pm</p>
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
                <p className="text-xs text-white/70">Mar 22, 2024, 01:33 pm</p>
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
                <p className="text-xs text-white/70">Mar 22, 2024, 01:33 pm</p>
              </div>
            </div>
            <div>
              <p className="font-bold">-59.000</p>
            </div>
          </div>
        </div>
        <div className="mt-3">
          <Button type="button">See more</Button>
        </div>
      </div>
    </>
  );
}
