"use client";
import { create } from "zustand";
import { cellKey, evalTile, type GridMap, type Rot, type Tile } from "@/lib/grid";
import type { RoadKind } from "@/lib/roads";
import type { BuildingKind } from "@/lib/buildings";
import type { WaterKind } from "@/lib/water";

export type Feedback = { x: number; y: number; kind: "ok" | "bad"; at: number } | null;
export type SelectedTool =
  | { type: "road"; kind: RoadKind }
  | { type: "building"; kind: BuildingKind }
  | { type: "water"; kind: WaterKind };

export type GameSnapshot = {
  gridEntries: Array<[string, Tile]>;
  selected: SelectedTool | null;
  rot: Rot;
};

type State = {
  grid: GridMap;
  selected: SelectedTool | null;
  rot: Rot;
  feedback: Feedback;
  placeTile: (x: number, y: number) => void;
  removeTile: (x: number, y: number) => void;
  rotateTile: (x: number, y: number) => void;
  renameTile: (x: number, y: number, name: string) => void;
  setSelected: (tool: SelectedTool | null) => void;
  cycleRot: () => void;
  clearAll: () => void;
  hydrateSnapshot: (snapshot: GameSnapshot) => void;
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
        : selected.type === "building"
          ? { type: "building", kind: selected.kind, rot }
          : { type: "water", kind: selected.kind, rot };
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
  renameTile: (x, y, name) => {
    const grid = get().grid;
    const t = grid.get(cellKey(x, y));
    if (!t) return;
    const next = new Map(grid);
    const cleanName = name.trim();
    next.set(cellKey(x, y), { ...t, name: cleanName || undefined });
    set({ grid: next });
  },
  clearAll: () => set({ grid: new Map() }),
  hydrateSnapshot: (snapshot) =>
    set({
      grid: new Map(snapshot.gridEntries),
      selected: snapshot.selected,
      rot: snapshot.rot,
      feedback: null,
    }),
}));

export function serializeGameSnapshot(state: Pick<State, "grid" | "selected" | "rot">): string {
  const snapshot: GameSnapshot = {
    gridEntries: [...state.grid.entries()],
    selected: state.selected,
    rot: state.rot,
  };
  return JSON.stringify(snapshot);
}

export function parseGameSnapshot(raw: string): GameSnapshot | null {
  try {
    const parsed = JSON.parse(raw) as Partial<GameSnapshot>;
    if (!parsed || !Array.isArray(parsed.gridEntries)) return null;
    return {
      gridEntries: parsed.gridEntries as Array<[string, Tile]>,
      selected: parsed.selected ?? { type: "road", kind: "straight" },
      rot: (parsed.rot ?? 0) as Rot,
    };
  } catch {
    return null;
  }
}
