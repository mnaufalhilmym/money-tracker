import "leaflet/dist/leaflet.css";
import { MapContainer, TileLayer } from "react-leaflet";
import LocationMarker from "./LocationMarker";
import { useEffect, useState } from "react";
import LocateMeButton from "./LocateMeButton";

interface Props {
  onPick: (lat: number, lng: number, name: string) => void;
}

const defaultPosition: [number, number] = [-6.2, 106.8]; // Jakarta

export default function LeafletMapContainer(props: Readonly<Props>) {
  const [position, setPosition] = useState<[number, number]>();

  useEffect(() => {
    // fallback to default location
    locateMe({ onError: () => setPosition(defaultPosition) });
  }, []);

  function locateMe(props?: {
    onError: (err: GeolocationPositionError) => void;
  }) {
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const { latitude, longitude } = pos.coords;
        changePosition(latitude, longitude);
      },
      (err) => {
        console.error("Geolocation error:", err);
        props?.onError(err);
      }
    );
  }

  async function changePosition(lat: number, lng: number) {
    setPosition([lat, lng]);

    // Call reverse geocoding using Nominatim
    const res = await fetch(
      `https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${lat}&lon=${lng}`
    );
    const data = await res.json();
    const name = data.display_name;

    props.onPick(lat, lng, name);
  }

  return (
    <div className="relative">
      <MapContainer
        center={defaultPosition}
        zoom={13}
        scrollWheelZoom={false}
        style={{ height: "400px" }}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <LocationMarker position={position} onPick={changePosition} />
      </MapContainer>
      <LocateMeButton onClick={locateMe} />
    </div>
  );
}
