import { ReactNode } from "react";

interface SelectButtonProps {
  onClick: () => void;
  isActive?: boolean;
  children: ReactNode;
}

export default function PickerSelectButton(props: Readonly<SelectButtonProps>) {
  return (
    <button
      type="button"
      onClick={props.onClick}
      className={`block w-full p-1 text-center ${
        props.isActive ? "font-bold" : "font-normal"
      } cursor-pointer`}
    >
      {props.children}
    </button>
  );
}
