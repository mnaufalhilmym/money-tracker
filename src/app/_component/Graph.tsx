"use client";

import useDateNow from "@/hook/useDateNow";
import { formatRupiah } from "@/util/formatAmount";
import { useEffect, useState } from "react";

interface Props {
  isLoading: boolean;
  datetimeFrom?: { per: string; name: string; datetime?: Date };
  graph: { key: Date; value: number }[];
}

interface Graph {
  data: {
    key: Date;
    value: number;
    x: string;
    percentage: string | number;
  }[];
  maxValue: number;
}

export default function Graph(props: Readonly<Props>) {
  const now = useDateNow();

  const [selectedKey, setSelectedKey] = useState<Date>();
  const [graph, setGraph] = useState<Graph>({
    data: [],
    maxValue: 0,
  });
  const [isLoading, setIsLoading] = useState(props.isLoading);

  useEffect(() => {
    if (props.isLoading) {
      setIsLoading(true);
    }
  }, [props.isLoading]);

  useEffect(() => {
    if (!now) {
      setGraph({ data: [], maxValue: 0 });
      return;
    }

    setIsLoading(true);

    let d = new Date(now);
    if (props.datetimeFrom?.datetime) {
      d = new Date(props.datetimeFrom.datetime);
    }
    if (props.graph.length) {
      const k = props.graph[0].key;
      if (k.getTime() < d.getTime()) {
        d = new Date(k);
      } else {
        d.setHours(
          k.getHours(),
          k.getMinutes(),
          k.getSeconds(),
          k.getMilliseconds()
        );
      }
    }

    switch (props.datetimeFrom?.per) {
      case "day": {
        break;
      }
      case "week": {
        const day = d.getDay(); // 0 = Sunday, 1 = Monday, ..., 6 = Saturday
        const diffToMonday = day === 0 ? -6 : 1 - day;
        const startOfWeek = new Date(d);
        startOfWeek.setDate(d.getDate() + diffToMonday);
        d = startOfWeek;
        break;
      }
      case "month": {
        const startOfMonth = new Date(
          d.getFullYear(),
          d.getMonth(),
          1,
          d.getHours(),
          d.getMinutes(),
          d.getSeconds(),
          d.getMilliseconds()
        );
        d = startOfMonth;
        break;
      }
      default: {
        const startOfYear = new Date(
          d.getFullYear(),
          0,
          1,
          d.getHours(),
          d.getMinutes(),
          d.getSeconds(),
          d.getMilliseconds()
        );
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

      const key = new Date(d);
      const newGraph = {
        key,
        value,
        x: "",
        percentage:
          totalValue > 0 ? ((value * 100) / totalValue).toFixed(2) : 0,
      };

      switch (props.datetimeFrom?.per) {
        case "day":
          d.setDate(d.getDate() + 1);
          newGraph.x = `${key.getDate()}`;
          break;
        case "week":
          d.setDate(d.getDate() + 6);
          newGraph.x = `${key.getDate()}${key.toLocaleString("en-US", {
            month: "short",
          })} - ${d.getDate()}${d.toLocaleString("en-US", {
            month: "short",
          })}`;
          d.setDate(d.getDate() + 1);
          break;
        case "month":
          d.setMonth(d.getMonth() + 1);
          newGraph.x = key.toLocaleString("en-US", { month: "short" });
          break;
        default:
          d.setFullYear(d.getFullYear() + 1);
          newGraph.x = key.getFullYear().toString();
      }

      g.push(newGraph);
    }

    setGraph({ data: g, maxValue });
    setIsLoading(false);
  }, [now, props.datetimeFrom, props.graph]);

  useEffect(() => {
    if (!graph.data.length) return;
    setSelectedKey(graph.data.findLast((d) => d.value > 0)?.key);
  }, [graph.data]);

  function getGraphValue(d: Date) {
    const dTime = d.getTime();
    for (const g of props.graph) {
      const gTime = g.key.getTime();
      if (dTime === gTime) {
        return Number(g.value);
      } else if (gTime > dTime) {
        break;
      }
    }
    return 0;
  }

  return (
    <div
      className={`h-71.5 ${
        isLoading
          ? "bg-white/20 rounded animate-pulse"
          : "flex gap-x-2 pt-14 overflow-x-auto scrollable"
      }`}
    >
      {!isLoading &&
        graph.data.map((g, idx) => (
          <div
            key={g.key.toISOString()}
            className="min-w-8 w-full h-full flex flex-col justify-end"
          >
            <div
              className="relative bg-white rounded-xl"
              style={{
                height:
                  g.value > 0 ? `${(g.value * 100) / graph.maxValue}%` : 0,
              }}
            >
              {selectedKey && selectedKey.getTime() === g.key.getTime() && (
                <div
                  className={`absolute z-1 -top-12.5 ${
                    idx >= Math.floor(graph.data.length / 2)
                      ? "right-0 rounded-l-lg rounded-tr-lg"
                      : "left-0 rounded-r-lg rounded-tl-lg"
                  } py-1 px-2 bg-white text-black text-right border border-black/30 shadow-md`}
                >
                  <p className="font-bold">{formatRupiah(g.value)}</p>
                  <p className="text-xs">{g.percentage}%</p>
                </div>
              )}
              <button
                type="button"
                onClick={() => setSelectedKey(g.key)}
                className="w-full h-full cursor-pointer"
              />
            </div>
            <p className="mt-1 text-center">{g.x}</p>
          </div>
        ))}
    </div>
  );
}
