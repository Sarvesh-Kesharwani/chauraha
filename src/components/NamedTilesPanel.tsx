"use client";
import { useState } from "react";
import { useGame } from "@/store/game";
import { parseKey } from "@/lib/grid";
import { ROADS } from "@/lib/roads";
import { BUILDINGS } from "@/lib/buildings";
import { WATERS } from "@/lib/water";
import { RoadTile } from "./RoadTile";
import { WaterTile } from "./WaterTile";
import { BuildingTile } from "./BuildingTile";
import type { Tile } from "@/lib/grid";
import clsx from "clsx";

function tileLabel(t: Tile) {
  return t.type === "road" ? ROADS[t.kind].label : t.type === "water" ? WATERS[t.kind].label : BUILDINGS[t.kind].label;
}

function TileIcon({ tile }: { tile: Tile }) {
  const rot = (tile as { rot?: 0 | 1 | 2 | 3 }).rot ?? 0;
  if (tile.type === "road") return <RoadTile kind={tile.kind} rot={rot} size={36} />;
  if (tile.type === "water") return <WaterTile kind={tile.kind} rot={rot} size={36} />;
  return <BuildingTile kind={tile.kind} size={36} />;
}

export function NamedTilesPanel() {
  const grid = useGame((s) => s.grid);
  const setFocusTarget = useGame((s) => s.setFocusTarget);
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");

  const named = [...grid.entries()]
    .filter(([, t]) => t.name?.trim())
    .map(([k, t]) => {
      const [x, y] = parseKey(k);
      return { key: k, x, y, tile: t, name: t.name! };
    })
    .filter((e) => !query || e.name.toLowerCase().includes(query.toLowerCase()) || tileLabel(e.tile).toLowerCase().includes(query.toLowerCase()))
    .sort((a, b) => a.name.localeCompare(b.name));

  return (
    <>
      <button
        onClick={() => setOpen((v) => !v)}
        title="Named places"
        className={clsx(
          "fixed right-4 z-40 flex h-9 w-9 items-center justify-center rounded-full border-2 border-asphalt-900 shadow-tile transition",
          open ? "bg-fuchsia-500 text-white" : "bg-white/90 text-asphalt-700 hover:bg-fuchsia-100",
        )}
        style={{ top: 82 }}
      >
        <BookmarkIcon />
        {named.length > 0 && !open && (
          <span className="absolute -right-1 -top-1 flex h-4 w-4 items-center justify-center rounded-full border border-white bg-fuchsia-500 text-[9px] font-bold text-white">
            {named.length > 9 ? "9+" : named.length}
          </span>
        )}
      </button>

      {open && (
        <div
          className="fixed right-4 z-40 flex w-64 flex-col rounded-2xl border-2 border-asphalt-200 bg-white shadow-2xl"
          style={{ top: 130, maxHeight: "calc(100vh - 140px)" }}
        >
          <div className="flex items-center justify-between border-b-2 border-asphalt-100 px-3 py-2.5 shrink-0">
            <span className="font-display font-extrabold text-sm text-asphalt-900">Named Places</span>
            <span className="text-xs text-asphalt-400">{named.length} found</span>
          </div>

          <div className="px-3 py-2 shrink-0">
            <input
              className="w-full rounded-xl border-2 border-asphalt-200 px-3 py-1.5 text-sm focus:border-fuchsia-400 focus:outline-none"
              placeholder="Search…"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
          </div>

          <ul className="flex-1 min-h-0 overflow-y-auto px-2 pb-2 space-y-1">
            {named.length === 0 && (
              <li className="py-6 text-center text-sm text-asphalt-400">
                {query ? "No match" : "No named tiles yet.\nHover a tile to name it."}
              </li>
            )}
            {named.map((e) => (
              <li key={e.key}>
                <button
                  onClick={() => { setFocusTarget({ x: e.x, y: e.y }); setOpen(false); }}
                  className="flex w-full items-center gap-2.5 rounded-xl border-2 border-transparent px-2 py-1.5 text-left transition hover:border-fuchsia-300 hover:bg-fuchsia-50 active:translate-y-px"
                >
                  <div className="shrink-0 rounded-lg overflow-hidden border border-asphalt-200">
                    <TileIcon tile={e.tile} />
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="truncate text-sm font-bold text-fuchsia-700">{e.name}</div>
                    <div className="truncate text-[10px] text-asphalt-500">{tileLabel(e.tile)}</div>
                  </div>
                  <div className="shrink-0 text-[9px] font-mono text-asphalt-400">
                    {e.x},{e.y}
                  </div>
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}
    </>
  );
}

function BookmarkIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z" />
    </svg>
  );
}
