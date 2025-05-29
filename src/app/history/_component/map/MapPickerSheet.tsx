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

export default function MapPickerSheet(props: Readonly<Props>) {
  const [location, setLocation] = useState<{
    lat: number;
    lng: number;
    name: string;
    displayName: string;
  }>();

  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    setLocation(props.location);
  }, [props.isOpen, props.location]);

  function pickLocation() {
    if (location) {
      props.onPick(location);
      props.close();
    }
  }

  return (
    <BottomSheet isOpen={props.isOpen} close={props.close}>
      <div className="flex items-center justify-between text-lg">
        <div className="w-6.5 h-6.5" />
        <p className="font-bold text-center">Pick a Location</p>
        <div className="w-6.5 h-6.5 flex items-center justify-center">
          <button
            type="button"
            onClick={props.close}
            className="block p-1 cursor-pointer"
          >
            <CloseIcon />
          </button>
        </div>
      </div>

      <div className="mt-2">
        <MapContainer
          isSheetOpen={props.isOpen}
          location={location}
          onPick={setLocation}
          setIsLoading={setIsLoading}
        />
      </div>

      <div className="mt-2">
        <Button
          type="button"
          disable={!location}
          loading={isLoading}
          onClick={pickLocation}
        >
          Pick Location
        </Button>
      </div>
    </BottomSheet>
  );
}
