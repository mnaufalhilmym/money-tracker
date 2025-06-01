import ChevronDownIcon from "@/component/icon/ChevronDownIcon";
import { useState } from "react";
import DatetimeFromPickerSheet from "./DatetimeFromPickerSheet";

interface Props {
  isLoading: boolean;
  data: AmountI;
  datetimeFromOptions: AmountDatetimeFrom[];
  datetimeFrom?: AmountDatetimeFrom;
  setDatetimeFrom: (from: AmountDatetimeFrom) => void;
}

export default function Amount(props: Readonly<Props>) {
  const [isShowDatetimeFromPicker, setIsShowDatetimeFromPicker] =
    useState(false);

  return (
    <>
      <div className="flex items-center justify-between gap-x-4">
        <div className="min-w-0 flex-1">
          <p>Amount</p>

          {props.isLoading ? (
            <div className="py-0.5">
              <div className="w-full h-7 bg-white/20 rounded animate-pulse" />
            </div>
          ) : (
            <p className="font-bold text-2xl">{props.data.amount}</p>
          )}

          {props.isLoading ? (
            <div className="py-0.5">
              <div className="w-full h-3 bg-white/20 rounded animate-pulse" />
            </div>
          ) : (
            <p className="text-xs">Avg {props.data.amount_average}</p>
          )}
        </div>

        <button
          type="button"
          onClick={() => setIsShowDatetimeFromPicker(true)}
          className="flex items-center justify-between gap-x-1.5 py-2 px-4 bg-white/20 text-white rounded-full border border-white/20 cursor-pointer"
        >
          <span>{props.datetimeFrom?.name}</span>
          <ChevronDownIcon />
        </button>
      </div>

      <DatetimeFromPickerSheet
        isOpen={isShowDatetimeFromPicker}
        close={() => setIsShowDatetimeFromPicker(false)}
        datetimeFromOptions={props.datetimeFromOptions}
        datetimeFrom={props.datetimeFrom}
        setDatetimeFrom={props.setDatetimeFrom}
      />
    </>
  );
}
