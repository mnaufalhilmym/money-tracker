import CloseIcon from "@/component/icon/CloseIcon";
import BottomSheet from "@/component/sheet/BottomSheet";

interface Props {
  isOpen: boolean;
  close: () => void;
  type: string;
  setType: (type: "Spending" | "Saving") => void;
}

export default function HistoryTypePickerSheet(props: Readonly<Props>) {
  function setType(type: "Spending" | "Saving") {
    props.setType(type);
    props.close();
  }

  return (
    <BottomSheet isOpen={props.isOpen} close={props.close}>
      <div className="flex items-center justify-between text-lg">
        <div className="w-6.5 h-6.5" />
        <p className="font-bold text-center">History Type</p>
        <div className="w-6.5 h-6.5 flex items-center justify-center">
          <button type="button" onClick={props.close} className="block p-1">
            <CloseIcon />
          </button>
        </div>
      </div>

      <div className="mt-2">
        <button
          type="button"
          onClick={() => setType("Spending")}
          className={`block w-full p-1 text-center ${
            props.type === "Spending" ? "font-bold" : "font-normal"
          }`}
        >
          Spending
        </button>
        <button
          type="button"
          onClick={() => setType("Saving")}
          className={`block w-full p-1 text-center ${
            props.type === "Saving" ? "font-bold" : "font-normal"
          }`}
        >
          Saving
        </button>
      </div>
    </BottomSheet>
  );
}
