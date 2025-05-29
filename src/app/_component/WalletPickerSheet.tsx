import CloseIcon from "@/component/icon/CloseIcon";
import BottomSheet from "@/component/sheet/BottomSheet";
import PickerSelectButton from "./PickerSelectButton";

interface Props {
  isOpen: boolean;
  close: () => void;
  data: WalletI[];
  active?: { id: number; name: string };
  setActive: (data?: { id: number; name: string }) => void;
}

export default function WalletPickerSheet(props: Readonly<Props>) {
  function setWallet(data?: { id: number; name: string }) {
    props.setActive(data);
    props.close();
  }

  return (
    <BottomSheet isOpen={props.isOpen} close={props.close} zIndex={1}>
      <div className="flex items-center justify-between text-lg">
        <div className="w-6.5 h-6.5" />
        <p className="font-bold text-center">Pick a Wallet</p>
        <div className="w-6.5 h-6.5 flex items-center justify-center">
          <button
            type="button"
            onClick={props.close}
            className="block p-1 cursor-pointer"
          >
            <CloseIcon />
          </button>
        </div>
      </div>

      <div className="mt-2">
        <PickerSelectButton
          onClick={() => setWallet()}
          isActive={!props.active}
        >
          All
        </PickerSelectButton>
        {props.data.map((w) => (
          <PickerSelectButton
            key={`wallet_${w.id}`}
            onClick={() => setWallet({ id: w.id!, name: w.name! })}
            isActive={props.active?.id === w.id}
          >
            {w.name}
          </PickerSelectButton>
        ))}
      </div>
    </BottomSheet>
  );
}
