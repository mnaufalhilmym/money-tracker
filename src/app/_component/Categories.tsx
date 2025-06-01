import Button from "@/component/button/Button";
import OpenIcon from "@/component/icon/OpenIcon";
import Loading from "@/component/loading/Loading";
import NotFound from "@/component/notFound/NotFound";
import toTitleCase from "@/util/titleCase";
import Link from "next/link";
import { useRef } from "react";

interface Props {
  typeName: string;
  isLoading?: boolean;
  canLoadMore?: boolean;
  data: CategoryI[];
  getCategories: (abortSignal: AbortSignal) => Promise<void>;
}

export default function Categories(props: Readonly<Props>) {
  const abortController = useRef<AbortController>(null);

  async function onClickSeeMore(
    e: React.MouseEvent<HTMLButtonElement, MouseEvent>
  ) {
    e.stopPropagation();

    abortController.current?.abort();
    abortController.current = new AbortController();

    await props.getCategories(abortController.current.signal);
  }

  return (
    <>
      <div className="flex items-center justify-between font-bold">
        <p className="text-lg">{toTitleCase(props.typeName)} categories</p>
        <Link href="/category" className="text-xl">
          <OpenIcon />
        </Link>
      </div>

      {!props.isLoading && !!props.data.length && (
        <div className="mt-2 grid grid-cols-2 gap-4">
          {props.data.map((d) => (
            <div
              key={`category_${d.id}`}
              className="py-2.5 px-3.5 rounded-2xl bg-white/20 border border-white/20"
            >
              <div className="flex items-center gap-x-1.5">
                <div
                  className="w-2 h-2 rounded-full"
                  style={{ backgroundColor: d.color }}
                />
                <p>{d.name}</p>
              </div>
              <div className="mt-1">
                <div className="flex items-end gap-x-1.5">
                  <p className="font-bold text-xl">{d.amount}</p>
                  <p>({d.amount_percentage}%)</p>
                </div>
                <p className="text-xs">Avg {d.amount_average}</p>
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

      {!props.isLoading && !!props.data.length && props.canLoadMore && (
        <div className="mt-4">
          <Button type="button" onClick={onClickSeeMore}>
            See more
          </Button>
        </div>
      )}
    </>
  );
}
