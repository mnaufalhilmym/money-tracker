import CloseIcon from "@/component/icon/CloseIcon";
import BottomSheet from "@/component/sheet/BottomSheet";

interface Props {
  image?: { url: string; name: string };
  close: () => void;
}

export default function ImagePreviewSheet(props: Readonly<Props>) {
  return (
    <BottomSheet isOpen={!!props.image} close={props.close}>
      <div className="flex flex-col h-full">
        <div className="flex items-center justify-between text-lg">
          <div className="w-6.5 h-6.5" />
          <p className="font-bold text-center">{props.image?.name}</p>
          <div className="w-6.5 h-6.5 flex items-center justify-center">
            <button type="button" onClick={props.close} className="block p-1">
              <CloseIcon />
            </button>
          </div>
        </div>
        <img src={props.image?.url} alt={props.image?.name} className="flex-1 min-h-0 mt-2 overflow-y-auto" />
      </div>
    </BottomSheet>
  );
}
