"use client";
import { useEffect, useMemo, useRef, useState } from "react";
import { useGame } from "@/store/game";
import { cellKey, evalTile, parseKey } from "@/lib/grid";
import { RoadTile, TILE_SIZE } from "./RoadTile";

const GRID_COLS = 18;
const GRID_ROWS = 12;

export function GridCanvas() {
  const grid = useGame((s) => s.grid);
  const selected = useGame((s) => s.selected);
  const rot = useGame((s) => s.rot);
  const placeTile = useGame((s) => s.placeTile);
  const removeTile = useGame((s) => s.removeTile);
  const rotateTile = useGame((s) => s.rotateTile);
  const cycleRot = useGame((s) => s.cycleRot);
  const feedback = useGame((s) => s.feedback);

  const [hover, setHover] = useState<{ x: number; y: number } | null>(null);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key.toLowerCase() === "r") {
        if (hover && grid.has(cellKey(hover.x, hover.y))) rotateTile(hover.x, hover.y);
        else cycleRot();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [hover, grid, rotateTile, cycleRot]);

  const evals = useMemo(() => {
    const m = new Map<string, ReturnType<typeof evalTile>>();
    for (const [k] of grid) {
      const [x, y] = parseKey(k);
      m.set(k, evalTile(grid, x, y));
    }
    return m;
  }, [grid]);

  const width = GRID_COLS * TILE_SIZE;
  const height = GRID_ROWS * TILE_SIZE;

  const cellAt = (clientX: number, clientY: number) => {
    const el = ref.current;
    if (!el) return null;
    const r = el.getBoundingClientRect();
    const x = Math.floor((clientX - r.left) / TILE_SIZE);
    const y = Math.floor((clientY - r.top) / TILE_SIZE);
    if (x < 0 || y < 0 || x >= GRID_COLS || y >= GRID_ROWS) return null;
    return { x, y };
  };

  return (
    <div
      ref={ref}
      className="grid-bg relative rounded-xl2 shadow-pop bg-asphalt-50 border-2 border-asphalt-200 overflow-hidden no-select"
      style={{ width, height, backgroundSize: `${TILE_SIZE}px ${TILE_SIZE}px` }}
      onMouseMove={(e) => setHover(cellAt(e.clientX, e.clientY))}
      onMouseLeave={() => setHover(null)}
      onClick={(e) => {
        const c = cellAt(e.clientX, e.clientY);
        if (!c || !selected) return;
        placeTile(c.x, c.y);
      }}
      onContextMenu={(e) => {
        e.preventDefault();
        const c = cellAt(e.clientX, e.clientY);
        if (!c) return;
        if (grid.has(cellKey(c.x, c.y))) removeTile(c.x, c.y);
      }}
      onDragOver={(e) => {
        e.preventDefault();
        setHover(cellAt(e.clientX, e.clientY));
      }}
      onDrop={(e) => {
        e.preventDefault();
        const c = cellAt(e.clientX, e.clientY);
        if (!c) return;
        placeTile(c.x, c.y);
      }}
    >
      {[...grid.entries()].map(([k, t]) => {
        const [x, y] = parseKey(k);
        const ev = evals.get(k);
        const anyOk = ev && Object.values(ev.connectedSides).some(Boolean);
        const bad = ev && ev.mismatched > 0;
        const outline = bad ? "bad" : anyOk ? "ok" : null;
        const pulse = feedback && feedback.x === x && feedback.y === y && feedback.kind === "ok";
        return (
          <div
            key={k}
            className={`absolute transition-transform ${pulse ? "animate-pulseJoin" : ""} ${bad ? "animate-shake" : ""}`}
            style={{ left: x * TILE_SIZE, top: y * TILE_SIZE, width: TILE_SIZE, height: TILE_SIZE }}
          >
            <RoadTile kind={t.kind} rot={t.rot} outline={outline} />
          </div>
        );
      })}

      {hover && selected && !grid.has(cellKey(hover.x, hover.y)) && (
        <div
          className="absolute pointer-events-none opacity-60"
          style={{ left: hover.x * TILE_SIZE, top: hover.y * TILE_SIZE, width: TILE_SIZE, height: TILE_SIZE }}
        >
          <RoadTile kind={selected} rot={rot} outline="hover" />
        </div>
      )}
    </div>
  );
}

export { GRID_COLS, GRID_ROWS };
