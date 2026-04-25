"use client";

import { signIn, signOut, useSession } from "next-auth/react";
import { useEffect, useState } from "react";

type SyncState = "idle" | "syncing" | "synced" | "error";

export function AuthControls() {
  const { data: session, status } = useSession();
  const [syncState, setSyncState] = useState<SyncState>("idle");

  useEffect(() => {
    const onState = (event: Event) => {
      const detail = (event as CustomEvent<{ state?: SyncState }>).detail;
      if (detail?.state) setSyncState(detail.state);
    };

    window.addEventListener("chowkcraft-sync-state", onState);
    return () => window.removeEventListener("chowkcraft-sync-state", onState);
  }, []);

  if (status === "loading") {
    return (
      <button
        type="button"
        disabled
        className="ml-3 rounded-xl bg-asphalt-200 text-asphalt-500 font-bold px-4 py-2 shadow-pop"
      >
        Loading
      </button>
    );
  }

  if (!session?.user) {
    return (
      <button
        type="button"
        onClick={() => void signIn("google", { callbackUrl: "/" })}
        className="ml-3 rounded-xl bg-asphalt-900 text-white font-bold px-4 py-2 shadow-pop hover:bg-asphalt-700 active:translate-y-0.5"
      >
        Sign in
      </button>
    );
  }

  const label =
    syncState === "syncing"
      ? "Syncing"
      : syncState === "synced"
      ? "Drive synced"
      : syncState === "error"
      ? "Sync error"
      : "Drive ready";

  return (
    <div className="ml-3 flex items-center gap-2">
      <div className="rounded-full border-2 border-asphalt-200 bg-white px-3 py-1 text-xs font-extrabold text-asphalt-700">
        {label}
      </div>
      <button
        type="button"
        onClick={() => void signOut({ callbackUrl: "/" })}
        className="rounded-xl bg-asphalt-900 text-white font-bold px-4 py-2 shadow-pop hover:bg-asphalt-700 active:translate-y-0.5"
        title={session.user.email ?? session.user.name ?? "Signed in"}
      >
        {session.user.name ?? "Sign out"}
      </button>
    </div>
  );
}
