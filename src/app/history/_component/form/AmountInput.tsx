import { ChangeEvent } from "react";

interface Props {
  value?: number;
  setValue: (value?: number) => void;
}

export default function AmountInput(props: Readonly<Props>) {
  function onChange(e: ChangeEvent<HTMLInputElement>) {
    const num = Number(e.target.value);
    props.setValue(isNaN(num) || num === 0 ? undefined : num);
  }

  return (
    <input
      type="number"
      value={props.value ? String(props.value) : ""}
      onChange={onChange}
      placeholder="0"
      className="outline-none w-full font-bold text-center text-4xl input-no-spinner"
    />
  );
}
