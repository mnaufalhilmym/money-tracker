import toTitleCase from "@/util/titleCase";

interface Props {
  isLoading?: boolean;
  active?: { id: number; name: string };
  setActive: (data?: { id: number; name: string }) => void;
  data: TypeI[];
}

export default function TypeSwitcher(props: Readonly<Props>) {
  if (props.isLoading) {
    return (
      <div className="w-full h-11.5 bg-white/20 rounded-full border border-white/20 animate-pulse" />
    );
  }

  return (
    <div className="p-1 flex items-center rounded-full bg-white/20 border border-white/20">
      {props.data.map((type) => (
        <button
          key={`type_${type.id}`}
          type="button"
          onClick={() => props.setActive({ id: type.id!, name: type.name! })}
          className={`flex-1 py-2 px-4 rounded-full cursor-pointer transition-colors ${
            props.active?.id === type.id
              ? "bg-white text-black"
              : "bg-transparent text-white"
          }`}
        >
          {toTitleCase(type.name!)}
        </button>
      ))}
    </div>
  );
}
