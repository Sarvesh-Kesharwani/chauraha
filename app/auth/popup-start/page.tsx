"use client";

import { signIn } from "next-auth/react";
import { useEffect } from "react";

export default function PopupStartPage() {
  useEffect(() => {
    void signIn("google", { callbackUrl: "/auth/popup-done" });
  }, []);

  return (
    <div className="grid h-screen w-screen place-items-center bg-white text-asphalt-700">
      <div className="flex flex-col items-center gap-3">
        <div className="h-8 w-8 rounded-full border-4 border-asphalt-200 border-t-asphalt-900 animate-spin" />
        <div className="font-bold">Opening Google…</div>
      </div>
    </div>
  );
}
