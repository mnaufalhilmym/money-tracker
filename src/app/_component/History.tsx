import Button from "@/component/button/Button";
import OpenIcon from "@/component/icon/OpenIcon";
import Link from "next/link";

export default function History() {
  return (
    <>
      <div className="flex items-center justify-between font-bold">
        <p className="text-lg">Spending History</p>
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
    </>
  );
}
