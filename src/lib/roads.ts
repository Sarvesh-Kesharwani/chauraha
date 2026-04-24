export type RoadKind =
  | "straight"
  | "curve"
  | "deadend"
  | "tiraha"
  | "chauraha"
  | "roundabout"
  | "bridge"
  | "flyover";

export type Dir = 0 | 1 | 2 | 3;
export const DIRS: Dir[] = [0, 1, 2, 3];
export const DIR_DELTA: Record<Dir, { dx: number; dy: number }> = {
  0: { dx: 0, dy: -1 },
  1: { dx: 1, dy: 0 },
  2: { dx: 0, dy: 1 },
  3: { dx: -1, dy: 0 },
};
export const OPPOSITE: Record<Dir, Dir> = { 0: 2, 1: 3, 2: 0, 3: 1 };

export type Connectors = [boolean, boolean, boolean, boolean];

export type RoadDef = {
  kind: RoadKind;
  label: string;
  hindi: string;
  base: Connectors;
  rotatable: boolean;
  elevated?: boolean;
};

export const ROADS: Record<RoadKind, RoadDef> = {
  straight:   { kind: "straight",   label: "Straight",      hindi: "Seedhi Sadak",    base: [true, false, true, false],  rotatable: true },
  curve:      { kind: "curve",      label: "Curve",         hindi: "Mod",             base: [true, true, false, false],  rotatable: true },
  deadend:    { kind: "deadend",    label: "Dead End",      hindi: "Band Gali",       base: [true, false, false, false], rotatable: true },
  tiraha:     { kind: "tiraha",     label: "Tiraha (3-way)",hindi: "Tiraha",          base: [true, true, false, true],   rotatable: true },
  chauraha:   { kind: "chauraha",   label: "Chauraha (4-way)",hindi: "Chauraha",      base: [true, true, true, true],    rotatable: false },
  roundabout: { kind: "roundabout", label: "Roundabout",    hindi: "Gol Chakkar",     base: [true, true, true, true],    rotatable: false },
  bridge:     { kind: "bridge",     label: "Bridge",        hindi: "Pul",             base: [true, false, true, false],  rotatable: true, elevated: true },
  flyover:    { kind: "flyover",    label: "Flyover",       hindi: "Uparigami Pul",   base: [true, true, true, true],    rotatable: true, elevated: true },
};

export const ROAD_ORDER: RoadKind[] = [
  "straight","curve","tiraha","chauraha","roundabout","deadend","bridge","flyover",
];

export function rotatedConnectors(kind: RoadKind, rot: 0 | 1 | 2 | 3): Connectors {
  const base = ROADS[kind].base;
  const out: Connectors = [false, false, false, false];
  for (let i = 0; i < 4; i++) out[(i + rot) % 4] = base[i];
  return out;
}

export function hasConnector(kind: RoadKind, rot: 0 | 1 | 2 | 3, dir: Dir): boolean {
  return rotatedConnectors(kind, rot)[dir];
}
