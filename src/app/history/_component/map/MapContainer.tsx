import "leaflet/dist/leaflet.css";
import { MapContainer, TileLayer } from "react-leaflet";
import LocationMarker from "./LocationMarker";
import { ChangeEvent, useEffect, useMemo, useRef, useState } from "react";
import LocateMeButton from "./LocateMeButton";
import useDebounce from "@/hook/useDebounce";
import SearchIcon from "@/component/icon/SearchIcon";
import SearchList from "./SearchList";
import { Map } from "leaflet";
import GeolocationErrorSheet from "./GeolocationErrorSheet";
import Log from "@/util/log";

interface Props {
  isSheetOpen: boolean;
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
  setIsLoading: (isLoading: boolean) => void;
}

const defaultPosition: [number, number] = [-6.2, 106.8]; // Jakarta

export default function LeafletMapContainer(props: Readonly<Props>) {
  const mapHeight = useMemo(() => {
    return window.innerHeight * 0.9 - 176;
  }, [window.innerHeight]);

  const mapRef = useRef<Map>(null);
  const fetchControllerRef = useRef<AbortController>(null);

  const [position, setPosition] = useState<[number, number]>();
  const [location, setLocation] = useState<{
    name: string;
    displayName: string;
  }>();

  const [searchLocation, setSearchLocation] = useState("");
  const debounceSearchLocation = useDebounce(searchLocation, 500);
  const [searchResult, setSearchResult] = useState<
    { lat: number; lng: number; name: string; displayName: string }[]
  >([]);
  const [isShowSearchResult, setIsShowSearchResult] = useState(false);
  const [isLoadingSearchResult, setIsLoadingSearchResult] = useState(false);

  const [isLoadingLocateMe, setIsLoadingLocateMe] = useState(false);

  const [geolocationError, setGeolocationError] =
    useState<GeolocationPositionError>();
  const [isShowGeolocationError, setIsShowGeolocationError] = useState(false);

  useEffect(() => {
    if (!mapRef.current) return;
    setSearchLocation("");
    setSearchResult([]);
    setIsShowSearchResult(false);

    if (props.location) {
      setPosition([props.location.lat, props.location.lng]);
      mapRef.current.setView([props.location.lat, props.location.lng]);
      setLocation({
        name: props.location.name,
        displayName: props.location.displayName,
      });
    } else {
      setPosition(undefined);
      setLocation(undefined);
    }
  }, [props.isSheetOpen, props.location, mapRef.current]);

  useEffect(() => {
    if (!debounceSearchLocation.trim()) {
      setSearchResult([]);
      return;
    }

    const abortController = new AbortController();

    (async () => {
      setIsLoadingSearchResult(true);

      const res = await fetch(
        `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(
          debounceSearchLocation
        )}&format=json`,
        { signal: abortController.signal }
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

      return () => {
        abortController.abort();
      };
    })();
  }, [debounceSearchLocation]);

  useEffect(() => {
    if (geolocationError) {
      setIsShowGeolocationError(true);
    }
  }, [geolocationError]);

  function locateMe() {
    setIsLoadingLocateMe(true);

    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        const { latitude, longitude } = pos.coords;
        await changePosition(latitude, longitude);
        setIsLoadingLocateMe(false);
      },
      (err) => {
        setGeolocationError(err);
        setIsLoadingLocateMe(false);
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
    props.setIsLoading(true);

    setLocation(undefined);
    setPosition([lat, lng]);
    mapRef.current?.setView([lat, lng]);

    // Call reverse geocoding using Nominatim
    fetchControllerRef.current?.abort();
    fetchControllerRef.current = new AbortController();
    try {
      const res = await fetch(
        `https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${lat}&lon=${lng}`,
        { signal: fetchControllerRef.current?.signal }
      );
      const data: NovatimLocation = await res.json();

      setLocation({ name: data.name, displayName: data.display_name });
      props.onPick({
        lat,
        lng,
        name: data.name,
        displayName: data.display_name,
      });
    } catch (error: unknown) {
      if (!(error instanceof Error) || error.name !== "AbortError") {
        Log.error("Error nominatim.openstreetmap.org", error);
      }
    }

    props.setIsLoading(false);
  }

  function pickSearchPosition(loc: {
    lat: number;
    lng: number;
    name: string;
    displayName: string;
  }) {
    setPosition([loc.lat, loc.lng]);
    mapRef.current?.setView([loc.lat, loc.lng]);
    setLocation({ name: loc.name, displayName: loc.displayName });
    props.onPick({
      lat: loc.lat,
      lng: loc.lng,
      name: loc.name,
      displayName: loc.displayName,
    });
    setIsShowSearchResult(false);
  }

  return (
    <>
      <div className="relative">
        <div className="w-full px-4 py-2 flex items-center gap-x-2 rounded-full border border-white/20">
          <SearchIcon />
          <input
            type="text"
            placeholder="Search location"
            value={searchLocation}
            onChange={onChangeSearch}
            onFocus={() =>
              searchLocation ? setIsShowSearchResult(true) : undefined
            }
            className="w-full outline-none placeholder:text-neutral-500"
          />
        </div>

        {isShowSearchResult && (
          <div
            onClick={() => setIsShowSearchResult(false)}
            className="mt-1.75 absolute z-1001 w-full"
            style={{ height: mapHeight }}
          >
            <div
              onClick={(e) => e.stopPropagation()}
              className="flex flex-col h-full max-h-96 p-4 rounded-b-2xl bg-zinc-800/90 overflow-hidden"
            >
              <div className="min-h-0 h-full overflow-y-auto scrollable">
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
          <LocationMarker
            position={position}
            location={location}
            onPick={changePosition}
          />
        </MapContainer>

        <LocateMeButton isLoading={isLoadingLocateMe} onClick={locateMe} />
      </div>

      <GeolocationErrorSheet
        isOpen={isShowGeolocationError}
        close={() => setIsShowGeolocationError(false)}
        error={geolocationError}
      />
    </>
  );
}
