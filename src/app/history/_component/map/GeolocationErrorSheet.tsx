import Button from "@/component/button/Button";
import BottomSheet from "@/component/sheet/BottomSheet";

interface Props {
  isOpen: boolean;
  close: () => void;
  error?: GeolocationPositionError;
}

export default function GeolocationErrorSheet(props: Readonly<Props>) {
  return (
    <BottomSheet isOpen={props.isOpen} close={props.close} zIndex={1002}>
      <p className="font-bold text-center text-lg">
        Geolocation Position Error
      </p>

      <div className="mt-2">
        <p>Code: {props.error?.code}</p>
        <p>{props.error?.message}</p>
      </div>

      <div className="mt-2">
        <Button type="button" onClick={props.close}>
          Close
        </Button>
      </div>
    </BottomSheet>
  );
}
