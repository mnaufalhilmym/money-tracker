import Button from "@/component/button/Button";
import TrashIcon from "@/component/icon/TrashIcon";
import BottomSheet from "@/component/sheet/BottomSheet";
import { FormEvent, useEffect, useMemo, useState } from "react";
import ConfirmDeleteWalletSheet from "./ConfirmDeleteWalletSheet";
import RadioInput from "@/component/input/RadioInput";

interface Props {
  isOpen: boolean;
  close: () => void;
  wallet?: WalletI;
}

export default function WalletFormSheet(props: Readonly<Props>) {
  const [value, setValue] = useState(props.wallet ?? {});
  const [isShowConfirmDelete, setIsShowConfirmDelete] = useState(false);

  useEffect(() => {
    setValue(props.wallet ?? {});
  }, [props.wallet]);

  const title = useMemo(
    () => (props.wallet ? "Edit Wallet" : "Add Wallet"),
    [props.wallet]
  );

  function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    props.close();
  }

  return (
    <>
      <BottomSheet isOpen={props.isOpen} close={props.close}>
        <div className="flex items-center justify-between text-lg">
          <div className="w-6.5 h-6.5" />
          <p className="font-bold text-center">{title}</p>
          <div className="w-6.5 h-6.5 flex items-center justify-center">
            {props.wallet && (
              <button
                type="button"
                onClick={() => setIsShowConfirmDelete(true)}
                className="block p-1"
              >
                <TrashIcon />
              </button>
            )}
          </div>
        </div>

        <form onSubmit={onSubmit} className="mt-2 space-y-4">
          <div>
            <p className="font-bold">Name</p>
            <input
              className="outline-none w-full mt-0.5 border-b border-white/20 focus:border-white"
              placeholder="Example: AstraPay"
              value={value?.name ?? ""}
              onChange={(e) =>
                setValue((prev) => ({ ...prev, name: e.target.value }))
              }
            />
          </div>

          <div>
            <p className="font-bold">Type</p>
            <div className="mt-0.5 flex items-center gap-x-8">
              <RadioInput
                checked={value.type === "spending"}
                onClick={() =>
                  setValue((prev) => ({ ...prev, type: "spending" }))
                }
              >
                Spending
              </RadioInput>
              <RadioInput
                checked={value.type === "saving"}
                onClick={() =>
                  setValue((prev) => ({ ...prev, type: "saving" }))
                }
              >
                Saving
              </RadioInput>
            </div>
          </div>

          <Button type="submit">Add</Button>
        </form>
      </BottomSheet>

      {props.wallet && (
        <ConfirmDeleteWalletSheet
          isOpen={isShowConfirmDelete}
          close={() => setIsShowConfirmDelete(false)}
          wallet={props.wallet}
        />
      )}
    </>
  );
}
