import "leaflet/dist/leaflet.css";
import { MapContainer, TileLayer } from "react-leaflet";
import LocationMarker from "./LocationMarker";
import { ChangeEvent, useEffect, useRef, useState } from "react";
import LocateMeButton from "./LocateMeButton";
import useDebounce from "@/hook/useDebounce";
import SearchIcon from "@/component/icon/SearchIcon";
import SearchList from "./SearchList";
import { Map } from "leaflet";

interface Props {
  onPick: (loc: {
    lat: number;
    lng: number;
    name: string;
    displayName: string;
  }) => void;
}

const defaultPosition: [number, number] = [-6.2, 106.8]; // Jakarta

export default function LeafletMapContainer(props: Readonly<Props>) {
  const mapHeight = window.innerHeight * 0.9 - 176;

  const mapRef = useRef<Map>(null);

  const [position, setPosition] = useState<[number, number]>();

  const [searchLocation, setSearchLocation] = useState("");
  const debounceSearchLocation = useDebounce(searchLocation, 500);
  const [searchResult, setSearchResult] = useState<
    { lat: number; lng: number; name: string; displayName: string }[]
  >([]);
  const [isShowSearchResult, setIsShowSearchResult] = useState(false);
  const [isLoadingSearchResult, setIsLoadingSearchResult] = useState(false);

  useEffect(() => {
    // fallback to default location
    locateMe({ onError: () => setPosition(defaultPosition) });
  }, []);

  useEffect(() => {
    if (!debounceSearchLocation.trim()) {
      setSearchResult([]);
    }

    (async () => {
      setIsLoadingSearchResult(true);

      const res = await fetch(
        `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(
          debounceSearchLocation
        )}&format=json`
      );
      const data: NovatimLocation[] = await res.json();

      const searchResult: {
        lat: number;
        lng: number;
        name: string;
        displayName: string;
      }[] = [];
      data.forEach((l) => {
        if (
          searchResult.findIndex((r) => r.displayName === l.display_name) === -1
        ) {
          const lat = Number(l.lat);
          const lng = Number(l.lon);
          if (!isNaN(lat) && !isNaN(lng)) {
            searchResult.push({
              lat,
              lng,
              name: l.name,
              displayName: l.display_name,
            });
          }
        }
      });
      setSearchResult(searchResult);

      setIsLoadingSearchResult(false);
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

  function onChangeSearch(e: ChangeEvent<HTMLInputElement>) {
    setSearchLocation(e.target.value);
    if (e.target.value) {
      setIsLoadingSearchResult(true);
    }
    setIsShowSearchResult(!!e.target.value);
  }

  async function changePosition(lat: number, lng: number) {
    setPosition([lat, lng]);
    mapRef.current?.setView([lat, lng]);

    // Call reverse geocoding using Nominatim
    const res = await fetch(
      `https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${lat}&lon=${lng}`
    );
    const data: NovatimLocation = await res.json();

    props.onPick({
      lat,
      lng,
      name: data.name,
      displayName: data.display_name,
    });
  }

  function pickSearchPosition(loc: {
    lat: number;
    lng: number;
    name: string;
    displayName: string;
  }) {
    setPosition([loc.lat, loc.lng]);
    mapRef.current?.setView([loc.lat, loc.lng]);
    props.onPick({
      lat: loc.lat,
      lng: loc.lng,
      name: loc.name,
      displayName: loc.displayName,
    });
    setIsShowSearchResult(false);
  }

  return (
    <div className="relative">
      <div className="w-full px-4 py-2 flex items-center gap-x-2 rounded-full border border-white/20">
        <SearchIcon />
        <input
          type="text"
          placeholder="Search location"
          onChange={onChangeSearch}
          onFocus={() =>
            searchLocation ? setIsShowSearchResult(true) : undefined
          }
          className="w-full outline-none"
        />
      </div>

      {isShowSearchResult && (
        <div
          onClick={() => setIsShowSearchResult(false)}
          className="mt-2 absolute w-full"
          style={{ height: mapHeight, zIndex: 1001 }}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="flex flex-col h-full max-h-96 p-4 rounded-b-2xl bg-zinc-800/90 overflow-hidden"
          >
            <div className="min-h-0 h-full overflow-y-auto scrollable-div">
              <SearchList
                loadingList={isLoadingSearchResult}
                list={searchResult}
                onPick={pickSearchPosition}
              />
            </div>
          </div>
        </div>
      )}

      <MapContainer
        ref={mapRef}
        center={position ?? defaultPosition}
        zoom={13}
        scrollWheelZoom={false}
        className="mt-2"
        style={{ height: mapHeight }}
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
