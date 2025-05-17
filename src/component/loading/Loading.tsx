import LoadingIcon from "../icon/LoadingIcon";

export default function Loading() {
  return (
    <div className="h-full flex items-center justify-center gap-x-2">
      <div className="text-2xl">
        <LoadingIcon />
      </div>
      <p className="text-base">Loading...</p>
    </div>
  );
}
