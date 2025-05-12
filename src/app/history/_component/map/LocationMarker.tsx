import LocationFillIcon from "@/component/icon/LocationFillIcon";
import { divIcon } from "leaflet";
import { renderToStaticMarkup } from "react-dom/server";
import { Marker, useMapEvents } from "react-leaflet";

interface Props {
  position?: [number, number];
  onPick: (lat: number, lng: number) => void;
}

export default function LocationMarker(props: Readonly<Props>) {
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
    />
  ) : null;
}
