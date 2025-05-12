import LocationIcon from "@/component/icon/LocationIcon";
import { MouseEventHandler } from "react";

interface Props {
  onClick: MouseEventHandler<HTMLButtonElement>;
}

export default function LocationPicker(props: Readonly<Props>) {
  return (
    <button type="button" onClick={props.onClick} className="flex text-lg">
      <LocationIcon />
      <sup className="text-xs">+</sup>
    </button>
  );
}
