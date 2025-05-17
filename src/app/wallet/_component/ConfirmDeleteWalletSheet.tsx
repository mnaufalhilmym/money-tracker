import Button from "@/component/button/Button";
import BottomSheet from "@/component/sheet/BottomSheet";
import { clientInternalApiCall } from "@/util/fetch/fromClient";

interface Props {
  isOpen: boolean;
  close: () => void;
  afterDelete: () => void;
  wallet: WalletI;
}

export default function ConfirmDeleteWalletSheet(props: Readonly<Props>) {
  async function remove() {
    await clientInternalApiCall("/api/wallet/" + props.wallet.id, undefined, {
      method: "DELETE",
    });

    props.close();
    props.afterDelete();
  }

  return (
    <BottomSheet isOpen={props.isOpen} close={props.close}>
      <p className="font-bold text-center text-lg">Delete Wallet</p>
      <p className="mt-2">
        Are you sure you want to delete{" "}
        <span className="font-bold">{props.wallet.name}</span> wallet? This
        action cannot be undone.
      </p>
      <div className="flex items-center gap-x-4 mt-2">
        <Button type="button" onClick={props.close}>
          Cancel
        </Button>
        <Button type="button" onClick={remove}>
          Delete
        </Button>
      </div>
    </BottomSheet>
  );
}
