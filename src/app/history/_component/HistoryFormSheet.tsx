import TrashIcon from "@/component/icon/TrashIcon";
import BottomSheet from "@/component/sheet/BottomSheet";
import { FormEvent, useEffect, useMemo, useState } from "react";
import ConfirmDeleteHistorySheet from "./ConfirmDeleteHistorySheet";
import Button from "@/component/button/Button";
import ChevronDownIcon from "@/component/icon/ChevronDownIcon";
import CloseIcon from "@/component/icon/CloseIcon";
import ImagePreviewSheet from "./ImagePreviewSheet";
import LocationPicker from "./form/LocationPicker";
import ImagesPicker from "./form/ImagesPicker";
import AmountInput from "./form/AmountInput";
import MapSheet from "./map/MapSheet";

interface Props {
  isOpen: boolean;
  close: () => void;
  history?: HistoryI;
}

export default function HistoryFormSheet(props: Readonly<Props>) {
  const title = useMemo(
    () => (props.history ? "Edit History" : "Add History"),
    [props.history]
  );

  const [value, setValue] = useState(props.history ?? {});

  const [isShowConfirmDelete, setIsShowConfirmDelete] = useState(false);

  const [formImageList, setFormImageList] = useState<
    | {
        id: string;
        file: File;
      }[]
  >([]);
  const [formImagePreviews, setFormImagePreviews] = useState<
    { id: string; url: string; name: string }[]
  >([]);
  const [selectedImagePreview, setSelectedImagePreview] = useState<{
    id: string;
    url: string;
    name: string;
  }>();
  const [isShowImagePreview, setIsShowImagePreview] = useState(false);

  const [isShowMap, setIsShowMap] = useState(false);

  useEffect(() => {
    setValue(props.history ?? {});
  }, [props.history]);

  useEffect(() => {
    setFormImagePreviews((prev) => {
      const previews: typeof prev = [];

      prev.forEach((image) => {
        const sourceIdx = formImageList.findIndex((s) => s.id === image.id);
        if (sourceIdx >= 0) {
          previews.push(image);
        }
      });

      formImageList.forEach((image) => {
        const prevIdx = previews.findIndex((p) => p.id === image.id);
        if (prevIdx === -1) {
          const url = URL.createObjectURL(image.file);
          previews.push({ id: image.id, url, name: image.file.name });
        }
      });

      return previews;
    });
  }, [formImageList]);

  function removeFormImage(
    e: React.MouseEvent<HTMLButtonElement, MouseEvent>,
    id: string
  ) {
    e.stopPropagation();
    setFormImageList((prev) => [...prev.filter((f) => f.id !== id)]);
  }

  function selectImagePreview(image: {
    id: string;
    url: string;
    name: string;
  }) {
    setSelectedImagePreview(image);
    setIsShowImagePreview(true);
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
              placeholder="Title"
              className="outline-none w-full text-center"
            />
            <div className="flex items-center gap-x-2">
              <ImagesPicker
                setImageList={(v) =>
                  setFormImageList((prev) => [...prev, ...v])
                }
              />
              <LocationPicker onClick={() => setIsShowMap(true)} />
            </div>
          </div>

          {!!formImagePreviews.length && (
            <div>
              <p className="font-bold">Images</p>
              <div className="mt-1 flex flex-wrap gap-2">
                {formImagePreviews.map((image) => (
                  <div
                    key={image.url}
                    onClick={() => selectImagePreview(image)}
                    className="relative w-16 h-16 "
                  >
                    <img
                      src={image.url}
                      alt={image.name}
                      className="w-full h-full object-cover"
                    />
                    <button
                      type="button"
                      onClick={(e) => removeFormImage(e, image.id)}
                      className="absolute right-0.5 top-0.5 p-0.5 bg-black/60 rounded-full text-xs"
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

      <ImagePreviewSheet
        isOpen={isShowImagePreview}
        close={() => setIsShowImagePreview(false)}
        image={selectedImagePreview}
      />

      <MapSheet
        isOpen={isShowMap}
        close={() => setIsShowMap(false)}
        onPick={(lat, lng, name) =>
          setValue((prev) => ({
            ...prev,
            location: { lat: lat, lng: lng },
            location_name: name,
          }))
        }
      />
    </>
  );
}
