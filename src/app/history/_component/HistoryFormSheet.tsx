import TrashIcon from "@/component/icon/TrashIcon";
import BottomSheet from "@/component/sheet/BottomSheet";
import {
  ChangeEvent,
  FormEvent,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import ConfirmDeleteHistorySheet from "./ConfirmDeleteHistorySheet";
import Button from "@/component/button/Button";
import ChevronDownIcon from "@/component/icon/ChevronDownIcon";
import ImagesIcon from "@/component/icon/ImagesIcon";
import CloseIcon from "@/component/icon/CloseIcon";
import LocationIcon from "@/component/icon/LocationIcon";

interface Props {
  isOpen: boolean;
  close: () => void;
  history?: HistoryI;
}

export default function HistoryFormSheet(props: Readonly<Props>) {
  const [value, setValue] = useState(props.history ?? {});
  const [isShowConfirmDelete, setIsShowConfirmDelete] = useState(false);

  const [formImageList, setFormImageList] = useState<
    | {
        id: string;
        file: File;
      }[]
  >([]);

  useEffect(() => {
    setValue(props.history ?? {});
  }, [props.history]);

  const title = useMemo(
    () => (props.history ? "Edit History" : "Add History"),
    [props.history]
  );

  const formImagePreviews = useMemo(() => {
    if (!formImageList) {
      return [];
    } else {
      const previews: { id: string; url: string; name: string }[] = [];
      formImageList.forEach((image) => {
        const url = URL.createObjectURL(image.file);
        previews.push({ id: image.id, url, name: image.file.name });
      });
      return previews;
    }
  }, [formImageList]);

  function removeFormImage(id: string) {
    setFormImageList((prev) => [...prev.filter((f) => f.id !== id)]);
  }

  function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    props.close();
  }

  return (
    <>
      <BottomSheet isOpen={props.isOpen} close={props.close}>
        <div className="flex items-center justify-between text-lg">
          <div className="w-6.5 h-6.5" />
          <p className="font-bold text-center">{title}</p>
          <div className="w-6.5 h-6.5 flex items-center justify-center">
            {props.history && (
              <button
                type="button"
                onClick={() => setIsShowConfirmDelete(true)}
                className="block p-1"
              >
                <TrashIcon />
              </button>
            )}
          </div>
        </div>

        <form onSubmit={onSubmit} className="mt-2 space-y-4">
          <div className="flex items-center gap-x-2">
            <Button type="button">
              <div className="flex items-center justify-center gap-x-1">
                <span>Spending</span>
                <ChevronDownIcon />
              </div>
            </Button>
            <Button type="button">
              <div className="flex items-center justify-center gap-x-1">
                <span>Medicine</span>
                <ChevronDownIcon />
              </div>
            </Button>
          </div>

          <AmountInput
            value={value.amount}
            setValue={(v) => setValue((prev) => ({ ...prev, amount: v }))}
          />

          <div className="flex items-center gap-x-4">
            <input
              type="text"
              placeholder="Description"
              className="outline-none w-full text-center"
            />
            <div className="flex items-center gap-x-2">
              <ImagesPicker
                setImageList={(v) =>
                  setFormImageList((prev) => [...prev, ...v])
                }
              />
              <LocationPicker
                setLocation={(lat, lon) =>
                  setValue((prev) => ({ ...prev, location: { lat, lon } }))
                }
              />
            </div>
          </div>

          {!!formImagePreviews.length && (
            <div>
              <p className="font-bold">Images</p>
              <div className="mt-1 flex flex-wrap gap-2">
                {formImagePreviews.map((image) => (
                  <div key={image.url} className="relative">
                    <img
                      src={image.url}
                      alt={image.name}
                      className="w-16 h-16 object-cover"
                    />
                    <button
                      type="button"
                      onClick={() => removeFormImage(image.id)}
                      className="absolute right-1 top-1"
                    >
                      <CloseIcon />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          <Button type="submit">Add</Button>
        </form>
      </BottomSheet>

      {props.history && (
        <ConfirmDeleteHistorySheet
          isOpen={isShowConfirmDelete}
          close={() => setIsShowConfirmDelete(false)}
          history={props.history}
        />
      )}
    </>
  );
}

interface AmountInputProps {
  value?: number;
  setValue: (value?: number) => void;
}

function AmountInput(props: Readonly<AmountInputProps>) {
  function onChange(e: ChangeEvent<HTMLInputElement>) {
    const num = Number(e.target.value);
    props.setValue(isNaN(num) || num === 0 ? undefined : num);
  }

  return (
    <input
      type="number"
      value={props.value ? String(props.value) : ""}
      onChange={onChange}
      placeholder="0"
      className="outline-none w-full font-bold text-center text-4xl input-no-spinner"
    />
  );
}

interface ImagesPickerProps {
  setImageList: (f: { id: string; file: File }[]) => void;
}

function ImagesPicker(props: Readonly<ImagesPickerProps>) {
  const inputRef = useRef<HTMLInputElement>(null);

  function onChange(e: ChangeEvent<HTMLInputElement>) {
    const files = e.target.files;
    if (files) {
      const imageList: { id: string; file: File }[] = [];
      Array.from(files).forEach((f) => {
        imageList.push({ id: crypto.randomUUID(), file: f });
      });
      props.setImageList(imageList);
    } else {
      props.setImageList([]);
    }
  }

  return (
    <button
      type="button"
      onClick={() => inputRef.current?.click()}
      className="flex text-lg"
    >
      <input
        ref={inputRef}
        type="file"
        multiple
        accept="image/*"
        onChange={onChange}
        hidden
      />
      <ImagesIcon />
      <sup className="text-xs">+</sup>
    </button>
  );
}

interface LocationPickerProps {
  setLocation: (lat: number, lon: number) => void;
}

function LocationPicker(props: Readonly<LocationPickerProps>) {
  return (
    <button type="button" className="flex text-lg">
      <LocationIcon />
      <sup className="text-xs">+</sup>
    </button>
  );
}
