"use client";

import { useEffect } from "react";

export default function PopupDonePage() {
  useEffect(() => {
    try {
      window.opener?.postMessage(
        { type: "chowkcraft-auth-success" },
        window.location.origin
      );
    } catch {}
    setTimeout(() => {
      try {
        window.close();
      } catch {}
      if (!window.closed) window.location.replace("/");
    }, 50);
  }, []);

  return (
    <div className="grid h-screen w-screen place-items-center bg-white text-asphalt-700">
      <div className="flex flex-col items-center gap-3">
        <div className="h-8 w-8 rounded-full border-4 border-asphalt-200 border-t-asphalt-900 animate-spin" />
        <div className="font-bold">Signing you in…</div>
      </div>
    </div>
  );
}
