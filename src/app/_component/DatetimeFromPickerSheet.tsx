import CloseIcon from "@/component/icon/CloseIcon";
import BottomSheet from "@/component/sheet/BottomSheet";
import PickerSelectButton from "./PickerSelectButton";

interface Props {
  isOpen: boolean;
  close: () => void;
  datetimeFromOptions: AmountDatetimeFrom[];
  datetimeFrom?: AmountDatetimeFrom;
  setDatetimeFrom: (from: AmountDatetimeFrom) => void;
}

export default function DatetimeFromPickerSheet(props: Readonly<Props>) {
  function setDatetimeFrom(from: AmountDatetimeFrom) {
    props.setDatetimeFrom(from);
    props.close();
  }

  return (
    <BottomSheet isOpen={props.isOpen} close={props.close}>
      <div className="flex items-center justify-between text-lg">
        <div className="w-6.5 h-6.5" />
        <p className="font-bold text-center">Pick a Datetime</p>
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
        {props.datetimeFromOptions.map((dt) => (
          <PickerSelectButton
            key={`datetime_${dt.name}`}
            onClick={() => setDatetimeFrom(dt)}
            isActive={props.datetimeFrom?.name === dt.name}
          >
            {dt.name}
          </PickerSelectButton>
        ))}
      </div>
    </BottomSheet>
  );
}
