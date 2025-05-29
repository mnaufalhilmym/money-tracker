"use client";

import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import LoadingIcon from "../icon/LoadingIcon";

export default function GoogleSignInButton() {
  const divRef = useRef<HTMLDivElement>(null);

  const router = useRouter();

  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (
      window.google &&
      divRef.current &&
      process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID
    ) {
      window.google.accounts.id.initialize({
        client_id: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID,
        auto_select: true,
        callback: (r) => {
          (async () => {
            signInCallback(r);
          })();
        },
      });

      window.google.accounts.id.renderButton(divRef.current, {
        theme: "filled_blue",
        size: "medium",
        text: "continue_with",
        shape: "pill",
      });
    }
  }, []);

  async function signInCallback(
    credentialResponse: google.accounts.id.CredentialResponse
  ) {
    try {
      setIsLoading(true);

      await fetch("/api/auth/google", {
        method: "POST",
        body: JSON.stringify({ credential: credentialResponse.credential }),
      });

      router.replace("/");
    } catch (err) {
      console.error("Google signin failed", err);
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <>
      <div ref={divRef} />

      {isLoading && (
        <div className="w-fit mt-4 mx-auto text-xl">
          <LoadingIcon />
        </div>
      )}
    </>
  );
}
