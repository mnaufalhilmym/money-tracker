import { ReactNode } from "react";
import RadioButtonOnIcon from "../icon/RadioButtonOnIcon";
import RadioButtonOffIcon from "../icon/RadioButtonOffIcon";

interface Props {
  checked: boolean;
  onClick: () => void;
  children: ReactNode;
}

export default function RadioInput(props: Readonly<Props>) {
  return (
    <button
      type="button"
      onClick={props.onClick}
      className="flex items-center gap-x-1.5"
    >
      <div className="text-xl">
        {props.checked ? <RadioButtonOnIcon /> : <RadioButtonOffIcon />}
      </div>
      {props.children}
    </button>
  );
}
