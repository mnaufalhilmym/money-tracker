import CloseIcon from "@/component/icon/CloseIcon";
import BottomSheet from "@/component/sheet/BottomSheet";
import toTitleCase from "@/util/titleCase";

interface Props {
  isOpen: boolean;
  close: () => void;
  types: TypeI[];
  type?: number;
  setType: (t: TypeI) => void;
}

export default function HistoryTypePickerSheet(props: Readonly<Props>) {
  function setType(t: TypeI) {
    props.setType(t);
    props.close();
  }

  return (
    <BottomSheet isOpen={props.isOpen} close={props.close}>
      <div className="flex items-center justify-between text-lg">
        <div className="w-6.5 h-6.5" />
        <p className="font-bold text-center">Pick Type</p>
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
        {props.types.map((t) => (
          <button
            key={t.id}
            type="button"
            onClick={() => setType(t)}
            className={`block w-full p-1 text-center ${
              props.type === t.id ? "font-bold" : "font-normal"
            } cursor-pointer`}
          >
            {toTitleCase(t.name!)}
          </button>
        ))}
      </div>
    </BottomSheet>
  );
}
