interface Props {
  isLoading?: boolean;
  activeId?: number;
  setActiveId: (id: number) => void;
  data: TypeI[];
}

export default function TypeSwitcher(props: Readonly<Props>) {
  if (props.isLoading) {
    return (
      <div className="w-full h-9 bg-white/20 rounded-full animate-pulse" />
    );
  }

  return (
    <div className="flex items-center">
      {props.data.map((type) => (
        <button
          key={`type_${type.id}`}
          type="button"
          onClick={() => props.setActiveId(type.id!)}
          className={`flex-1 py-2 px-4 rounded-full cursor-pointer transition-colors ${
            type.id === props.activeId
              ? "bg-white text-black"
              : "bg-transparent text-white"
          }`}
        >
          {type.name}
        </button>
      ))}
    </div>
  );
}
