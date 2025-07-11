import { FocusEvent } from "react";
import CloseIcon from "../icon/CloseIcon";
import SearchIcon from "../icon/SearchIcon";

interface Props {
  placeholder: string;
  search: string;
  setSearch: (s: string) => void;
  onFocus?: (e: FocusEvent<HTMLInputElement, Element>) => void;
}

export default function SearchInput(props: Readonly<Props>) {
  function clear() {
    props.setSearch("");
  }

  return (
    <div className="relative flex items-center">
      <div className="absolute left-4 -z-1">
        <SearchIcon />
      </div>

      <input
        type="text"
        placeholder={props.placeholder}
        value={props.search}
        onChange={(e) => props.setSearch(e.target.value)}
        onFocus={props.onFocus}
        className={`w-full rounded-full border border-white/20 py-2 ${props.search ? "pr-9.5" : "pr-4"} pl-9.5 outline-none placeholder:text-neutral-500`}
      />

      {props.search && (
        <button
          type="button"
          onClick={clear}
          className="absolute right-4 cursor-pointer"
        >
          <CloseIcon />
        </button>
      )}
    </div>
  );
}
