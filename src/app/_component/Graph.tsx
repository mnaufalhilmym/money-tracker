export default function Graph() {
  return (
    <div className="flex items-end gap-x-2 pt-12">
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
  );
}
