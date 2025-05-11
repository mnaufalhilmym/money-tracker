import ImagesIcon from "@/component/icon/ImagesIcon";
import { randomString } from "@/util/randomString";
import { ChangeEvent, useRef } from "react";

interface Props {
  setImageList: (f: { id: string; file: File }[]) => void;
}

export default function ImagesPicker(props: Readonly<Props>) {
  const inputRef = useRef<HTMLInputElement>(null);

  function onChange(e: ChangeEvent<HTMLInputElement>) {
    const files = e.target.files;
    if (files) {
      const imageList: { id: string; file: File }[] = [];
      Array.from(files).forEach((f) => {
        imageList.push({ id: randomString(8), file: f });
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
