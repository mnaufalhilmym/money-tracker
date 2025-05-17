import Button from "@/component/button/Button";
import TrashIcon from "@/component/icon/TrashIcon";
import BottomSheet from "@/component/sheet/BottomSheet";
import { FormEvent, useEffect, useMemo, useState } from "react";
import ConfirmDeleteWalletSheet from "./ConfirmDeleteWalletSheet";
import RadioInput from "@/component/input/RadioInput";
import { clientInternalApiCall } from "@/util/fetch/fromClient";

interface Props {
  isOpen: boolean;
  close: () => void;
  wallet?: WalletI;
  refreshWallets: () => void;
}

export default function WalletFormSheet(props: Readonly<Props>) {
  const [value, setValue] = useState(props.wallet ?? {});
  const [isShowConfirmDelete, setIsShowConfirmDelete] = useState(false);

  useEffect(() => {
    if (props.isOpen) {
      setValue(props.wallet ?? {});
    }
  }, [props.isOpen, props.wallet]);

  const title = useMemo(
    () => (props.wallet ? "Edit Wallet" : "Add Wallet"),
    [props.wallet]
  );

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();

    if (!props.wallet) {
      await clientInternalApiCall("/api/wallet", undefined, {
        method: "POST",
        body: JSON.stringify(value),
      });
    } else {
      await clientInternalApiCall("/api/wallet/" + props.wallet.id, undefined, {
        method: "PUT",
        body: JSON.stringify(value),
      });
    }

    props.close();
    props.refreshWallets();
  }

  function afterDelete() {
    props.close();
    props.refreshWallets();
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
                checked={value.type_id === 1}
                onClick={() =>
                  setValue((prev) => ({
                    ...prev,
                    type_id: 1,
                    type_name: "SPENDING",
                  }))
                }
              >
                Spending
              </RadioInput>
              <RadioInput
                checked={value.type_id === 2}
                onClick={() =>
                  setValue((prev) => ({
                    ...prev,
                    type_id: 2,
                    type_name: "SAVING",
                  }))
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
          afterDelete={afterDelete}
          wallet={props.wallet}
        />
      )}
    </>
  );
}
