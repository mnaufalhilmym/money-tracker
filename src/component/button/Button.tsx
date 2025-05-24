"use client";

import { MouseEventHandler, ReactNode } from "react";
import LoadingIcon from "../icon/LoadingIcon";

interface Props {
  type: "submit" | "reset" | "button";
  disable?: boolean;
  loading?: boolean;
  onClick?: MouseEventHandler<HTMLButtonElement>;
  children: ReactNode;
}

export default function Button(props: Readonly<Props>) {
  function onClick(e: React.MouseEvent<HTMLButtonElement, MouseEvent>) {
    if (props.disable || props.loading) {
      e.preventDefault();
      e.stopPropagation();
      return;
    }

    props.onClick?.(e);
  }

  return (
    <button
      type={props.type}
      onClick={onClick}
      className={`w-full py-2 px-4 font-bold text-center rounded-full bg-white/20 border border-white/20 ${
        props.disable || props.loading ? "opacity-50" : "opacity-100"
      } cursor-pointer`}
    >
      {props.loading ? (
        <div className="flex items-center justify-center gap-x-2">
          <div className="text-xl">
            <LoadingIcon />
          </div>
          <p>Loading...</p>
        </div>
      ) : (
        props.children
      )}
    </button>
  );
}
