import LocationIcon from "@/component/icon/LocationIcon";

interface Props {
  setLocation: (lat: number, lon: number) => void;
}

export default function LocationPicker(props: Readonly<Props>) {
  return (
    <button type="button" className="flex text-lg">
      <LocationIcon />
      <sup className="text-xs">+</sup>
    </button>
  );
}
