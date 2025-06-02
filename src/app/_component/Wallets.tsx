import Button from "@/component/button/Button";
import OpenIcon from "@/component/icon/OpenIcon";
import Loading from "@/component/loading/Loading";
import NotFound from "@/component/notFound/NotFound";
import { formatRupiah } from "@/util/formatAmount";
import toTitleCase from "@/util/titleCase";
import Link from "next/link";
import { useRef } from "react";

interface Props {
  typeName: string;
  isLoading?: boolean;
  canLoadMore?: boolean;
  data: WalletI[];
  getWallets: (abortSignal: AbortSignal) => Promise<void>;
}

export default function Wallets(props: Readonly<Props>) {
  const abortController = useRef<AbortController>(null);

  async function onClickSeeMore(
    e: React.MouseEvent<HTMLButtonElement, MouseEvent>
  ) {
    e.stopPropagation();

    abortController.current?.abort();
    abortController.current = new AbortController();

    await props.getWallets(abortController.current.signal);
  }

  return (
    <>
      <div className="flex items-center justify-between font-bold">
        <p className="text-lg">{toTitleCase(props.typeName)} wallets</p>
        <Link href="/wallet" className="text-xl">
          <OpenIcon />
        </Link>
      </div>

      {!!props.data.length && (
        <div className="mt-2 grid grid-cols-2 gap-4">
          {props.data.map((d) => (
            <div
              key={`wallet_${d.id}`}
              className="py-2.5 px-3.5 flex flex-col justify-between rounded-2xl bg-white/20 border border-white/20"
            >
              <p>{d.name}</p>

              <div className="mt-1 flex flex-wrap items-end gap-x-1.5">
                <p className="font-bold text-xl">
                  {formatRupiah(d.amount ?? 0)}
                </p>
                <p>({d.amount_percentage}%)</p>
              </div>

              <p className="text-xs">
                Avg {formatRupiah(d.amount_average_per_day ?? 0)}/day
              </p>
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
        <div className="mt-4 py-1.5 border border-transparent">
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
