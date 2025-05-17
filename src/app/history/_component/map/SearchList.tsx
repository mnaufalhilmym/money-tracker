import LocationIcon from "@/component/icon/LocationIcon";
import Loading from "@/component/loading/Loading";
import NotFound from "@/component/notFound/NotFound";

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
    return <Loading />;
  }

  if (!props.loadingList && !props.list.length) {
    return <NotFound />;
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
