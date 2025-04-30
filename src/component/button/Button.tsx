interface Props {
  type: "submit" | "reset" | "button";
  children: React.ReactNode;
}

export default function Button(props: Readonly<Props>) {
  return (
    <button
      type={props.type}
      className="w-full py-2 px-4 font-bold text-center rounded-full bg-white/20 border border-white/20"
    >
      {props.children}
    </button>
  );
}
