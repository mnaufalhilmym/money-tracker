import Button from "@/component/button/Button";
import CheckboxInput from "@/component/input/CheckboxInput";
import BottomSheet from "@/component/sheet/BottomSheet";
import toTitleCase from "@/util/titleCase";
import { FormEvent, useEffect, useState } from "react";

interface Props {
  isOpen: boolean;
  close: () => void;
  types: { [key: string]: boolean };
  setTypes: (types: { [key: string]: boolean }) => void;
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
          <p className="font-bold">Type</p>
          <div className="mt-1 space-y-1">
            {Object.entries(types).map(([key, value]) => (
              <CheckboxInput
                key={key}
                checked={value}
                onClick={() =>
                  setTypes({
                    ...types,
                    [key]: !value,
                  })
                }
              >
                {toTitleCase(key)}
              </CheckboxInput>
            ))}
          </div>
        </div>

        <Button type="submit">Filter</Button>
      </form>
    </BottomSheet>
  );
}
