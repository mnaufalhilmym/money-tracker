import LocationFillIcon from "@/component/icon/LocationFillIcon";
import { divIcon } from "leaflet";
import { useMemo } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { Marker, Tooltip, useMapEvents } from "react-leaflet";

interface Props {
  position?: [number, number];
  location?: {
    name: string;
    displayName: string;
  };
  onPick: (lat: number, lng: number) => void;
}

export default function LocationMarker(props: Readonly<Props>) {
  const tooltipWidth = useMemo(() => {
    return window.innerWidth - 64;
  }, [window.innerWidth]);

  useMapEvents({
    click: (e) => {
      const { lat, lng } = e.latlng;
      props.onPick(lat, lng);
    },
  });

  return props.position ? (
    <Marker
      position={props.position}
      icon={divIcon({
        className: "text-4xl text-black",
        html: renderToStaticMarkup(<LocationFillIcon />),
        iconAnchor: [15, 30],
      })}
    >
      {props.location && (
        <Tooltip permanent direction="top" offset={[0, -30]}>
          <div style={{ maxWidth: `min(${tooltipWidth}px, 24rem)` }}>
            <p className="font-bold">{props.location.name}</p>
            <p className="truncate">{props.location.displayName}</p>
          </div>
        </Tooltip>
      )}
    </Marker>
  ) : null;
}
