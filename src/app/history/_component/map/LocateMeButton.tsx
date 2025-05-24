import LocateFillIcon from "@/component/icon/LocateFillIcon";

interface Props {
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
      onClick={onClick}
      className="absolute bottom-6 right-2 p-2 rounded-full bg-white text-black text-xl border-2 border-black/30 cursor-pointer"
      style={{ zIndex: 500 }}
    >
      <LocateFillIcon />
    </button>
  );
}
