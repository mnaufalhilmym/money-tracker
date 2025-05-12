import "leaflet/dist/leaflet.css";
import { MapContainer, TileLayer } from "react-leaflet";
import LocationMarker from "./LocationMarker";
import { useEffect, useState } from "react";
import LocateMeButton from "./LocateMeButton";
import useDebounce from "@/hook/useDebounce";
import SearchIcon from "@/component/icon/SearchIcon";

interface Props {
  onPick: (lat: number, lng: number, name: string) => void;
}

const defaultPosition: [number, number] = [-6.2, 106.8]; // Jakarta

export default function LeafletMapContainer(props: Readonly<Props>) {
  const [position, setPosition] = useState<[number, number]>();
  const [searchLocation, setSearchLocation] = useState("");
  const debounceSearchLocation = useDebounce(searchLocation, 500);
  const [searchResult, setSearchResult] = useState<
    { lat: number; lng: number; name: string }[]
  >([]);

  useEffect(() => {
    // fallback to default location
    locateMe({ onError: () => setPosition(defaultPosition) });
  }, []);

  useEffect(() => {
    if (!debounceSearchLocation.trim()) {
      setSearchResult([]);
    }

    (async () => {
      const res = await fetch(
        `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(
          debounceSearchLocation
        )}&format=json`
      );
      const data: NovatimSearch[] = await res.json();

      const searchResult: { lat: number; lng: number; name: string }[] = [];
      data.forEach((l) => {
        if (searchResult.findIndex((r) => r.name === l.display_name) === -1) {
          const lat = Number(l.lat);
          const lng = Number(l.lon);
          if (!isNaN(lat) && !isNaN(lng)) {
            searchResult.push({ lat, lng, name: l.display_name });
          }
        }
      });
      setSearchResult(searchResult);
    })();
  }, [debounceSearchLocation]);

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
      <div className="w-full px-4 py-2 flex items-center gap-x-2 rounded-full border border-white/20">
        <SearchIcon />
        <input
          type="text"
          placeholder="Search location"
          onChange={(e) => setSearchLocation(e.target.value)}
          className="w-full outline-none"
        />
      </div>
      <MapContainer
        center={defaultPosition}
        zoom={13}
        scrollWheelZoom={false}
        className="mt-2"
        style={{ height: window.innerHeight * 0.9 - 134 }}
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
