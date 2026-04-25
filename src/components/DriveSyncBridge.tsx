"use client";

import { useSession } from "next-auth/react";
import { useEffect, useRef } from "react";
import { parseGameSnapshot, serializeGameSnapshot, useGame } from "@/store/game";

const PULLED_KEY = "chowkcraft_drive_pulled";
const LOCAL_KEY = "chowkcraft_local_progress";

function emitSyncState(state: "idle" | "syncing" | "synced" | "error") {
  window.dispatchEvent(new CustomEvent("chowkcraft-sync-state", { detail: { state } }));
}

export function DriveSyncBridge() {
  const { data: session, status } = useSession();
  const hydratedRef = useRef(false);
  const localHydratedRef = useRef(false);
  const pushingRef = useRef(false);
  const debounceRef = useRef<number | null>(null);

  useEffect(() => {
    const localSnapshot = window.localStorage.getItem(LOCAL_KEY);
    if (!localSnapshot) {
      localHydratedRef.current = true;
      return;
    }

    const snapshot = parseGameSnapshot(localSnapshot);
    if (snapshot) {
      useGame.getState().hydrateSnapshot(snapshot);
    }
    localHydratedRef.current = true;
  }, []);

  useEffect(() => {
    if (status !== "authenticated" || !session?.accessToken) {
      sessionStorage.removeItem(PULLED_KEY);
      emitSyncState("idle");
      hydratedRef.current = localHydratedRef.current;
      return;
    }

    const localSnapshot = window.localStorage.getItem(LOCAL_KEY);

    if (localSnapshot) {
      hydratedRef.current = true;
      sessionStorage.setItem(PULLED_KEY, "1");
      emitSyncState("syncing");
      void fetch("/api/drive/sync", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ gameState: localSnapshot }),
      })
        .then(() => emitSyncState("synced"))
        .catch(() => emitSyncState("error"));
      return;
    }

    if (sessionStorage.getItem(PULLED_KEY)) {
      hydratedRef.current = true;
      emitSyncState("synced");
      return;
    }

    emitSyncState("syncing");
    fetch("/api/drive/sync", { method: "PUT" })
      .then(async (res) => {
        if (!res.ok) throw new Error("pull failed");
        const data = (await res.json()) as { progress?: string | null };
        if (data.progress) {
          const snapshot = parseGameSnapshot(data.progress);
          if (snapshot) useGame.getState().hydrateSnapshot(snapshot);
        } else {
          await fetch("/api/drive/sync", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              gameState: serializeGameSnapshot(useGame.getState()),
            }),
          });
        }
        sessionStorage.setItem(PULLED_KEY, "1");
        hydratedRef.current = true;
        emitSyncState("synced");
      })
      .catch(() => emitSyncState("error"));
  }, [session?.accessToken, status]);

  useEffect(() => {
    const unsubscribe = useGame.subscribe((state) => {
      if (!localHydratedRef.current) return;

      const serialized = serializeGameSnapshot(state);
      window.localStorage.setItem(LOCAL_KEY, serialized);

      if (status !== "authenticated" || !session?.accessToken) return;
      if (!hydratedRef.current || pushingRef.current) return;
      if (debounceRef.current) window.clearTimeout(debounceRef.current);

      debounceRef.current = window.setTimeout(async () => {
        try {
          pushingRef.current = true;
          emitSyncState("syncing");
          await fetch("/api/drive/sync", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ gameState: serialized }),
          });
          emitSyncState("synced");
        } catch {
          emitSyncState("error");
        } finally {
          pushingRef.current = false;
        }
      }, 800);
    });

    return () => {
      unsubscribe();
      if (debounceRef.current) window.clearTimeout(debounceRef.current);
    };
  }, [session?.accessToken, status]);

  return null;
}
