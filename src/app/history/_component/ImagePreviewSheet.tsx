import CloseIcon from "@/component/icon/CloseIcon";
import BottomSheet from "@/component/sheet/BottomSheet";

interface Props {
  isOpen: boolean;
  close: () => void;
  image?: { url: string; name: string };
}

export default function ImagePreviewSheet(props: Readonly<Props>) {
  return (
    <BottomSheet isOpen={props.isOpen} close={props.close}>
      <div className="min-h-0 flex-1 flex flex-col">
        <div className="flex items-center justify-between text-lg">
          <div className="w-6.5 h-6.5" />
          <p className="font-bold text-center">{props.image?.name}</p>
          <div className="w-6.5 h-6.5 flex items-center justify-center">
            <button type="button" onClick={props.close} className="block p-1">
              <CloseIcon />
            </button>
          </div>
        </div>
        
        <img
          src={props.image?.url}
          alt={props.image?.name}
          className="min-h-0 flex-1 mt-2 object-contain"
        />
      </div>
    </BottomSheet>
  );
}
