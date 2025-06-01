"use client";

import useDateNow from "@/hook/useDateNow";
import { useEffect, useMemo, useState } from "react";

interface Props {
  isLoading: boolean;
  datetimeFrom?: { per: string; name: string; datetime?: Date };
  graph: { key: Date; value: number }[];
}

export default function Graph(props: Readonly<Props>) {
  const now = useDateNow();

  const graph = useMemo(() => {
    if (!now) return { data: [], maxValue: 0 };

    let d = new Date(now);
    if (props.datetimeFrom?.datetime) {
      d = new Date(props.datetimeFrom.datetime);
    }
    if (props.graph.length && props.graph[0].key.getTime() < d.getTime()) {
      d = new Date(props.graph[0].key);
    }

    switch (props.datetimeFrom?.per) {
      case "day": {
        const startOfDay = new Date(d);
        startOfDay.setHours(0, 0, 0, 0);
        d = startOfDay;
        break;
      }
      case "week": {
        const day = d.getDay(); // 0 = Sunday, 1 = Monday, ..., 6 = Saturday
        const diffToMonday = day === 0 ? -6 : 1 - day;
        const startOfWeek = new Date(d);
        startOfWeek.setDate(d.getDate() + diffToMonday);
        startOfWeek.setHours(0, 0, 0, 0);
        d = startOfWeek;
        break;
      }
      case "month": {
        const startOfMonth = new Date(d.getFullYear(), d.getMonth(), 1);
        d = startOfMonth;
        break;
      }
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

      const key = new Date(d);
      const percentage = (value * 100) / totalValue;
      const newGraph = {
        key,
        value,
        x: "",
        percentage: isNaN(percentage) ? 0 : percentage.toFixed(2),
      };

      switch (props.datetimeFrom?.per) {
        case "day":
          d.setDate(d.getDate() + 1);
          newGraph.x = `${key.getDate()}`;
          break;
        case "week":
          d.setDate(d.getDate() + 7);
          newGraph.x = `${key.getDate()}${key.toLocaleString("en-US", {
            month: "short",
          })} - ${d.getDate()}${d.toLocaleString("en-US", {
            month: "short",
          })}`;
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

    return { data: g, maxValue };
  }, [now, props.datetimeFrom, props.graph]);

  const [selectedKey, setSelectedKey] = useState<Date>();

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
        props.isLoading
          ? "bg-white/20 rounded animate-pulse"
          : "flex gap-x-2 pt-14 overflow-x-auto scrollable"
      }`}
    >
      {!props.isLoading &&
        graph.data.map((g) => (
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
                <div className="absolute -top-12.5 right-0 py-1 px-2 bg-white text-black text-right rounded-l-lg rounded-tr-lg">
                  <p className="font-bold">{g.value}</p>
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
