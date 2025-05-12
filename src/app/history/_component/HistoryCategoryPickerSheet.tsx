import CloseIcon from "@/component/icon/CloseIcon";
import BottomSheet from "@/component/sheet/BottomSheet";

interface Props {
  isOpen: boolean;
  close: () => void;
  categories: { id: string; name: string }[];
  category: { id: string; name: string };
  setCategory: (category: { id: string; name: string }) => void;
}

export default function HistoryCategoryPickerSheet(props: Readonly<Props>) {
  function setCategory(category: { id: string; name: string }) {
    props.setCategory(category);
    props.close();
  }

  return (
    <BottomSheet isOpen={props.isOpen} close={props.close}>
      <div className="flex items-center justify-between text-lg">
        <div className="w-6.5 h-6.5" />
        <p className="font-bold text-center">History Category</p>
        <div className="w-6.5 h-6.5 flex items-center justify-center">
          <button type="button" onClick={props.close} className="block p-1">
            <CloseIcon />
          </button>
        </div>
      </div>

      <div className="mt-2">
        {props.categories.map((c) => (
          <button
            key={c.id}
            type="button"
            onClick={() => setCategory(c)}
            className={`block w-full p-1 text-center ${
              props.category.id === c.id ? "font-bold" : "font-normal"
            }`}
          >
            {c.name}
          </button>
        ))}
      </div>
    </BottomSheet>
  );
}
