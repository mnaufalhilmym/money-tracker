import Button from "@/component/button/Button";
import CloseIcon from "@/component/icon/CloseIcon";
import BottomSheet from "@/component/sheet/BottomSheet";
import dynamic from "next/dynamic";
import { useEffect, useState } from "react";

interface Props {
  isOpen: boolean;
  close: () => void;
  location?: {
    lat: number;
    lng: number;
    name: string;
    displayName: string;
  };
  onPick: (loc: {
    lat: number;
    lng: number;
    name: string;
    displayName: string;
  }) => void;
}

const MapContainer = dynamic(() => import("./MapContainer"), { ssr: false });

export default function MapSheet(props: Readonly<Props>) {
  const [location, setLocation] = useState<{
    lat: number;
    lng: number;
    name: string;
    displayName: string;
  }>();

  useEffect(() => {
    if (props.isOpen && !props.location) {
      setLocation(undefined);
    }
  }, [props.isOpen]);

  function pickLocation() {
    if (location) props.onPick(location);
  }

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

      <div className="mt-2">
        <MapContainer
          isSheetOpen={props.isOpen}
          location={location}
          onPick={setLocation}
        />
      </div>

      <div className="mt-2">
        <Button type="button" onClick={pickLocation}>
          Pick Location
        </Button>
      </div>
    </BottomSheet>
  );
}
