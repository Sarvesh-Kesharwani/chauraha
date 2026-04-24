"use client";
import type { RoadKind } from "@/lib/roads";

const S = 72;
const H = S / 2;
const W = 22;
const EDGE = "#111827";
const ROAD = "#2D3748";
const STRIPE = "#FACC15";
const GRASS = "#DCE8D3";
const ELEV = "#4C1D95";

function Asphalt({ d }: { d: string }) {
  return (
    <>
      <path d={d} fill={ROAD} stroke={EDGE} strokeWidth={2} strokeLinejoin="round" />
    </>
  );
}

export function RoadSvg({ kind }: { kind: RoadKind }) {
  switch (kind) {
    case "straight":
      return (
        <g>
          <rect x={H - W / 2} y={0} width={W} height={S} fill={ROAD} stroke={EDGE} strokeWidth={2} />
          <line x1={H} y1={8} x2={H} y2={S - 8} stroke={STRIPE} strokeWidth={2} strokeDasharray="6 5" />
        </g>
      );
    case "curve":
      return (
        <g>
          <path d={`M ${H - W / 2} 0 L ${H + W / 2} 0 A ${S - (H - W / 2)} ${S - (H - W / 2)} 0 0 1 ${S} ${H + W / 2} L ${S} ${H - W / 2} A ${H - W / 2} ${H - W / 2} 0 0 0 ${H + W / 2} 0 Z`} fill={ROAD} stroke={EDGE} strokeWidth={2} />
          <path d={`M ${H} 6 A ${S - H} ${S - H} 0 0 1 ${S - 6} ${H}`} stroke={STRIPE} strokeWidth={2} fill="none" strokeDasharray="6 5" />
        </g>
      );
    case "deadend":
      return (
        <g>
          <rect x={H - W / 2} y={0} width={W} height={H + 4} fill={ROAD} stroke={EDGE} strokeWidth={2} />
          <circle cx={H} cy={H + 4} r={W / 2 + 2} fill={ROAD} stroke={EDGE} strokeWidth={2} />
          <line x1={H} y1={6} x2={H} y2={H - 4} stroke={STRIPE} strokeWidth={2} strokeDasharray="6 4" />
          <text x={H} y={S - 10} textAnchor="middle" fontSize="10" fill="#fff" fontWeight={700}>STOP</text>
        </g>
      );
    case "tiraha":
      return (
        <g>
          <rect x={H - W / 2} y={0} width={W} height={S} fill={ROAD} stroke={EDGE} strokeWidth={2} />
          <rect x={0} y={H - W / 2} width={H + W / 2} height={W} fill={ROAD} stroke={EDGE} strokeWidth={2} />
          <rect x={H - W / 2 + 1} y={H - W / 2 + 1} width={W - 2} height={W - 2} fill={ROAD} />
          <circle cx={H} cy={H} r={3} fill={STRIPE} />
          <text x={H + 2} y={12} fontSize="7" fill="#fff" fontWeight={700} opacity={0.8}>T</text>
        </g>
      );
    case "chauraha":
      return (
        <g>
          <rect x={H - W / 2} y={0} width={W} height={S} fill={ROAD} stroke={EDGE} strokeWidth={2} />
          <rect x={0} y={H - W / 2} width={S} height={W} fill={ROAD} stroke={EDGE} strokeWidth={2} />
          <rect x={H - W / 2 + 1} y={H - W / 2 + 1} width={W - 2} height={W - 2} fill={ROAD} />
          <circle cx={H} cy={H} r={4} fill={STRIPE} />
          <circle cx={H} cy={H} r={2} fill={EDGE} />
        </g>
      );
    case "roundabout":
      return (
        <g>
          <rect x={H - W / 2} y={0} width={W} height={S} fill={ROAD} stroke={EDGE} strokeWidth={2} />
          <rect x={0} y={H - W / 2} width={S} height={W} fill={ROAD} stroke={EDGE} strokeWidth={2} />
          <circle cx={H} cy={H} r={18} fill={ROAD} stroke={EDGE} strokeWidth={2} />
          <circle cx={H} cy={H} r={10} fill={GRASS} stroke="#6E8B5A" strokeWidth={1.5} />
          <circle cx={H} cy={H} r={4} fill="#8FB46A" />
        </g>
      );
    case "bridge":
      return (
        <g>
          <rect x={0} y={H - 4} width={S} height={8} fill="#94A3B8" opacity={0.35} />
          <rect x={H - W / 2} y={0} width={W} height={S} fill={ROAD} stroke={EDGE} strokeWidth={2} />
          <line x1={H - W / 2} y1={0} x2={H - W / 2} y2={S} stroke="#E5E7EB" strokeWidth={1.5} strokeDasharray="3 3" />
          <line x1={H + W / 2} y1={0} x2={H + W / 2} y2={S} stroke="#E5E7EB" strokeWidth={1.5} strokeDasharray="3 3" />
          <line x1={H} y1={8} x2={H} y2={S - 8} stroke={STRIPE} strokeWidth={2} strokeDasharray="6 5" />
        </g>
      );
    case "flyover":
      return (
        <g>
          <rect x={0} y={H - W / 2} width={S} height={W} fill={ROAD} stroke={EDGE} strokeWidth={2} />
          <line x1={8} y1={H} x2={S - 8} y2={H} stroke={STRIPE} strokeWidth={2} strokeDasharray="6 5" />
          <rect x={H - W / 2 - 3} y={-2} width={W + 6} height={S + 4} fill={ELEV} stroke={EDGE} strokeWidth={2} rx={4} />
          <rect x={H - W / 2} y={0} width={W} height={S} fill={ROAD} />
          <line x1={H} y1={6} x2={H} y2={S - 6} stroke={STRIPE} strokeWidth={2} strokeDasharray="6 5" />
        </g>
      );
  }
}

export function RoadTile({ kind, rot, size = S, outline }: { kind: RoadKind; rot: 0 | 1 | 2 | 3; size?: number; outline?: "ok" | "bad" | "hover" | null }) {
  const scale = size / S;
  const outlineColor =
    outline === "ok" ? "#10B981" : outline === "bad" ? "#EF4444" : outline === "hover" ? "#F59E0B" : null;
  return (
    <svg width={size} height={size} viewBox={`0 0 ${S} ${S}`} style={{ display: "block" }}>
      <g transform={`rotate(${rot * 90} ${H} ${H})`}>
        <RoadSvg kind={kind} />
      </g>
      {outlineColor && (
        <rect x={1} y={1} width={S - 2} height={S - 2} fill="none" stroke={outlineColor} strokeWidth={3} rx={6} style={{ pointerEvents: "none" }} />
      )}
      <title>{kind}</title>
      {scale !== 1 && null}
    </svg>
  );
}

export const TILE_SIZE = S;
