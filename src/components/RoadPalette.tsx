"use client";
import { useState, type ReactNode } from "react";
import { BUILDING_ORDER, BUILDINGS } from "@/lib/buildings";
import { ROAD_ORDER, ROADS } from "@/lib/roads";
import { WATER_ORDER, WATERS } from "@/lib/water";
import { useGame } from "@/store/game";
import { BuildingTile } from "./BuildingTile";
import { RoadTile } from "./RoadTile";
import { WaterTile } from "./WaterTile";
import clsx from "clsx";

type Tab = "roads" | "buildings" | "water";

export function RoadPalette() {
  const [tab, setTab] = useState<Tab>("roads");
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
    <aside className="bg-white rounded-xl2 shadow-pop border-2 border-asphalt-200 p-4 w-[260px] shrink-0">
      <div className="flex items-baseline justify-between mb-3">
        <h2 className="font-display font-extrabold text-lg text-asphalt-900">City Assets</h2>
        <span className="text-xs text-asphalt-500">Sadak, Bhavan, Pani</span>
      </div>

      <div className="grid grid-cols-3 rounded-xl border-2 border-asphalt-200 bg-asphalt-50 p-1 mb-3">
        <TabButton active={tab === "roads"} onClick={() => setTab("roads")}>Roads</TabButton>
        <TabButton active={tab === "buildings"} onClick={() => setTab("buildings")}>Buildings</TabButton>
        <TabButton active={tab === "water"} onClick={() => setTab("water")}>Water</TabButton>
      </div>

      {tab === "roads" ? (
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
      ) : tab === "buildings" ? (
        <div className="grid grid-cols-2 gap-2 max-h-[520px] overflow-y-auto pr-1">
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
      ) : (
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
      )}

      {canRotate && (
        <button
          onClick={cycleRot}
          className="mt-4 w-full rounded-xl border-2 border-asphalt-200 bg-white py-2 font-bold text-asphalt-700 hover:bg-asphalt-50 shadow-tile active:translate-y-0.5"
        >
          Rotate {rot * 90} deg <span className="text-asphalt-500 text-xs">(R)</span>
        </button>
      )}

      <div className="mt-3 text-[11px] text-asphalt-500 leading-snug">
        <div>- Click grid to place</div>
        <div>- Right-click to remove</div>
        <div>- Hold <kbd className="px-1 bg-asphalt-100 rounded">Space</kbd> to pan only</div>
        <div>- Press <kbd className="px-1 bg-asphalt-100 rounded">R</kbd> to rotate roads and water</div>
        <div>- Water set: canals, river bends, pond, ghat</div>
      </div>
    </aside>
  );
}

function TabButton({ active, onClick, children }: { active: boolean; onClick: () => void; children: ReactNode }) {
  return (
    <button
      onClick={onClick}
      className={clsx(
        "rounded-lg px-3 py-1.5 text-sm font-bold transition",
        active ? "bg-white text-asphalt-900 shadow-tile" : "text-asphalt-500 hover:text-asphalt-800",
      )}
    >
      {children}
    </button>
  );
}
