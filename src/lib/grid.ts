import { DIR_DELTA, DIRS, OPPOSITE, hasConnector, type Dir, type RoadKind, ROADS } from "./roads";

export type Rot = 0 | 1 | 2 | 3;
export type Tile = { kind: RoadKind; rot: Rot };
export type GridMap = Map<string, Tile>;

export const cellKey = (x: number, y: number) => `${x},${y}`;
export const parseKey = (k: string): [number, number] => {
  const [x, y] = k.split(",").map(Number);
  return [x, y];
};

export type ConnectionResult = {
  connectedSides: Record<Dir, boolean>;
  openEnds: number;
  mismatched: number;
};

export function evalTile(grid: GridMap, x: number, y: number): ConnectionResult {
  const tile = grid.get(cellKey(x, y));
  const res: ConnectionResult = { connectedSides: { 0: false, 1: false, 2: false, 3: false }, openEnds: 0, mismatched: 0 };
  if (!tile) return res;
  for (const d of DIRS) {
    if (!hasConnector(tile.kind, tile.rot, d)) continue;
    const { dx, dy } = DIR_DELTA[d];
    const neighbor = grid.get(cellKey(x + dx, y + dy));
    if (!neighbor) {
      res.openEnds++;
      continue;
    }
    const back = OPPOSITE[d];
    const matches = hasConnector(neighbor.kind, neighbor.rot, back);
    if (matches) res.connectedSides[d] = true;
    else res.mismatched++;
  }
  return res;
}

export type ScoreBreakdown = {
  tiles: number;
  connectedTiles: number;
  openEnds: number;
  mismatched: number;
  loops: number;
  bonusDiversity: number;
  total: number;
};

export function scoreGrid(grid: GridMap): ScoreBreakdown {
  let connected = 0;
  let open = 0;
  let mis = 0;
  const kinds = new Set<RoadKind>();
  for (const [k, t] of grid) {
    const [x, y] = parseKey(k);
    const ev = evalTile(grid, x, y);
    if (Object.values(ev.connectedSides).some(Boolean)) connected++;
    open += ev.openEnds;
    mis += ev.mismatched;
    kinds.add(t.kind);
  }
  const loops = countLoops(grid);
  const diversity = kinds.size;
  const bonusDiversity = diversity * 10;
  const total = connected * 20 + loops * 50 + bonusDiversity - mis * 15 - open * 2;
  return { tiles: grid.size, connectedTiles: connected, openEnds: open, mismatched: mis, loops, bonusDiversity, total: Math.max(0, total) };
}

function countLoops(grid: GridMap): number {
  const visited = new Set<string>();
  let loops = 0;
  for (const k of grid.keys()) {
    if (visited.has(k)) continue;
    const { nodes, edges } = bfsComponent(grid, k, visited);
    if (edges >= nodes && nodes >= 3) loops += edges - nodes + 1;
  }
  return loops;
}

function bfsComponent(grid: GridMap, start: string, visited: Set<string>) {
  const queue = [start];
  let nodes = 0;
  let edges = 0;
  while (queue.length) {
    const cur = queue.shift()!;
    if (visited.has(cur)) continue;
    visited.add(cur);
    nodes++;
    const [x, y] = parseKey(cur);
    const t = grid.get(cur)!;
    for (const d of DIRS) {
      if (!hasConnector(t.kind, t.rot, d)) continue;
      const { dx, dy } = DIR_DELTA[d];
      const nk = cellKey(x + dx, y + dy);
      const n = grid.get(nk);
      if (!n) continue;
      if (!hasConnector(n.kind, n.rot, OPPOSITE[d])) continue;
      edges++;
      if (!visited.has(nk)) queue.push(nk);
    }
  }
  return { nodes, edges: Math.floor(edges / 2) };
}

export const KINDS_HINDI = Object.fromEntries(
  Object.entries(ROADS).map(([k, v]) => [k, v.hindi]),
) as Record<RoadKind, string>;
