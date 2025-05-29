"use client";

import LogOutIcon from "@/component/icon/LogOutIcon";
import { useRouter } from "next/navigation";

interface Props {
  isLoading?: boolean;
  name?: string;
}

export default function HomeHeader(props: Readonly<Props>) {
  const router = useRouter();

  async function signOut() {
    await fetch(
      new URL("/api/auth/signout", process.env.NEXT_PUBLIC_SITE_URL),
      {
        method: "POST",
      }
    );

    router.replace("/");
  }

  return (
    <div className="flex items-center justify-between gap-x-2">
      <div className="min-w-0 flex-1">
        <span className="text-xs">Good Morning,</span>

        {props.isLoading ? (
          <div className="w-full h-5 bg-white/20 rounded animate-pulse" />
        ) : (
          <>
            <br />
            <span className="font-bold">{props.name}</span>
          </>
        )}
      </div>

      <button
        type="button"
        onClick={signOut}
        className="text-xl cursor-pointer"
      >
        <LogOutIcon />
      </button>
    </div>
  );
}
