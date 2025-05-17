import Button from "@/component/button/Button";
import OpenIcon from "@/component/icon/OpenIcon";
import Link from "next/link";

export default function Wallets() {
  return (
    <>
      <div className="flex items-center justify-between font-bold">
        <p className="text-lg">Spending wallets</p>
        <Link href="/wallet" className="text-xl">
          <OpenIcon />
        </Link>
      </div>
      <div className="mt-2 grid grid-cols-2 gap-4">
        <div className="py-2.5 px-3.5 rounded-2xl bg-white/20 border border-white/20">
          <p>GoPay</p>
          <div className="mt-1">
            <div className="flex items-end gap-x-1.5">
              <p className="font-bold text-xl">1.000.000</p>
              <p>(23%)</p>
            </div>
            <p className="text-xs">Avg 100.000</p>
          </div>
        </div>
        <div className="py-2.5 px-3.5 rounded-2xl bg-white/20 border border-white/20">
          <p>AstraPay</p>
          <div className="mt-1">
            <div className="flex items-end gap-x-1.5">
              <p className="font-bold text-xl">100.000.000</p>
              <p>(23%)</p>
            </div>
            <p className="text-xs">Avg 10.000.000</p>
          </div>
        </div>
        <div className="py-2.5 px-3.5 rounded-2xl bg-white/20 border border-white/20">
          <p>Bank Jago</p>
          <div className="mt-1">
            <div className="flex items-end gap-x-1.5">
              <p className="font-bold text-xl">700.000</p>
              <p>(23%)</p>
            </div>
            <p className="text-xs">Avg 100.000</p>
          </div>
        </div>
        <div className="py-2.5 px-3.5 rounded-2xl bg-white/20 border border-white/20">
          <p>Bank Saqu</p>
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
