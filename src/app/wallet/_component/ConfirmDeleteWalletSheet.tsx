import Button from "@/component/button/Button";
import BottomSheet from "@/component/sheet/BottomSheet";
import { clientInternalApiCall } from "@/util/fetch/fromClient";
import Log from "@/util/log";
import { useState } from "react";

interface Props {
  isOpen: boolean;
  close: () => void;
  afterDelete: () => void;
  wallet: WalletI;
}

export default function ConfirmDeleteWalletSheet(props: Readonly<Props>) {
  const [isLoadingRemove, setIsLoadingRemove] = useState(false);

  function close() {
    if (isLoadingRemove) return;
    props.close();
  }

  async function remove() {
    setIsLoadingRemove(true);

    try {
      await clientInternalApiCall("/api/wallet/" + props.wallet.id, undefined, {
        method: "DELETE",
      });
    } catch (error: unknown) {
      if (!(error instanceof Error) || error.name !== "AbortError") {
        Log.error("Error remove wallet", error);
      }
    }

    props.close();
    props.afterDelete();

    setIsLoadingRemove(false);
  }

  return (
    <BottomSheet isOpen={props.isOpen} close={close} zIndex={1}>
      <p className="font-bold text-center text-lg">Delete Wallet</p>

      <p className="mt-2">
        Are you sure you want to delete{" "}
        <span className="font-bold">{props.wallet.name}</span> wallet? This
        action cannot be undone.
      </p>

      <div className="flex items-center gap-x-4 mt-2">
        <Button type="button" disable={isLoadingRemove} onClick={props.close}>
          Cancel
        </Button>
        <Button type="button" loading={isLoadingRemove} onClick={remove}>
          Delete
        </Button>
      </div>
    </BottomSheet>
  );
}
