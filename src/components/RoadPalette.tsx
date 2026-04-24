"use client";
import { ROAD_ORDER, ROADS } from "@/lib/roads";
import { useGame } from "@/store/game";
import { RoadTile } from "./RoadTile";
import clsx from "clsx";

export function RoadPalette() {
  const selected = useGame((s) => s.selected);
  const rot = useGame((s) => s.rot);
  const setSelected = useGame((s) => s.setSelected);
  const cycleRot = useGame((s) => s.cycleRot);

  return (
    <aside className="bg-white rounded-xl2 shadow-pop border-2 border-asphalt-200 p-4 w-[260px] shrink-0">
      <div className="flex items-baseline justify-between mb-3">
        <h2 className="font-display font-extrabold text-lg text-asphalt-900">Road Blocks</h2>
        <span className="text-xs text-asphalt-500">Sadak Blocks</span>
      </div>

      <div className="grid grid-cols-2 gap-2">
        {ROAD_ORDER.map((kind) => {
          const def = ROADS[kind];
          const active = selected === kind;
          return (
            <button
              key={kind}
              onClick={() => setSelected(kind)}
              draggable
              onDragStart={() => setSelected(kind)}
              className={clsx(
                "relative flex flex-col items-center gap-1 rounded-xl border-2 p-2 transition",
                "hover:-translate-y-0.5 hover:shadow-tile",
                active
                  ? "border-marigold-500 bg-marigold-400/15 shadow-tile"
                  : "border-asphalt-200 bg-asphalt-50",
              )}
              title={`${def.label} — ${def.hindi}`}
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

      <button
        onClick={cycleRot}
        className="mt-4 w-full rounded-xl border-2 border-asphalt-200 bg-white py-2 font-bold text-asphalt-700 hover:bg-asphalt-50 shadow-tile active:translate-y-0.5"
      >
        Rotate {rot * 90}° <span className="text-asphalt-500 text-xs">(R)</span>
      </button>

      <div className="mt-3 text-[11px] text-asphalt-500 leading-snug">
        <div>• Click grid to place</div>
        <div>• Right-click to remove</div>
        <div>• Press <kbd className="px-1 bg-asphalt-100 rounded">R</kbd> to rotate hover or ghost</div>
        <div>• Drag blocks onto the map</div>
      </div>
    </aside>
  );
}
