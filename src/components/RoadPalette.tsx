"use client";
import { type ReactNode } from "react";
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
  const rot = useGame((s) => s.rot);
  const setSelected = useGame((s) => s.setSelected);
  const cycleRot = useGame((s) => s.cycleRot);
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

      <div className="flex-1 min-h-0 overflow-y-auto pr-1 space-y-4">
        <Section label="Roads" hint="Sadak">
          <div className="grid grid-cols-2 gap-2">
            {ROAD_ORDER.map((kind) => {
              const def = ROADS[kind];
              const active = selected?.type === "road" && selected.kind === kind;
              return (
                <button
                  key={kind}
                  onClick={() => setSelected({ type: "road", kind })}
                  draggable
                  onDragStart={() => setSelected({ type: "road", kind })}
                  className={clsx(
                    "relative flex flex-col items-center gap-1 rounded-xl border-2 p-2 transition",
                    "hover:-translate-y-0.5 hover:shadow-tile",
                    active
                      ? "border-marigold-500 bg-marigold-400/15 shadow-tile"
                      : "border-asphalt-200 bg-asphalt-50",
                  )}
                  title={`${def.label} - ${def.hindi}`}
                >
                  <div className={clsx("rounded-md overflow-hidden", active && "ring-2 ring-marigold-500")}>
                    <RoadTile kind={kind} rot={active ? rot : 0} size={56} />
                  </div>
                  <div className="text-[11px] font-semibold text-asphalt-700 text-center leading-tight">
                    {def.label}
                  </div>
                  <div className="text-[10px] text-asphalt-500 leading-none">{def.hindi}</div>
                </button>
              );
            })}
          </div>
        </Section>

        <Section label="Buildings" hint="Bhavan">
          <div className="grid grid-cols-2 gap-2">
            {BUILDING_ORDER.map((kind) => {
              const def = BUILDINGS[kind];
              const active = selected?.type === "building" && selected.kind === kind;
              return (
                <button
                  key={kind}
                  onClick={() => setSelected({ type: "building", kind })}
                  draggable
                  onDragStart={() => setSelected({ type: "building", kind })}
                  className={clsx(
                    "relative flex flex-col items-center gap-1 rounded-xl border-2 p-2 transition",
                    "hover:-translate-y-0.5 hover:shadow-tile",
                    active
                      ? "border-marigold-500 bg-marigold-400/15 shadow-tile"
                      : "border-asphalt-200 bg-asphalt-50",
                  )}
                  title={`${def.label} - ${def.hindi}`}
                >
                  <div className={clsx("rounded-md overflow-hidden", active && "ring-2 ring-marigold-500")}>
                    <BuildingTile kind={kind} size={56} />
                  </div>
                  <div className="text-[11px] font-semibold text-asphalt-700 text-center leading-tight">
                    {def.label}
                  </div>
                  <div className="text-[10px] text-asphalt-500 leading-none">{def.hindi}</div>
                </button>
              );
            })}
          </div>
        </Section>

        <Section label="Water" hint="Pani">
          <div className="grid grid-cols-2 gap-2">
            {WATER_ORDER.map((kind) => {
              const def = WATERS[kind];
              const active = selected?.type === "water" && selected.kind === kind;
              return (
                <button
                  key={kind}
                  onClick={() => setSelected({ type: "water", kind })}
                  draggable
                  onDragStart={() => setSelected({ type: "water", kind })}
                  className={clsx(
                    "relative flex flex-col items-center gap-1 rounded-xl border-2 p-2 transition",
                    "hover:-translate-y-0.5 hover:shadow-tile",
                    active ? "border-sky-500 bg-sky-400/15 shadow-tile" : "border-asphalt-200 bg-asphalt-50",
                  )}
                  title={`${def.label} - ${def.hindi}`}
                >
                  <div className={clsx("rounded-md overflow-hidden", active && "ring-2 ring-sky-500")}>
                    <WaterTile kind={kind} rot={active ? rot : 0} size={56} />
                  </div>
                  <div className="text-[11px] font-semibold text-asphalt-700 text-center leading-tight">{def.label}</div>
                  <div className="text-[10px] text-asphalt-500 leading-none">{def.hindi}</div>
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

      <div className="mt-2 text-[10px] text-asphalt-500 leading-snug shrink-0">
        <div>- Left-click to place, right-click a tile to remove</div>
        <div>- Right-click + drag to pan, <kbd className="px-1 bg-asphalt-100 rounded">R</kbd> to rotate</div>
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
