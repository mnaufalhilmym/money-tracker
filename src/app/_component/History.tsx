import Button from "@/component/button/Button";
import OpenIcon from "@/component/icon/OpenIcon";
import Loading from "@/component/loading/Loading";
import NotFound from "@/component/notFound/NotFound";
import Link from "next/link";

interface Props {
  isLoading?: boolean;
  data: HistoryI[];
}

export default function History(props: Readonly<Props>) {
  return (
    <>
      <div className="flex items-center justify-between font-bold">
        <p className="text-lg">Spending History</p>
        <Link href="/history" className="text-xl">
          <OpenIcon />
        </Link>
      </div>

      {!props.isLoading && !!props.data.length && (
        <div className="mt-2 space-y-2.5">
          {props.data.map((d) => (
            <div
              key={`history_${d.id}`}
              className="flex items-center gap-x-2 justify-between"
            >
              <div className="flex items-center gap-x-2">
                <div
                  className="w-8 h-8 rounded-full"
                  style={{ backgroundColor: d.category_color }}
                />
                <div>
                  <p className="font-bold">{d.description}</p>
                  <p className="text-xs text-white/70">
                    {new Date(d.datetime!).toLocaleString()}
                  </p>
                </div>
              </div>
              <div>
                <p className="font-bold">
                  {d.type_amount_prefix}
                  {d.amount}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}

      {!props.isLoading && !props.data.length && (
        <div className="mt-4">
          <NotFound />
        </div>
      )}

      {props.isLoading && (
        <div className="mt-4">
          <Loading />
        </div>
      )}

      {!props.isLoading && !!props.data.length && (
        <div className="mt-3">
          <Button type="button">See more</Button>
        </div>
      )}
    </>
  );
}
