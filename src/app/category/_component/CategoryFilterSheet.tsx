import CheckboxInput from "@/component/input/CheckboxInput";
import BottomSheet from "@/component/sheet/BottomSheet";

interface Props {
  isOpen: boolean;
  close: () => void;
  types: { spending: boolean; saving: boolean };
  setTypes: (types: { spending: boolean; saving: boolean }) => void;
}

export default function CategoryFilterSheet(props: Readonly<Props>) {
  return (
    <BottomSheet isOpen={props.isOpen} close={props.close}>
      <p className="font-bold text-center text-lg">Filter</p>
      <div className="mt-4 space-y-4">
        <div>
          <p className="font-bold">Category Type</p>
          <div className="mt-1 space-y-1">
            <CheckboxInput
              checked={props.types.spending}
              onClick={() =>
                props.setTypes({
                  ...props.types,
                  spending: !props.types.spending,
                })
              }
            >
              Spending
            </CheckboxInput>
            <CheckboxInput
              checked={props.types.saving}
              onClick={() =>
                props.setTypes({ ...props.types, saving: !props.types.saving })
              }
            >
              Saving
            </CheckboxInput>
          </div>
        </div>
      </div>
    </BottomSheet>
  );
}
