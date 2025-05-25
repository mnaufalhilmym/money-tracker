interface Props {
  value?: string;
  setValue: (value?: string) => void;
}

export default function DescriptionInput(props: Readonly<Props>) {
  return (
    <input
      type="text"
      placeholder="Description"
      value={props.value ?? ""}
      onChange={(e) => props.setValue(e.target.value)}
      className="outline-none w-full text-center placeholder:text-neutral-500"
    />
  );
}
