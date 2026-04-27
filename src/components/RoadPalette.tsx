"use client";
import { useMemo, useState, type ReactNode } from "react";
import { BUILDING_ORDER, BUILDINGS } from "@/lib/buildings";
import { ROAD_ORDER, ROADS } from "@/lib/roads";
import { WATER_ORDER, WATERS } from "@/lib/water";
import { useGame } from "@/store/game";
import { BuildingTile } from "./BuildingTile";
import { RoadTile } from "./RoadTile";
import { WaterTile } from "./WaterTile";
import clsx from "clsx";

export function RoadPalette() {
  const selected = useGame((s) => s.selected);
  const eraseMode = useGame((s) => s.eraseMode);
  const rot = useGame((s) => s.rot);
  const setSelected = useGame((s) => s.setSelected);
  const setEraseMode = useGame((s) => s.setEraseMode);
  const cycleRot = useGame((s) => s.cycleRot);
  const [query, setQuery] = useState("");
  const normalizedQuery = query.trim().toLowerCase();

  const filteredRoads = useMemo(
    () =>
      ROAD_ORDER.filter((kind) => {
        if (!normalizedQuery) return true;
        const def = ROADS[kind];
        return def.label.toLowerCase().includes(normalizedQuery) || def.hindi.toLowerCase().includes(normalizedQuery);
      }),
    [normalizedQuery],
  );

  const filteredBuildings = useMemo(
    () =>
      BUILDING_ORDER.filter((kind) => {
        if (!normalizedQuery) return true;
        const def = BUILDINGS[kind];
        return def.label.toLowerCase().includes(normalizedQuery) || def.hindi.toLowerCase().includes(normalizedQuery);
      }),
    [normalizedQuery],
  );

  const filteredWaters = useMemo(
    () =>
      WATER_ORDER.filter((kind) => {
        if (!normalizedQuery) return true;
        const def = WATERS[kind];
        return def.label.toLowerCase().includes(normalizedQuery) || def.hindi.toLowerCase().includes(normalizedQuery);
      }),
    [normalizedQuery],
  );

  const noResults = normalizedQuery && filteredRoads.length === 0 && filteredBuildings.length === 0 && filteredWaters.length === 0;

  const canRotate =
    selected?.type === "road"
      ? ROADS[selected.kind].rotatable
      : selected?.type === "water"
        ? WATERS[selected.kind].rotatable
        : false;

  return (
    <aside className="bg-white rounded-xl2 shadow-pop border-2 border-asphalt-200 p-3 w-[260px] shrink-0 flex flex-col h-full min-h-0">
      <div className="flex items-baseline justify-between mb-2 shrink-0">
        <h2 className="font-display font-extrabold text-lg text-asphalt-900">City Assets</h2>
        <span className="text-[10px] text-asphalt-500">Sadak, Bhavan, Pani</span>
      </div>

      <div className="mb-2 shrink-0">
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search city assets..."
          className="w-full rounded-xl border-2 border-asphalt-200 bg-white px-3 py-1.5 text-sm text-asphalt-800 outline-none transition focus:border-fuchsia-400 focus:ring-2 focus:ring-fuchsia-100"
          aria-label="Search city assets"
        />
      </div>

      <div className="flex-1 min-h-0 overflow-y-auto pr-1 space-y-4">
        {noResults && (
          <div className="rounded-xl border-2 border-dashed border-asphalt-200 bg-asphalt-50 px-3 py-2 text-xs font-semibold text-asphalt-500">
            No assets found for "{query.trim()}".
          </div>
        )}

        <Section label="Roads" hint="Sadak">
          <div className="grid grid-cols-2 gap-2">
            {filteredRoads.map((kind) => {
              const def = ROADS[kind];
              const active = selected?.type === "road" && selected.kind === kind;
              return (
                <button
                  key={kind}
                  onClick={() => setSelected({ type: "road", kind })}
                  draggable
                  onDragStart={() => setSelected({ type: "road", kind })}
                  className={clsx(
                    "group relative flex flex-col items-center gap-1 rounded-xl border-2 p-2 transition",
                    "hover:-translate-y-0.5 hover:shadow-tile",
                    "border-asphalt-200 bg-asphalt-50",
                  )}
                >
                  <div className="rounded-md overflow-hidden">
                    <RoadTile kind={kind} rot={active ? rot : 0} size={56} outline={active ? "selected" : null} />
                  </div>
                  <div className="text-[13px] font-extrabold text-asphalt-800 text-center leading-snug">
                    {def.label}
                  </div>
                  <div className="text-[11px] font-semibold text-asphalt-600 leading-snug">{def.hindi}</div>
                  <AssetHoverTitle label={def.label} hindi={def.hindi} />
                </button>
              );
            })}
          </div>
        </Section>

        <Section label="Buildings" hint="Bhavan">
          <div className="grid grid-cols-2 gap-2">
            {filteredBuildings.map((kind) => {
              const def = BUILDINGS[kind];
              const active = selected?.type === "building" && selected.kind === kind;
              return (
                <button
                  key={kind}
                  onClick={() => setSelected({ type: "building", kind })}
                  draggable
                  onDragStart={() => setSelected({ type: "building", kind })}
                  className={clsx(
                    "group relative flex flex-col items-center gap-1 rounded-xl border-2 p-2 transition",
                    "hover:-translate-y-0.5 hover:shadow-tile",
                    "border-asphalt-200 bg-asphalt-50",
                  )}
                >
                  <div className="rounded-md overflow-hidden">
                    <BuildingTile kind={kind} size={56} outline={active ? "selected" : null} />
                  </div>
                  <div className="text-[13px] font-extrabold text-asphalt-800 text-center leading-snug">
                    {def.label}
                  </div>
                  <div className="text-[11px] font-semibold text-asphalt-600 leading-snug">{def.hindi}</div>
                  <AssetHoverTitle label={def.label} hindi={def.hindi} />
                </button>
              );
            })}
          </div>
        </Section>

        <Section label="Water" hint="Pani">
          <div className="grid grid-cols-2 gap-2">
            {filteredWaters.map((kind) => {
              const def = WATERS[kind];
              const active = selected?.type === "water" && selected.kind === kind;
              return (
                <button
                  key={kind}
                  onClick={() => setSelected({ type: "water", kind })}
                  draggable
                  onDragStart={() => setSelected({ type: "water", kind })}
                  className={clsx(
                    "group relative flex flex-col items-center gap-1 rounded-xl border-2 p-2 transition",
                    "hover:-translate-y-0.5 hover:shadow-tile",
                    "border-asphalt-200 bg-asphalt-50",
                  )}
                >
                  <div className="rounded-md overflow-hidden">
                    <WaterTile kind={kind} rot={active ? rot : 0} size={56} outline={active ? "selected" : null} />
                  </div>
                  <div className="text-[13px] font-extrabold text-asphalt-800 text-center leading-snug">{def.label}</div>
                  <div className="text-[11px] font-semibold text-asphalt-600 leading-snug">{def.hindi}</div>
                  <AssetHoverTitle label={def.label} hindi={def.hindi} />
                </button>
              );
            })}
          </div>
        </Section>
      </div>

      {canRotate && (
        <button
          onClick={cycleRot}
          className="mt-2 w-full rounded-xl border-2 border-asphalt-200 bg-white py-1.5 text-sm font-bold text-asphalt-700 hover:bg-asphalt-50 shadow-tile active:translate-y-0.5 shrink-0"
        >
          Rotate {rot * 90} deg <span className="text-asphalt-500 text-xs">(R)</span>
        </button>
      )}

      <button
        onClick={() => setEraseMode(!eraseMode)}
        className={clsx(
          "mt-2 w-full rounded-xl border-2 py-1.5 text-sm font-bold shadow-tile active:translate-y-0.5 shrink-0 transition",
          eraseMode
            ? "border-red-500 bg-red-500 text-white hover:bg-red-600"
            : "border-asphalt-200 bg-white text-asphalt-700 hover:bg-asphalt-50",
        )}
      >
        {eraseMode ? "Eraser On" : "Eraser Off"}
      </button>

      <div className="mt-2 text-[10px] text-asphalt-500 leading-snug shrink-0">
        <div>- Left-click to place tiles</div>
        <div>- Turn on Eraser mode, then left-click a tile to remove</div>
        <div>- Right-click tile to rotate, right-click + drag to pan</div>
      </div>
    </aside>
  );
}

function Section({ label, hint, children }: { label: string; hint: string; children: ReactNode }) {
  return (
    <section>
      <div className="sticky top-0 z-10 -mx-1 px-1 pb-1.5 pt-0.5 bg-white">
        <div className="flex items-baseline justify-between border-b-2 border-asphalt-200">
          <h3 className="font-display font-extrabold text-sm text-asphalt-900 uppercase tracking-wide">
            {label}
          </h3>
          <span className="text-[10px] text-asphalt-500">{hint}</span>
        </div>
      </div>
      {children}
    </section>
  );
}

function AssetHoverTitle({ label, hindi }: { label: string; hindi: string }) {
  return (
    <div className="pointer-events-none absolute left-1/2 top-1 z-30 w-max max-w-[220px] -translate-x-1/2 -translate-y-full rounded-xl border-2 border-asphalt-900 bg-white px-3 py-1.5 text-center opacity-0 shadow-pop transition group-hover:opacity-100">
      <div className="text-sm font-extrabold leading-snug text-asphalt-900">{label}</div>
      <div className="text-xs font-semibold leading-snug text-asphalt-600">{hindi}</div>
    </div>
  );
}
