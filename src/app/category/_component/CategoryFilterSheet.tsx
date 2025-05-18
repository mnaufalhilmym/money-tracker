import Button from "@/component/button/Button";
import CheckboxInput from "@/component/input/CheckboxInput";
import BottomSheet from "@/component/sheet/BottomSheet";
import { FormEvent, useEffect, useState } from "react";

interface Props {
  isOpen: boolean;
  close: () => void;
  types: { spending: boolean; saving: boolean };
  setTypes: (types: { spending: boolean; saving: boolean }) => void;
}

export default function CategoryFilterSheet(props: Readonly<Props>) {
  const [types, setTypes] = useState(props.types ?? {});

  useEffect(() => {
    if (props.isOpen) {
      setTypes(props.types);
    }
  }, [props.isOpen]);

  function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();

    props.setTypes(types);
    props.close();
  }

  return (
    <BottomSheet isOpen={props.isOpen} close={props.close}>
      <p className="font-bold text-center text-lg">Choose Filter</p>

      <form onSubmit={onSubmit} className="mt-2 space-y-4">
        <div>
          <p className="font-bold">Category Type</p>
          <div className="mt-1 space-y-1">
            <CheckboxInput
              checked={types.spending}
              onClick={() =>
                setTypes({
                  ...types,
                  spending: !types.spending,
                })
              }
            >
              Spending
            </CheckboxInput>
            <CheckboxInput
              checked={types.saving}
              onClick={() => setTypes({ ...types, saving: !types.saving })}
            >
              Saving
            </CheckboxInput>
          </div>
        </div>

        <Button type="submit">Filter</Button>
      </form>
    </BottomSheet>
  );
}
