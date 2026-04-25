export type WaterKind =
  | "canal_straight"
  | "canal_curve"
  | "canal_t"
  | "canal_cross"
  | "canal_end"
  | "river_straight"
  | "river_curve"
  | "pond"
  | "ghat";

export type WaterDef = {
  kind: WaterKind;
  label: string;
  hindi: string;
  rotatable: boolean;
  family: "canal" | "river" | "waterbody";
};

export const WATERS: Record<WaterKind, WaterDef> = {
  canal_straight: { kind: "canal_straight", label: "Canal", hindi: "Nahar", rotatable: true, family: "canal" },
  canal_curve: { kind: "canal_curve", label: "Canal Curve", hindi: "Mudi Nahar", rotatable: true, family: "canal" },
  canal_t: { kind: "canal_t", label: "Canal T", hindi: "Nahar Tiraha", rotatable: true, family: "canal" },
  canal_cross: { kind: "canal_cross", label: "Canal Cross", hindi: "Nahar Chauraha", rotatable: false, family: "canal" },
  canal_end: { kind: "canal_end", label: "Drain End", hindi: "Nali Ant", rotatable: true, family: "canal" },
  river_straight: { kind: "river_straight", label: "River", hindi: "Nadi", rotatable: true, family: "river" },
  river_curve: { kind: "river_curve", label: "River Bend", hindi: "Nadi Mod", rotatable: true, family: "river" },
  pond: { kind: "pond", label: "Pond / Lake", hindi: "Talab", rotatable: false, family: "waterbody" },
  ghat: { kind: "ghat", label: "Ghat", hindi: "Ghat", rotatable: true, family: "waterbody" },
};

export const WATER_ORDER: WaterKind[] = [
  "canal_straight",
  "canal_curve",
  "canal_t",
  "canal_cross",
  "canal_end",
  "river_straight",
  "river_curve",
  "pond",
  "ghat",
];
