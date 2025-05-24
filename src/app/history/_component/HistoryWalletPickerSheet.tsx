import CloseIcon from "@/component/icon/CloseIcon";
import BottomSheet from "@/component/sheet/BottomSheet";
import toTitleCase from "@/util/titleCase";

interface Props {
  isOpen: boolean;
  close: () => void;
  wallets: WalletI[];
  wallet?: number;
  setWallet: (wallet: WalletI) => void;
}

export default function HistoryWalletPickerSheet(props: Readonly<Props>) {
  function setWallet(wallet: WalletI) {
    props.setWallet(wallet);
    props.close();
  }

  return (
    <BottomSheet isOpen={props.isOpen} close={props.close}>
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
        {props.wallets.map((w) => (
          <button
            key={w.id}
            type="button"
            onClick={() => setWallet(w)}
            className={`block w-full p-1 text-center ${
              props.wallet === w.id ? "font-bold" : "font-normal"
            } cursor-pointer`}
          >
            {toTitleCase(w.name!)}
          </button>
        ))}
      </div>
    </BottomSheet>
  );
}
