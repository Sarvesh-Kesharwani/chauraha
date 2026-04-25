"use client";
import { create } from "zustand";
import { cellKey, evalTile, type GridMap, type Rot, type Tile } from "@/lib/grid";
import type { RoadKind } from "@/lib/roads";
import type { BuildingKind } from "@/lib/buildings";
import type { WaterKind } from "@/lib/water";

export type Feedback = { x: number; y: number; kind: "ok" | "bad"; at: number } | null;
export type FocusTarget = { x: number; y: number } | null;
export type SelectedTool =
  | { type: "road"; kind: RoadKind }
  | { type: "building"; kind: BuildingKind }
  | { type: "water"; kind: WaterKind };

export type MapEntry = { id: string; name: string; grid: GridMap };

export type SerializedMapEntry = { id: string; name: string; gridEntries: Array<[string, Tile]> };

export type GameSnapshot = {
  gridEntries: Array<[string, Tile]>;
  selected: SelectedTool | null;
  rot: Rot;
  maps?: SerializedMapEntry[];
  activeMapId?: string;
};

function makeId() {
  return Math.random().toString(36).slice(2, 9);
}

const DEFAULT_MAP: MapEntry = { id: "default", name: "My City", grid: new Map() };

type State = {
  maps: MapEntry[];
  activeMapId: string;
  grid: GridMap;
  selected: SelectedTool | null;
  rot: Rot;
  feedback: Feedback;
  focusTarget: FocusTarget;
  setFocusTarget: (t: FocusTarget) => void;
  placeTile: (x: number, y: number) => void;
  removeTile: (x: number, y: number) => void;
  rotateTile: (x: number, y: number) => void;
  renameTile: (x: number, y: number, name: string) => void;
  setSelected: (tool: SelectedTool | null) => void;
  cycleRot: () => void;
  clearAll: () => void;
  hydrateSnapshot: (snapshot: GameSnapshot) => void;
  addMap: (name: string) => void;
  deleteMap: (id: string) => void;
  renameMap: (id: string, name: string) => void;
  switchMap: (id: string) => void;
  logout: () => void;
};

function syncGrid(maps: MapEntry[], activeMapId: string, grid: GridMap): MapEntry[] {
  return maps.map((m) => (m.id === activeMapId ? { ...m, grid: new Map(grid) } : m));
}

export const useGame = create<State>((set, get) => ({
  maps: [DEFAULT_MAP],
  activeMapId: DEFAULT_MAP.id,
  grid: new Map(),
  selected: { type: "road", kind: "straight" },
  rot: 0,
  feedback: null,
  focusTarget: null,

  setSelected: (k) => set({ selected: k }),
  setFocusTarget: (t) => set({ focusTarget: t }),
  cycleRot: () => set((s) => ({ rot: (((s.rot + 1) % 4) as Rot) })),

  placeTile: (x, y) => {
    const { selected, rot, grid, maps, activeMapId } = get();
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
    set({ grid: next, feedback: { x, y, kind, at: Date.now() }, maps: syncGrid(maps, activeMapId, next) });
  },

  removeTile: (x, y) => {
    const { grid, maps, activeMapId } = get();
    const next = new Map(grid);
    next.delete(cellKey(x, y));
    set({ grid: next, maps: syncGrid(maps, activeMapId, next) });
  },

  rotateTile: (x, y) => {
    const { grid, maps, activeMapId } = get();
    const t = grid.get(cellKey(x, y));
    if (!t) return;
    const next = new Map(grid);
    next.set(cellKey(x, y), { ...t, rot: (((t.rot + 1) % 4) as Rot) });
    const ev = t.type === "road" ? evalTile(next, x, y) : null;
    const kind = ev && ev.mismatched > 0 ? "bad" : "ok";
    set({ grid: next, feedback: { x, y, kind, at: Date.now() }, maps: syncGrid(maps, activeMapId, next) });
  },

  renameTile: (x, y, name) => {
    const { grid, maps, activeMapId } = get();
    const t = grid.get(cellKey(x, y));
    if (!t) return;
    const next = new Map(grid);
    const cleanName = name.trim();
    next.set(cellKey(x, y), { ...t, name: cleanName || undefined });
    set({ grid: next, maps: syncGrid(maps, activeMapId, next) });
  },

  clearAll: () => {
    const { maps, activeMapId } = get();
    const empty: GridMap = new Map();
    set({ grid: empty, maps: syncGrid(maps, activeMapId, empty) });
  },

  hydrateSnapshot: (snapshot) => {
    if (snapshot.maps && snapshot.maps.length > 0) {
      const restoredMaps: MapEntry[] = snapshot.maps.map((m) => ({
        id: m.id,
        name: m.name,
        grid: new Map(m.gridEntries),
      }));
      const activeId = snapshot.activeMapId ?? restoredMaps[0].id;
      const activeMap = restoredMaps.find((m) => m.id === activeId) ?? restoredMaps[0];
      set({
        maps: restoredMaps,
        activeMapId: activeId,
        grid: new Map(activeMap.grid),
        selected: snapshot.selected,
        rot: snapshot.rot,
        feedback: null,
      });
    } else {
      const newGrid = new Map(snapshot.gridEntries);
      const { maps, activeMapId } = get();
      set({
        grid: newGrid,
        selected: snapshot.selected,
        rot: snapshot.rot,
        feedback: null,
        maps: syncGrid(maps, activeMapId, newGrid),
      });
    }
  },

  addMap: (name) => {
    const { maps, activeMapId, grid } = get();
    const saved = syncGrid(maps, activeMapId, grid);
    const newMap: MapEntry = { id: makeId(), name, grid: new Map() };
    set({ maps: [...saved, newMap], activeMapId: newMap.id, grid: new Map() });
  },

  deleteMap: (id) => {
    const { maps, activeMapId, grid } = get();
    if (maps.length <= 1) return;
    const saved = syncGrid(maps, activeMapId, grid).filter((m) => m.id !== id);
    if (id === activeMapId) {
      const next = saved[0];
      set({ maps: saved, activeMapId: next.id, grid: new Map(next.grid) });
    } else {
      set({ maps: saved });
    }
  },

  renameMap: (id, name) => {
    const { maps, activeMapId, grid } = get();
    const saved = syncGrid(maps, activeMapId, grid).map((m) => (m.id === id ? { ...m, name } : m));
    set({ maps: saved });
  },

  switchMap: (id) => {
    const { maps, activeMapId, grid } = get();
    if (id === activeMapId) return;
    const saved = syncGrid(maps, activeMapId, grid);
    const target = saved.find((m) => m.id === id);
    if (!target) return;
    set({ maps: saved, activeMapId: id, grid: new Map(target.grid) });
  },

  logout: () => {
    if (typeof window !== "undefined") {
      window.localStorage.removeItem("chowkcraft_local_progress");
      window.sessionStorage.removeItem("chowkcraft_drive_pulled");
    }
    const fresh: MapEntry = { id: "default", name: "My City", grid: new Map() };
    set({ maps: [fresh], activeMapId: fresh.id, grid: new Map(), selected: { type: "road", kind: "straight" }, rot: 0, feedback: null });
  },
}));

export function serializeGameSnapshot(state: Pick<State, "grid" | "selected" | "rot" | "maps" | "activeMapId">): string {
  const snapshot: GameSnapshot = {
    gridEntries: [...state.grid.entries()],
    selected: state.selected,
    rot: state.rot,
    maps: state.maps.map((m) => ({ id: m.id, name: m.name, gridEntries: [...m.grid.entries()] })),
    activeMapId: state.activeMapId,
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
      maps: parsed.maps,
      activeMapId: parsed.activeMapId,
    };
  } catch {
    return null;
  }
}
