import ChevronDown from "@/components/icons/ChevronDown";

export default function Home() {
  return (
    <main>
      <div>
        <span className="text-xs">Good Morning,</span>
        <br />
        <span className="font-bold">Risa Wahyu Widyastuti</span>
      </div>
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
      <div className="flex items-center justify-between gap-x-4 mt-4">
        <div>
          <p>Amount</p>
          <p className="font-bold text-2xl">10.000.000</p>
        </div>
        <button
          type="button"
          className="flex items-center justify-between gap-x-1 py-2 px-4 bg-white/20 text-white rounded-full border border-white/20"
        >
          <span>Last 7 days</span>
          <ChevronDown />
        </button>
      </div>
      <div className="mt-4">
        <div className="flex items-center gap-x-2 mt-4">
          <p>Category:</p>
          <button
            type="button"
            className="flex items-center justify-between gap-x-1 py-2 px-4 bg-white/20 text-white rounded-full border border-white/20"
          >
            <span>All</span>
            <ChevronDown />
          </button>
        </div>
        <div className="flex items-end gap-x-2 pt-12 mt-2">
          <div className="min-w-8 w-full">
            <div
              className="bg-white/30 rounded-lg"
              style={{ height: "100px" }}
            />
            <p className="mt-1 text-center">1</p>
          </div>
          <div className="min-w-8 w-full">
            <div
              className="bg-white/30 rounded-lg"
              style={{ height: "120px" }}
            />
            <p className="mt-1 text-center">2</p>
          </div>
          <div className="min-w-8 w-full">
            <div
              className="bg-white/30 rounded-lg"
              style={{ height: "110px" }}
            />
            <p className="mt-1 text-center">3</p>
          </div>
          <div className="min-w-8 w-full">
            <div
              className="bg-white/30 rounded-lg"
              style={{ height: "170px" }}
            />
            <p className="mt-1 text-center">4</p>
          </div>
          <div className="min-w-8 w-full">
            <div
              className="bg-white/30 rounded-lg"
              style={{ height: "190px" }}
            />
            <p className="mt-1 text-center">5</p>
          </div>
          <div className="min-w-8 w-full">
            <div
              className="bg-white/30 rounded-lg"
              style={{ height: "140px" }}
            />
            <p className="mt-1 text-center">6</p>
          </div>
          <div className="relative min-w-8 w-full">
            <div className="absolute -top-12.5 right-0 py-1 px-2 bg-white text-black text-right rounded-l-lg rounded-tr-lg">
              <p className="font-bold">3.000.000</p>
              <p className="text-xs">37%</p>
            </div>
            <div className="bg-white rounded-lg" style={{ height: "200px" }} />
            <p className="mt-1 text-center">7</p>
          </div>
        </div>
      </div>
      <div className="mt-4">
        <p className="font-bold text-lg">Spending categories</p>
        <div className="mt-2">
          
        </div>
      </div>
    </main>
  );
}
