import Button from "@/component/button/Button";
import TrashIcon from "@/component/icon/TrashIcon";
import BottomSheet from "@/component/sheet/BottomSheet";
import { COLORS } from "@/constant/color";
import { FormEvent, useEffect, useMemo, useState } from "react";
import ConfirmDeleteCategorySheet from "./ConfirmDeleteCategorySheet";
import RadioInput from "@/component/input/RadioInput";
import { clientInternalApiCall } from "@/util/fetch/fromClient";

interface Props {
  isOpen: boolean;
  close: () => void;
  category?: CategoryI;
  refreshCategories: () => void;
}

export default function CategoryFormSheet(props: Readonly<Props>) {
  const [value, setValue] = useState(props.category ?? {});
  const [isLoadingSubmit, setIsLoadingSubmit] = useState(false);
  const [isShowConfirmDelete, setIsShowConfirmDelete] = useState(false);

  useEffect(() => {
    if (props.isOpen) {
      setValue(props.category ?? {});
    }
  }, [props.isOpen, props.category]);

  const title = useMemo(
    () => (props.category ? "Edit Category" : "Add Category"),
    [props.category]
  );

  function close() {
    if (isLoadingSubmit) return;
    props.close();
  }

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();

    setIsLoadingSubmit(true);

    if (!props.category) {
      await clientInternalApiCall("/api/category", undefined, {
        method: "POST",
        body: JSON.stringify(value),
      });
    } else {
      await clientInternalApiCall(
        "/api/category/" + props.category.id,
        undefined,
        {
          method: "PUT",
          body: JSON.stringify(value),
        }
      );
    }

    props.close();
    props.refreshCategories();

    setIsLoadingSubmit(false);
  }

  function afterDelete() {
    props.close();
    props.refreshCategories();
  }

  return (
    <>
      <BottomSheet isOpen={props.isOpen} close={close}>
        <div className="flex items-center justify-between text-lg">
          <div className="w-6.5 h-6.5" />
          <p className="font-bold text-center">{title}</p>
          <div className="w-6.5 h-6.5 flex items-center justify-center">
            {props.category && (
              <button
                type="button"
                onClick={() => setIsShowConfirmDelete(true)}
                className="block p-1 cursor-pointer"
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
              placeholder="Example: Food"
              value={value?.name ?? ""}
              onChange={(e) =>
                setValue((prev) => ({ ...prev, name: e.target.value }))
              }
            />
          </div>

          <div>
            <p className="font-bold">Color</p>
            <div className="mt-0.5 flex flex-wrap gap-2">
              {Object.entries(COLORS).map(([name, color]) => (
                <button
                  key={name}
                  type="button"
                  onClick={() => setValue((prev) => ({ ...prev, color }))}
                  className="w-7 h-7 mt-0.5 border rounded-lg cursor-pointer"
                  style={{
                    backgroundColor: color,
                    borderColor:
                      value.color === color
                        ? "#fff"
                        : "color-mix(in srgb, #fff 0%, transparent)",
                  }}
                />
              ))}
            </div>
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

          <Button
            type="submit"
            disable={!value.name || !value.color || !value.type_id}
            loading={isLoadingSubmit}
          >
            {props.category ? "Edit" : "Add"}
          </Button>
        </form>
      </BottomSheet>

      {props.category && (
        <ConfirmDeleteCategorySheet
          isOpen={isShowConfirmDelete}
          close={() => setIsShowConfirmDelete(false)}
          afterDelete={afterDelete}
          category={props.category}
        />
      )}
    </>
  );
}
