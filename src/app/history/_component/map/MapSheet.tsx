import CloseIcon from "@/component/icon/CloseIcon";
import BottomSheet from "@/component/sheet/BottomSheet";
import dynamic from "next/dynamic";

interface Props {
  isOpen: boolean;
  close: () => void;
  onPick: (lat: number, lng: number, name: string) => void;
}

const MapContainer = dynamic(() => import("./MapContainer"), { ssr: false });

export default function MapSheet(props: Readonly<Props>) {
  return (
    <BottomSheet isOpen={props.isOpen} close={props.close}>
      <div className="flex items-center justify-between text-lg">
        <div className="w-6.5 h-6.5" />
        <p className="font-bold text-center">Select Location</p>
        <div className="w-6.5 h-6.5 flex items-center justify-center">
          <button type="button" onClick={props.close} className="block p-1">
            <CloseIcon />
          </button>
        </div>
      </div>

      <div>
        <MapContainer onPick={props.onPick} />
      </div>
    </BottomSheet>
  );
}
