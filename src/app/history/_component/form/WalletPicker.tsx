import WalletIcon from "@/component/icon/WalletIcon";
import { MouseEventHandler } from "react";

interface Props {
  onClick: MouseEventHandler<HTMLButtonElement>;
}

export default function WalletPicker(props: Readonly<Props>) {
  return (
    <button
      type="button"
      onClick={props.onClick}
      className="flex text-lg cursor-pointer"
    >
      <WalletIcon />
      <sup className="text-xs">+</sup>
    </button>
  );
}
