import ChevronDownIcon from "@/component/icon/ChevronDownIcon";
import { useState } from "react";
import CategoryPickerSheet from "./CategoryPickerSheet";

interface Props {
  isLoading?: boolean;
  active?: { id: number; name: string };
  setActive: (data?: { id: number; name: string }) => void;
  data: CategoryI[];
}

export default function CategoryPicker(props: Readonly<Props>) {
  const [isShowPicker, setIsShowPicker] = useState(false);

  return (
    <>
      <div className="flex items-center gap-x-2">
        <p>Category:</p>

        {props.isLoading ? (
          <div className="w-17.5 h-9.5 bg-white/20 rounded-full border border-white/20 animate-pulse" />
        ) : (
          <button
            type="button"
            onClick={() => setIsShowPicker(true)}
            className="flex items-center justify-between gap-x-1.5 py-2 px-4 bg-white/20 text-white rounded-full border border-white/20 cursor-pointer"
          >
            <span className="whitespace-nowrap">
              {props.active?.name ?? "All"}
            </span>
            <ChevronDownIcon />
          </button>
        )}
      </div>

      <CategoryPickerSheet
        isOpen={isShowPicker}
        close={() => setIsShowPicker(false)}
        active={props.active}
        setActive={props.setActive}
        data={props.data}
      />
    </>
  );
}
