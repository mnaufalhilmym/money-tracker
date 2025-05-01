import { MouseEventHandler, ReactNode } from "react";

interface Props {
  type: "submit" | "reset" | "button";
  onClick?: MouseEventHandler<HTMLButtonElement>;
  children: ReactNode;
}

export default function Button(props: Readonly<Props>) {
  return (
    <button
      type={props.type}
      onClick={props.onClick}
      className="w-full py-2 px-4 font-bold text-center rounded-full bg-white/20 border border-white/20"
    >
      {props.children}
    </button>
  );
}
