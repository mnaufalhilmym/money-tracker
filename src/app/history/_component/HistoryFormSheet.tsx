import TrashIcon from "@/component/icon/TrashIcon";
import BottomSheet from "@/component/sheet/BottomSheet";
import { FormEvent, useEffect, useMemo, useState } from "react";
import ConfirmDeleteHistorySheet from "./ConfirmDeleteHistorySheet";
import Button from "@/component/button/Button";

interface Props {
  isOpen: boolean;
  close: () => void;
  history?: HistoryI;
}

export default function HistoryFormSheet(props: Readonly<Props>) {
  const [value, setValue] = useState(props.history ?? {});
  const [isShowConfirmDelete, setIsShowConfirmDelete] = useState(false);

  useEffect(() => {
    setValue(props.history ?? {});
  }, [props.history]);

  const title = useMemo(
    () => (props.history ? "Edit History" : "Add History"),
    [props.history]
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
            {props.history && (
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

        <form onSubmit={onSubmit} className="mt-4 space-y-4">
          <div>
            <p className="font-bold"></p>
          </div>

          <Button type="submit">Add</Button>
        </form>
      </BottomSheet>

      {props.history && (
        <ConfirmDeleteHistorySheet
          isOpen={isShowConfirmDelete}
          close={() => setIsShowConfirmDelete(false)}
          history={props.history}
        />
      )}
    </>
  );
}
