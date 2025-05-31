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
import MapPickerSheet from "./map/MapPickerSheet";
import LocationIcon from "@/component/icon/LocationIcon";
import useWindowInnerSize from "@/hook/useWindowInnerSize";
import compressImage from "@/util/compressImage";
import HistoryTypePickerSheet from "./HistoryTypePickerSheet";
import HistoryCategoryPickerSheet from "./HistoryCategoryPickerSheet";
import WalletPicker from "./form/WalletPicker";
import HistoryWalletPickerSheet from "./HistoryWalletPickerSheet";
import { clientInternalApiCall } from "@/util/fetch/fromClient";
import toTitleCase from "@/util/titleCase";
import toFormData from "@/util/formData";
import DescriptionInput from "./form/DescriptionInput";
import DateTimeInput from "./form/DateTimeInput";

interface Props {
  isOpen: boolean;
  close: () => void;
  history?: HistoryI;
  types: TypeI[];
  categories: CategoryI[];
  wallets: WalletI[];
  refreshHistory: () => void;
}

export default function HistoryFormSheet(props: Readonly<Props>) {
  const { width: maxWidth, height: maxHeight } = useWindowInnerSize();
  const attributeMaxHeight = maxHeight * 0.9 - 323;

  const [value, setValue] = useState<HistoryI>(props.history ?? {});
  const [isLoadingSubmit, setIsLoadingSubmit] = useState(false);

  const [formImageList, setFormImageList] = useState<
    | {
        id: string;
        file: File;
      }[]
  >([]);
  const [formImagePreviews, setFormImagePreviews] = useState<
    { id: string; url: string; name: string; uploaded?: true }[]
  >([]);
  const [selectedImagePreview, setSelectedImagePreview] = useState<{
    id: string;
    url: string;
    name: string;
  }>();

  const [isShowConfirmDelete, setIsShowConfirmDelete] = useState(false);
  const [isShowTypePicker, setIsShowTypePicker] = useState(false);
  const [isShowCategoryPicker, setIsShowCategoryPicker] = useState(false);
  const [isShowWalletPicker, setIsShowWalletPicker] = useState(false);
  const [isShowImagePreview, setIsShowImagePreview] = useState(false);
  const [isShowMapPicker, setIsShowMapPicker] = useState(false);

  const title = useMemo(
    () => (props.history ? "Edit History" : "Add History"),
    [props.history]
  );

  useEffect(() => {
    if (props.isOpen && props.types.length) {
      const t = props.types[0];
      let c: CategoryI = {};
      if (t.id) {
        c = props.categories.find((c) => c.type_id === t.id) ?? {};
      }
      setValue(
        props.history ?? {
          type_id: props.types[0].id,
          type_name: props.types[0].name,
          category_id: c.id,
          category_name: c.name,
        }
      );
      setFormImageList([]);
    }
  }, [props.isOpen, props.history, props.types, props.categories]);

  useEffect(() => {
    let isCancelled = false;

    const updatePreviews = async () => {
      const previews: {
        id: string;
        url: string;
        name: string;
        uploaded?: true;
      }[] = [];

      if (value.images) {
        for (const image of value.images) {
          previews.push({
            id: image.id,
            url: new URL(
              `/api/image/${image.id}`,
              process.env.NEXT_PUBLIC_SITE_URL
            ).href,
            name: image.file_name,
            uploaded: true,
          });
        }
      }

      for (const image of formImageList) {
        if (isCancelled) break;
        const existing = formImagePreviews.find((p) => p.id === image.id);
        if (existing) {
          previews.push(existing);
        } else {
          const compressed = await compressImage(image.file, { maxWidth });
          const url = URL.createObjectURL(compressed);
          previews.push({ id: image.id, url, name: image.file.name });
        }
      }

      if (!isCancelled) {
        setFormImagePreviews(previews);
      }
    };

    updatePreviews();

    return () => {
      isCancelled = true;
    };
  }, [formImageList, value.images]);

  function close() {
    if (isLoadingSubmit) return;
    props.close();
  }

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();

    setIsLoadingSubmit(true);

    const formData = toFormData(
      value,
      formImageList.map((f) => ({ key: "images", file: f.file }))
    );

    try {
      if (!props.history) {
        await clientInternalApiCall("/api/history", undefined, {
          method: "POST",
          body: formData,
        });
      } else {
        await clientInternalApiCall(
          "/api/history/" + props.history.id,
          undefined,
          {
            method: "PUT",
            body: formData,
          }
        );
      }
    } catch (error) {
      console.error("Error onSubmit HistoryForm", error);
    }

    props.close();
    props.refreshHistory();

    setIsLoadingSubmit(false);
  }

  function afterDelete() {
    props.close();
    props.refreshHistory();
  }

  function removeImage(
    e: React.MouseEvent<HTMLButtonElement, MouseEvent>,
    id: string,
    uploaded?: true
  ) {
    e.stopPropagation();
    if (uploaded) {
      setValue((prev) => ({
        ...prev,
        images: prev.images?.filter((img) => img.id !== id),
      }));
    } else {
      setFormImageList((prev) => [...prev.filter((f) => f.id !== id)]);
    }
  }

  function selectImagePreview(image: {
    id: string;
    url: string;
    name: string;
  }) {
    setSelectedImagePreview(image);
    setIsShowImagePreview(true);
  }

  return (
    <>
      <BottomSheet isOpen={props.isOpen} close={close}>
        <div className="flex items-center justify-between text-lg">
          <div className="w-6.5 h-6.5" />
          <p className="font-bold text-center">{title}</p>
          <div className="w-6.5 h-6.5 flex items-center justify-center">
            {props.history && (
              <button
                type="button"
                onClick={() => setIsShowConfirmDelete(true)}
                className="block p-1 cursor-pointer"
              >
                <TrashIcon />
              </button>
            )}
          </div>
        </div>

        <form onSubmit={onSubmit} className="mt-2 space-y-4">
          <div className="flex items-stretch gap-x-2">
            <Button type="button" onClick={() => setIsShowTypePicker(true)}>
              <div className="flex items-center justify-center gap-x-1">
                <span>{value.type_name && toTitleCase(value.type_name)}</span>
                <ChevronDownIcon />
              </div>
            </Button>
            <Button type="button" onClick={() => setIsShowCategoryPicker(true)}>
              <div className="flex items-center justify-center gap-x-1">
                <span>
                  {value.category_name && toTitleCase(value.category_name)}
                </span>
                <ChevronDownIcon />
              </div>
            </Button>
          </div>

          <DateTimeInput
            value={value.datetime}
            setValue={(v) => setValue((prev) => ({ ...prev, datetime: v }))}
          />

          <AmountInput
            value={value.amount}
            setValue={(v) => setValue((prev) => ({ ...prev, amount: v }))}
          />

          <div className="flex items-center gap-x-4">
            <DescriptionInput
              value={value.description}
              setValue={(v) =>
                setValue((prev) => ({ ...prev, description: v }))
              }
            />

            <div className="flex items-center gap-x-2">
              <WalletPicker onClick={() => setIsShowWalletPicker(true)} />
              <ImagesPicker
                setImageList={(v) =>
                  setFormImageList((prev) => [...prev, ...v])
                }
              />
              <LocationPicker onClick={() => setIsShowMapPicker(true)} />
            </div>
          </div>

          {(!!value.wallet_id ||
            !!formImagePreviews.length ||
            !!value.location) && (
            <div
              className="space-y-4 overflow-y-auto scrollable"
              style={{ maxHeight: attributeMaxHeight }}
            >
              {!!value.wallet_id && (
                <div>
                  <p className="font-bold">Wallet</p>
                  <div className="mt-1 flex gap-x-1.5 items-center">
                    <p className="flex-1">{value.wallet_name}</p>
                    <button
                      type="button"
                      onClick={() =>
                        setValue((prev) => ({
                          ...prev,
                          wallet_id: undefined,
                          wallet_name: undefined,
                        }))
                      }
                      className="text-base cursor-pointer"
                    >
                      <CloseIcon />
                    </button>
                  </div>
                </div>
              )}

              {!!formImagePreviews.length && (
                <div>
                  <p className="font-bold">Images</p>
                  <div className="mt-1 flex flex-wrap gap-2">
                    {formImagePreviews.map((image) => (
                      <div
                        key={image.url}
                        role="button"
                        tabIndex={0}
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
                          onClick={(e) =>
                            removeImage(e, image.id, image.uploaded)
                          }
                          className="absolute right-0.5 top-0.5 p-0.5 bg-black/60 rounded-full text-xs cursor-pointer"
                        >
                          <CloseIcon />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {!!value.location && (
                <div>
                  <p className="font-bold">Location</p>
                  <div className="mt-1 flex gap-x-1.5 items-center">
                    <div className="text-lg">
                      <LocationIcon />
                    </div>
                    <div className="flex-1">
                      <p className="font-bold">{value.location_name}</p>
                      <p className="text-xs">{value.location_display_name}</p>
                    </div>
                    <button
                      type="button"
                      onClick={() =>
                        setValue((prev) => ({
                          ...prev,
                          location: undefined,
                          location_name: undefined,
                          location_display_name: undefined,
                        }))
                      }
                      className="text-base cursor-pointer"
                    >
                      <CloseIcon />
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}

          <Button
            type="submit"
            disable={
              !value.type_id ||
              !value.type_name ||
              !value.category_id ||
              !value.category_name ||
              !value.datetime ||
              !value.amount ||
              !value.description ||
              !value.wallet_id ||
              !value.wallet_name
            }
            loading={isLoadingSubmit}
          >
            {props.history ? "Edit" : "Add"}
          </Button>
        </form>
      </BottomSheet>

      {props.history && (
        <ConfirmDeleteHistorySheet
          isOpen={isShowConfirmDelete}
          close={() => setIsShowConfirmDelete(false)}
          afterDelete={afterDelete}
          history={props.history}
        />
      )}

      <HistoryTypePickerSheet
        isOpen={isShowTypePicker}
        close={() => setIsShowTypePicker(false)}
        types={props.types}
        type={value.type_id}
        setType={(t) => {
          const cat = props.categories.find((c) => c.type_id === t.id);
          setValue((prev) => ({
            ...prev,
            type_id: t.id,
            type_name: t.name,
            category_id: cat?.id,
            category_name: cat?.name,
            wallet_id: undefined,
            wallet_name: undefined,
          }));
        }}
      />

      <HistoryCategoryPickerSheet
        isOpen={isShowCategoryPicker}
        close={() => setIsShowCategoryPicker(false)}
        categories={props.categories.filter((c) => c.type_id === value.type_id)}
        category={value.category_id}
        setCategory={(c) =>
          setValue((prev) => ({
            ...prev,
            category_id: c.id,
            category_name: c.name,
          }))
        }
      />

      <HistoryWalletPickerSheet
        isOpen={isShowWalletPicker}
        close={() => setIsShowWalletPicker(false)}
        wallets={props.wallets.filter((w) => w.type_id === value.type_id)}
        wallet={value.wallet_id}
        setWallet={(w) =>
          setValue((prev) => ({
            ...prev,
            wallet_id: w.id,
            wallet_name: w.name,
          }))
        }
      />

      <ImagePreviewSheet
        isOpen={isShowImagePreview}
        close={() => setIsShowImagePreview(false)}
        image={selectedImagePreview}
      />

      <MapPickerSheet
        isOpen={isShowMapPicker}
        close={() => setIsShowMapPicker(false)}
        location={
          value.location && value.location_name && value.location_display_name
            ? {
                lat: value.location.lat,
                lng: value.location.lng,
                name: value.location_name,
                displayName: value.location_display_name,
              }
            : undefined
        }
        onPick={(l) =>
          setValue((prev) => ({
            ...prev,
            location: { lat: l.lat, lng: l.lng },
            location_name: l.name,
            location_display_name: l.displayName,
          }))
        }
      />
    </>
  );
}
