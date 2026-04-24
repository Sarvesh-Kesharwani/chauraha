"use client";
import { create } from "zustand";
import { cellKey, type GridMap, type Rot, type Tile } from "@/lib/grid";
import type { RoadKind } from "@/lib/roads";

export type Feedback = { x: number; y: number; kind: "ok" | "bad"; at: number } | null;

type State = {
  grid: GridMap;
  selected: RoadKind | null;
  rot: Rot;
  feedback: Feedback;
  placeTile: (x: number, y: number) => void;
  removeTile: (x: number, y: number) => void;
  rotateTile: (x: number, y: number) => void;
  setSelected: (k: RoadKind | null) => void;
  cycleRot: () => void;
  clearAll: () => void;
};

export const useGame = create<State>((set, get) => ({
  grid: new Map(),
  selected: "straight",
  rot: 0,
  feedback: null,
  setSelected: (k) => set({ selected: k }),
  cycleRot: () => set((s) => ({ rot: (((s.rot + 1) % 4) as Rot) })),
  placeTile: (x, y) => {
    const { selected, rot, grid } = get();
    if (!selected) return;
    const next = new Map(grid);
    const tile: Tile = { kind: selected, rot };
    next.set(cellKey(x, y), tile);
    set({ grid: next, feedback: { x, y, kind: "ok", at: Date.now() } });
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
    set({ grid: next, feedback: { x, y, kind: "ok", at: Date.now() } });
  },
  clearAll: () => set({ grid: new Map() }),
}));
