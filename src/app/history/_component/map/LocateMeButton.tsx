import LoadingIcon from "@/component/icon/LoadingIcon";
import LocateFillIcon from "@/component/icon/LocateFillIcon";

interface Props {
  isLoading: boolean;
  onClick: () => void;
}

export default function LocateMeButton(props: Readonly<Props>) {
  function onClick(e: React.MouseEvent<HTMLButtonElement, MouseEvent>) {
    e.stopPropagation();
    props.onClick();
  }

  return (
    <button
      type="button"
      onClick={!props.isLoading ? onClick : undefined}
      className="absolute z-500 bottom-6 right-2 p-2 rounded-full bg-white text-black text-xl border-2 border-black/30 cursor-pointer"
    >
      {props.isLoading ? <LoadingIcon /> : <LocateFillIcon />}
    </button>
  );
}
