import ChevronDownIcon from "@/component/icon/ChevronDownIcon";

export default function Amount() {
  return (
    <div className="flex items-center justify-between gap-x-4">
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
  );
}
