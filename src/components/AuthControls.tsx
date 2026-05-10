"use client";

import { signIn, signOut, useSession } from "next-auth/react";
import { useEffect, useState } from "react";

type SyncState = "idle" | "syncing" | "synced" | "error";
type CachedUser = { name?: string | null; email?: string | null; image?: string | null };

const CACHE_KEY = "chowkcraft_cached_user";

function readCachedUser(): CachedUser | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = window.localStorage.getItem(CACHE_KEY);
    return raw ? (JSON.parse(raw) as CachedUser) : null;
  } catch {
    return null;
  }
}

function writeCachedUser(user: CachedUser | null) {
  if (typeof window === "undefined") return;
  try {
    if (user) window.localStorage.setItem(CACHE_KEY, JSON.stringify(user));
    else window.localStorage.removeItem(CACHE_KEY);
  } catch {}
}

function openGooglePopup(): Window | null {
  const w = 520;
  const h = 620;
  const dualScreenLeft = window.screenLeft ?? window.screenX ?? 0;
  const dualScreenTop = window.screenTop ?? window.screenY ?? 0;
  const width = window.innerWidth || document.documentElement.clientWidth || screen.width;
  const height = window.innerHeight || document.documentElement.clientHeight || screen.height;
  const left = dualScreenLeft + (width - w) / 2;
  const top = dualScreenTop + (height - h) / 2;
  return window.open(
    "/auth/popup-start",
    "chowkcraft-google-signin",
    `width=${w},height=${h},left=${left},top=${top},menubar=no,toolbar=no,location=no,status=no`
  );
}

export function AuthControls() {
  const { data: session, status, update } = useSession();
  const [syncState, setSyncState] = useState<SyncState>("idle");
  const [cachedUser, setCachedUser] = useState<CachedUser | null>(() => readCachedUser());

  useEffect(() => {
    const onState = (event: Event) => {
      const detail = (event as CustomEvent<{ state?: SyncState }>).detail;
      if (detail?.state) setSyncState(detail.state);
    };

    window.addEventListener("chowkcraft-sync-state", onState);
    return () => window.removeEventListener("chowkcraft-sync-state", onState);
  }, []);

  useEffect(() => {
    if (status === "authenticated" && session?.user) {
      const next: CachedUser = {
        name: session.user.name,
        email: session.user.email,
        image: session.user.image,
      };
      writeCachedUser(next);
      setCachedUser(next);
    } else if (status === "unauthenticated") {
      writeCachedUser(null);
      setCachedUser(null);
    }
  }, [status, session?.user]);

  useEffect(() => {
    const onMessage = (e: MessageEvent) => {
      if (e.origin !== window.location.origin) return;
      if (e.data?.type !== "chowkcraft-auth-success") return;
      void update();
    };
    window.addEventListener("message", onMessage);
    return () => window.removeEventListener("message", onMessage);
  }, [update]);

  const handleSignIn = () => {
    const popup = openGooglePopup();
    if (!popup || popup.closed || typeof popup.closed === "undefined") {
      void signIn("google", { callbackUrl: "/" });
      return;
    }
    const interval = window.setInterval(() => {
      if (popup.closed) {
        window.clearInterval(interval);
        void update();
      }
    }, 600);
  };

  const optimisticUser = session?.user ?? cachedUser ?? null;
  const showSignIn = status !== "loading" && !optimisticUser;

  if (showSignIn) {
    return (
      <button
        type="button"
        onClick={handleSignIn}
        className="ml-1 sm:ml-3 rounded-xl bg-asphalt-900 text-white font-bold px-3 sm:px-4 py-1.5 sm:py-2 text-sm shadow-pop hover:bg-asphalt-700 active:translate-y-0.5"
      >
        Sign in
      </button>
    );
  }

  if (!optimisticUser) {
    return (
      <button
        type="button"
        disabled
        className="ml-1 sm:ml-3 rounded-xl bg-asphalt-200 text-asphalt-500 font-bold px-3 sm:px-4 py-1.5 sm:py-2 text-sm shadow-pop"
      >
        Loading
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
    <div className="ml-1 sm:ml-3 flex items-center gap-1.5 sm:gap-2">
      <div className="hidden md:block rounded-full border-2 border-asphalt-200 bg-white px-3 py-1 text-xs font-extrabold text-asphalt-700">
        {label}
      </div>
      <button
        type="button"
        onClick={() => {
          writeCachedUser(null);
          setCachedUser(null);
          void signOut({ callbackUrl: "/" });
        }}
        className="max-w-[120px] truncate rounded-xl bg-asphalt-900 text-white font-bold px-3 sm:px-4 py-1.5 sm:py-2 text-sm shadow-pop hover:bg-asphalt-700 active:translate-y-0.5"
        title={optimisticUser.email ?? optimisticUser.name ?? "Signed in"}
      >
        {optimisticUser.name ?? "Sign out"}
      </button>
    </div>
  );
}
