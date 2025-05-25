import { ChangeEvent } from "react";

interface Props {
  value?: string;
  setValue: (value?: string) => void;
}

export default function DateTimeInput(props: Readonly<Props>) {
  function isoToLocalDateTime(isoString: string) {
    const date = new Date(isoString);

    // helper to pad 2 digits
    const pad = (n: number) => n.toString().padStart(2, "0");

    // construct string in "YYYY-MM-DDTHH:mm" format
    const localDateTime =
      date.getFullYear() +
      "-" +
      pad(date.getMonth() + 1) +
      "-" +
      pad(date.getDate()) +
      "T" +
      pad(date.getHours()) +
      ":" +
      pad(date.getMinutes());

    return localDateTime;
  }

  function onChange(e: ChangeEvent<HTMLInputElement>) {
    if (!e.target.value) {
      props.setValue(undefined);
      return;
    }
    const localDateTime = new Date(e.target.value);
    props.setValue(localDateTime.toISOString());
  }

  return (
    <input
      type="datetime-local"
      placeholder="Select date"
      value={props.value ? isoToLocalDateTime(props.value) : ""}
      onChange={onChange}
      className={`outline-none w-full text-center ${
        props.value ? "text-white" : "text-neutral-500"
      } calendar-picker-color-invert`}
    />
  );
}
