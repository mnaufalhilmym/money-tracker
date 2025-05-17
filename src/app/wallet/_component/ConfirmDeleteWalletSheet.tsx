import Button from "@/component/button/Button";
import BottomSheet from "@/component/sheet/BottomSheet";

interface Props {
  isOpen: boolean;
  close: () => void;
  wallet: WalletI;
}

export default function ConfirmDeleteWalletSheet(props: Readonly<Props>) {
  function remove() {
    props.close();
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
