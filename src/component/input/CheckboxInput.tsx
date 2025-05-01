import { ReactNode } from "react";
import CheckboxIcon from "../icon/CheckboxIcon";
import SquareIcon from "../icon/SquareIcon";

interface Props {
  checked: boolean;
  onClick: () => void;
  children: ReactNode;
}

export default function CheckboxInput(props: Readonly<Props>) {
  return (
    <button
      type="button"
      onClick={props.onClick}
      className="flex items-center gap-x-1.5"
    >
      <div className="text-xl">
        {props.checked ? <CheckboxIcon /> : <SquareIcon />}
      </div>
      {props.children}
    </button>
  );
}
