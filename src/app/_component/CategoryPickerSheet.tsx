import CloseIcon from "@/component/icon/CloseIcon";
import BottomSheet from "@/component/sheet/BottomSheet";
import PickerSelectButton from "./PickerSelectButton";

interface Props {
  isOpen: boolean;
  close: () => void;
  data: CategoryI[];
  active?: { id: number; name: string };
  setActive: (data?: { id: number; name: string }) => void;
}

export default function CategoryPickerSheet(props: Readonly<Props>) {
  function setCategory(data?: { id: number; name: string }) {
    props.setActive(data);
    props.close();
  }

  return (
    <BottomSheet isOpen={props.isOpen} close={props.close} zIndex={2}>
      <div className="flex items-center justify-between text-lg">
        <div className="w-6.5 h-6.5" />
        <p className="font-bold text-center">Pick a Category</p>
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
          onClick={() => setCategory()}
          isActive={!props.active}
        >
          All
        </PickerSelectButton>
        {props.data.map((c) => (
          <PickerSelectButton
            key={`category_${c.id}`}
            onClick={() => setCategory({ id: c.id!, name: c.name! })}
            isActive={props.active?.id === c.id}
          >
            {c.name}
          </PickerSelectButton>
        ))}
      </div>
    </BottomSheet>
  );
}
