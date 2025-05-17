import CloseIcon from "@/component/icon/CloseIcon";
import BottomSheet from "@/component/sheet/BottomSheet";

interface Props {
  isOpen: boolean;
  close: () => void;
  wallets: { id: string; name: string }[];
  wallet: { id: string; name: string };
  setWallet: (wallet: { id: string; name: string }) => void;
}

export default function HistoryWalletPickerSheet(props: Readonly<Props>) {
  function setWallet(wallet: { id: string; name: string }) {
    props.setWallet(wallet);
    props.close();
  }

  return (
    <BottomSheet isOpen={props.isOpen} close={props.close}>
      <div className="flex items-center justify-between text-lg">
        <div className="w-6.5 h-6.5" />
        <p className="font-bold text-center">Pick a Wallet</p>
        <div className="w-6.5 h-6.5 flex items-center justify-center">
          <button type="button" onClick={props.close} className="block p-1">
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
              props.wallet.id === w.id ? "font-bold" : "font-normal"
            }`}
          >
            {w.name}
          </button>
        ))}
      </div>
    </BottomSheet>
  );
}
