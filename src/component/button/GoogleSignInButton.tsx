"use client";

import { useRouter } from "next/navigation";
import { useEffect, useRef } from "react";

export default function GoogleSignInButton() {
  const divRef = useRef<HTMLDivElement>(null);

  const router = useRouter();

  useEffect(() => {
    if (
      window.google &&
      divRef.current &&
      process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID
    ) {
      window.google.accounts.id.initialize({
        client_id: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID,
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
    await fetch("/api/auth/google", {
      method: "POST",
      body: JSON.stringify({ credential: credentialResponse.credential }),
    });

    router.replace("/");
  }

  return <div ref={divRef} />;
}
