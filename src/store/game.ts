"use client";
import { create } from "zustand";
import { cellKey, evalTile, type GridMap, type Rot, type Tile } from "@/lib/grid";
import type { RoadKind } from "@/lib/roads";
import type { BuildingKind } from "@/lib/buildings";

export type Feedback = { x: number; y: number; kind: "ok" | "bad"; at: number } | null;
export type SelectedTool =
  | { type: "road"; kind: RoadKind }
  | { type: "building"; kind: BuildingKind };

type State = {
  grid: GridMap;
  selected: SelectedTool | null;
  rot: Rot;
  feedback: Feedback;
  placeTile: (x: number, y: number) => void;
  removeTile: (x: number, y: number) => void;
  rotateTile: (x: number, y: number) => void;
  setSelected: (tool: SelectedTool | null) => void;
  cycleRot: () => void;
  clearAll: () => void;
};

export const useGame = create<State>((set, get) => ({
  grid: new Map(),
  selected: { type: "road", kind: "straight" },
  rot: 0,
  feedback: null,
  setSelected: (k) => set({ selected: k }),
  cycleRot: () => set((s) => ({ rot: (((s.rot + 1) % 4) as Rot) })),
  placeTile: (x, y) => {
    const { selected, rot, grid } = get();
    if (!selected) return;
    const next = new Map(grid);
    const tile: Tile =
      selected.type === "road"
        ? { type: "road", kind: selected.kind, rot }
        : { type: "building", kind: selected.kind, rot };
    next.set(cellKey(x, y), tile);
    const ev = tile.type === "road" ? evalTile(next, x, y) : null;
    const kind = ev && ev.mismatched > 0 ? "bad" : "ok";
    set({ grid: next, feedback: { x, y, kind, at: Date.now() } });
  },
  removeTile: (x, y) => {
    const next = new Map(get().grid);
    next.delete(cellKey(x, y));
    set({ grid: next });
  },
  rotateTile: (x, y) => {
    const grid = get().grid;
    const t = grid.get(cellKey(x, y));
    if (!t) return;
    const next = new Map(grid);
    next.set(cellKey(x, y), { ...t, rot: (((t.rot + 1) % 4) as Rot) });
    const ev = evalTile(next, x, y);
    const kind = ev.mismatched > 0 ? "bad" : "ok";
    set({ grid: next, feedback: { x, y, kind, at: Date.now() } });
  },
  clearAll: () => set({ grid: new Map() }),
}));
