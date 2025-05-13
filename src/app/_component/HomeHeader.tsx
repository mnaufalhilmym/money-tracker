"use client";

import LogOutIcon from "@/component/icon/LogOutIcon";
import { useRouter } from "next/navigation";

interface Props {
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
    <div className="flex items-center justify-between">
      <div>
        <span className="text-xs">Good Morning,</span>
        <br />
        <span className="font-bold">{props.name}</span>
      </div>
      <button type="button" onClick={signOut} className="text-xl">
        <LogOutIcon />
      </button>
    </div>
  );
}
