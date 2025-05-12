import LoadingIcon from "@/component/icon/LoadingIcon";
import LocationIcon from "@/component/icon/LocationIcon";

interface Props {
  loadingList: boolean;
  list: { lat: number; lng: number; name: string; displayName: string }[];
  onPick: (loc: {
    lat: number;
    lng: number;
    name: string;
    displayName: string;
  }) => void;
}

export default function SearchList(props: Readonly<Props>) {
  if (props.loadingList) {
    return (
      <div className="h-full flex items-center justify-center gap-x-2">
        <div className="text-2xl">
          <LoadingIcon />
        </div>
        <p className="text-base">Loading...</p>
      </div>
    );
  }

  if (!props.loadingList && !props.list.length) {
    return (
      <div className="h-full flex flex-col items-center justify-center gap-y-0.5">
        <p className="text-2xl">¯\\_(ツ)_/¯</p>
        <p className="text-base">Not found</p>
      </div>
    );
  }

  return (
    <div className="space-y-2">
      {props.list.map((l) => (
        <button
          key={l.lat + l.lng}
          onClick={() => props.onPick(l)}
          className="flex items-center gap-x-2 text-left"
        >
          <div className="text-xl">
            <LocationIcon />
          </div>
          <div className="flex-1">
            <p className="font-bold text-base">{l.name}</p>
            <p>{l.displayName}</p>
          </div>
        </button>
      ))}
    </div>
  );
}
