import Button from "@/component/button/Button";
import CheckboxInput from "@/component/input/CheckboxInput";
import BottomSheet from "@/component/sheet/BottomSheet";
import toTitleCase from "@/util/titleCase";
import { FormEvent, useEffect, useState } from "react";

interface Props {
  isOpen: boolean;
  close: () => void;
  filter: {
    types: { [key: string]: boolean };
    wallets: { [key: string]: boolean };
    categories: { [key: string]: boolean };
  };
  setFilter: (filter: {
    types: { [key: string]: boolean };
    wallets: { [key: string]: boolean };
    categories: { [key: string]: boolean };
  }) => void;
}

export default function HistoryFilterSheet(props: Readonly<Props>) {
  const [filter, setFilter] = useState(props.filter ?? {});

  useEffect(() => {
    if (props.isOpen) {
      setFilter(props.filter);
    }
  }, [props.isOpen, props.filter]);

  function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();

    props.setFilter(filter);
    props.close();
  }

  return (
    <BottomSheet isOpen={props.isOpen} close={props.close}>
      <p className="font-bold text-center text-lg">Choose Filter</p>

      <form onSubmit={onSubmit} className="mt-2 space-y-4">
        {filter.types && (
          <div>
            <p className="font-bold">Type</p>
            <div className="mt-1 space-y-1">
              {Object.entries(filter.types).map(([key, value]) => (
                <CheckboxInput
                  key={key}
                  checked={value}
                  onClick={() =>
                    setFilter((prev) => ({
                      ...prev,
                      types: {
                        ...prev.types,
                        [key]: !value,
                      },
                    }))
                  }
                >
                  {toTitleCase(key)}
                </CheckboxInput>
              ))}
            </div>
          </div>
        )}

        {filter.wallets && (
          <div>
            <p className="font-bold">Wallet</p>
            <div className="mt-1 space-y-1">
              {Object.entries(filter.wallets).map(([key, value]) => (
                <CheckboxInput
                  key={key}
                  checked={value}
                  onClick={() =>
                    setFilter((prev) => ({
                      ...prev,
                      wallets: {
                        ...prev.wallets,
                        [key]: !value,
                      },
                    }))
                  }
                >
                  {toTitleCase(key)}
                </CheckboxInput>
              ))}
            </div>
          </div>
        )}

        {filter.categories && (
          <div>
            <p className="font-bold">Category</p>
            <div className="mt-1 space-y-1">
              {Object.entries(filter.categories).map(([key, value]) => (
                <CheckboxInput
                  key={key}
                  checked={value}
                  onClick={() =>
                    setFilter((prev) => ({
                      ...prev,
                      categories: {
                        ...prev.categories,
                        [key]: !value,
                      },
                    }))
                  }
                >
                  {toTitleCase(key)}
                </CheckboxInput>
              ))}
            </div>
          </div>
        )}

        <Button type="submit">Filter</Button>
      </form>
    </BottomSheet>
  );
}
