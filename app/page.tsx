"use client";
import { useState } from "react";
import { Header } from "@/components/Header";
import { GridCanvas } from "@/components/GridCanvas";
import { RoadPalette } from "@/components/RoadPalette";
import { SettingsPanel } from "@/components/SettingsPanel";
import { NamedTilesPanel } from "@/components/NamedTilesPanel";
import { useGame } from "@/store/game";

export default function Page() {
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [paletteOpen, setPaletteOpen] = useState(true);
  const maps = useGame((s) => s.maps);
  const activeMapId = useGame((s) => s.activeMapId);
  const activeMap = maps.find((m) => m.id === activeMapId);

  return (
    <main className="h-screen w-screen relative overflow-hidden">
      {/* Base layer — full-screen map */}
      <div className="absolute inset-0">
        <GridCanvas />
      </div>

      {/* Floating header */}
      <div className="absolute inset-x-0 top-0 z-30">
        <Header
          onSettingsOpen={() => setSettingsOpen(true)}
          cityName={activeMap?.name}
        />
      </div>

      {/* Floating palette */}
      <div className="absolute left-4 z-20 flex items-start gap-2" style={{ top: 76 }}>
        {paletteOpen && (
          <div className="overflow-hidden" style={{ height: "calc(100vh - 156px)", maxWidth: "calc(100vw - 82px)" }}>
            <RoadPalette />
          </div>
        )}
        <button
          onClick={() => setPaletteOpen((v) => !v)}
          className="mt-1 flex h-8 w-8 shrink-0 items-center justify-center rounded-full border-2 border-asphalt-900 bg-white/90 shadow-tile backdrop-blur-sm hover:bg-asphalt-50 transition"
          title={paletteOpen ? "Hide palette" : "Show palette"}
        >
          <ChevronIcon open={paletteOpen} />
        </button>
      </div>

      {/* Named tiles panel (fixed to viewport) */}
      <NamedTilesPanel />

      <SettingsPanel open={settingsOpen} onClose={() => setSettingsOpen(false)} />
    </main>
  );
}

function ChevronIcon({ open }: { open: boolean }) {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      {open ? (
        <polyline points="15 18 9 12 15 6" />
      ) : (
        <polyline points="9 18 15 12 9 6" />
      )}
    </svg>
  );
}
