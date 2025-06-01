import { useMemo, useState } from "react";

interface Props {
  datetimeFrom: { per: string; name: string; datetime?: Date };
  graph: { key: Date; value: number }[];
}

export default function Graph(props: Readonly<Props>) {
  const graph = useMemo(() => {
    if (!props.datetimeFrom.datetime) return { data: [], maxValue: 0 };

    const now = new Date();
    let d = new Date(props.datetimeFrom.datetime);
    switch (props.datetimeFrom.per) {
      case "day":
        {
          const startOfDay = new Date(d);
          startOfDay.setHours(0, 0, 0, 0);
          d = startOfDay;
        }
        break;
      case "week":
        {
          const day = d.getDay(); // 0 = Sunday, 1 = Monday, ..., 6 = Saturday
          const diffToMonday = day === 0 ? -6 : 1 - day;
          const startOfWeek = new Date(d);
          startOfWeek.setDate(d.getDate() + diffToMonday);
          startOfWeek.setHours(0, 0, 0, 0);
          d = startOfWeek;
        }
        break;
      case "month":
        {
          const startOfMonth = new Date(d.getFullYear(), d.getMonth(), 1);
          d = startOfMonth;
        }
        break;
      default: {
        const startOfYear = new Date(d.getFullYear(), 0, 1);
        d = startOfYear;
      }
    }

    const g = [];
    const totalValue = props.graph.reduce(
      (prev, g) => prev + Number(g.value),
      0
    );
    let maxValue = 0;
    while (d.getTime() <= now.getTime()) {
      const value = getGraphValue(d);
      if (value > maxValue) {
        maxValue = value;
      }
      g.push({
        key: new Date(d),
        value,
        percentage: ((value * 100) / totalValue).toFixed(2),
      });
      switch (props.datetimeFrom.per) {
        case "day":
          d.setDate(d.getDate() + 1);
          break;
        case "week":
          d.setDate(d.getDate() + 7);
          break;
        case "month":
          d.setMonth(d.getMonth() + 1);
          break;
        default:
          d.setFullYear(d.getFullYear() + 1);
      }
    }

    return { data: g, maxValue };
  }, [props.datetimeFrom.per, props.datetimeFrom.datetime, props.graph]);

  const [selectedKey, setSelectedKey] = useState<Date>();

  function getGraphValue(d: Date) {
    const dTime = d.getTime();
    for (const g of props.graph) {
      const gTime = g.key.getTime();
      if (dTime === gTime) {
        return g.value;
      } else if (gTime > dTime) {
        break;
      }
    }
    return 0;
  }

  return (
    <div className="flex items-end gap-x-2 pt-12">
      {graph.data.map((g) => (
        <div key={g.key.toISOString()} className="relative min-w-8 w-full">
          {selectedKey && selectedKey.getTime() === g.key.getTime() && (
            <div className="absolute -top-12.5 right-0 py-1 px-2 bg-white text-black text-right rounded-l-lg rounded-tr-lg">
              <p className="font-bold">{g.value}</p>
              <p className="text-xs">{g.percentage}%</p>
            </div>
          )}
          <button
            type="button"
            onClick={() => setSelectedKey(g.key)}
            className="w-full bg-white rounded-xl cursor-pointer"
            style={{ height: `${(g.value / graph.maxValue) * 200}px` }}
          />
          <p className="mt-1 text-center">{g.key.getDate()}</p>
        </div>
      ))}
    </div>
  );
}
