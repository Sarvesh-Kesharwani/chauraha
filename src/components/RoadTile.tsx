"use client";
import type { RoadKind } from "@/lib/roads";

const S = 72;
const H = S / 2;
const W = 24;

const EDGE = "#1E293B";
const ROAD = "#6B7280";
const ROAD_HI = "#9CA3AF";
const STRIPE = "#FDFDFD";
const CURB = "#F1F5F9";
const GRASS = "#86EFAC";
const GRASS_DARK = "#22C55E";
const TREE = "#15803D";
const BRIDGE_DECK = "#E5E7EB";
const BRIDGE_RAIL = "#334155";
const WATER = "#60A5FA";
const FLYOVER_DECK = "#FBBF24";
const FLYOVER_DECK_EDGE = "#B45309";
const FLYOVER_SHADOW = "rgba(0,0,0,0.22)";

const STROKE = 2.5;
const DASH = "7 5";

function StraightLane({ vertical = true }: { vertical?: boolean }) {
  const r = vertical
    ? { x: H - W / 2, y: 0, w: W, h: S }
    : { x: 0, y: H - W / 2, w: S, h: W };
  return (
    <>
      <rect x={r.x} y={r.y} width={r.w} height={r.h} fill={ROAD} stroke={EDGE} strokeWidth={STROKE} />
      {vertical ? (
        <>
          <rect x={H - W / 2 + 2} y={0} width={1.2} height={S} fill={CURB} opacity={0.55} />
          <rect x={H + W / 2 - 3.2} y={0} width={1.2} height={S} fill={CURB} opacity={0.55} />
          <line x1={H} y1={6} x2={H} y2={S - 6} stroke={STRIPE} strokeWidth={2.4} strokeDasharray={DASH} strokeLinecap="round" />
        </>
      ) : (
        <>
          <rect x={0} y={H - W / 2 + 2} width={S} height={1.2} fill={CURB} opacity={0.55} />
          <rect x={0} y={H + W / 2 - 3.2} width={S} height={1.2} fill={CURB} opacity={0.55} />
          <line x1={6} y1={H} x2={S - 6} y2={H} stroke={STRIPE} strokeWidth={2.4} strokeDasharray={DASH} strokeLinecap="round" />
        </>
      )}
    </>
  );
}

function Zebra({ x, y, w, h, bars = 4, horizontal = false }: { x: number; y: number; w: number; h: number; bars?: number; horizontal?: boolean }) {
  const rects = [];
  if (horizontal) {
    const bw = w / (bars * 2 - 1);
    for (let i = 0; i < bars; i++) rects.push(<rect key={i} x={x + i * bw * 2} y={y} width={bw} height={h} fill={STRIPE} opacity={0.9} />);
  } else {
    const bh = h / (bars * 2 - 1);
    for (let i = 0; i < bars; i++) rects.push(<rect key={i} x={x} y={y + i * bh * 2} width={w} height={bh} fill={STRIPE} opacity={0.9} />);
  }
  return <>{rects}</>;
}

export function RoadSvg({ kind }: { kind: RoadKind }) {
  switch (kind) {
    case "straight":
      return <g><StraightLane /></g>;

    case "curve": {
      const rMid = H;
      const rOut = H + W / 2;
      const rIn = H - W / 2;
      return (
        <g>
          <path d={`M ${H} 0 A ${rMid} ${rMid} 0 0 0 ${S} ${H}`} stroke={ROAD} strokeWidth={W} fill="none" strokeLinecap="butt" />
          <path d={`M ${H - W / 2} 0 A ${rOut} ${rOut} 0 0 0 ${S} ${H + W / 2}`} stroke={EDGE} strokeWidth={STROKE} fill="none" />
          <path d={`M ${H + W / 2} 0 A ${rIn} ${rIn} 0 0 0 ${S} ${H - W / 2}`} stroke={EDGE} strokeWidth={STROKE} fill="none" />
          <path d={`M ${H - W / 2 + 2} 0 A ${rOut - 2} ${rOut - 2} 0 0 0 ${S} ${H + W / 2 - 2}`} stroke={CURB} strokeWidth={1.2} opacity={0.6} fill="none" />
          <path d={`M ${H + W / 2 - 2} 0 A ${rIn + 2} ${rIn + 2} 0 0 0 ${S} ${H - W / 2 + 2}`} stroke={CURB} strokeWidth={1.2} opacity={0.6} fill="none" />
          <path d={`M ${H} 5 A ${rMid - 5} ${rMid - 5} 0 0 0 ${S - 5} ${H}`} stroke={STRIPE} strokeWidth={2.4} fill="none" strokeDasharray={DASH} strokeLinecap="round" />
        </g>
      );
    }

    case "deadend":
      return (
        <g>
          <rect x={H - W / 2 - 6} y={H - 2} width={W + 12} height={S - H + 6} fill={GRASS} />
          <rect x={H - W / 2} y={0} width={W} height={H + 6} fill={ROAD} stroke={EDGE} strokeWidth={STROKE} />
          <rect x={H - W / 2 + 2} y={0} width={1.2} height={H + 6} fill={CURB} opacity={0.55} />
          <rect x={H + W / 2 - 3.2} y={0} width={1.2} height={H + 6} fill={CURB} opacity={0.55} />
          <line x1={H} y1={6} x2={H} y2={H - 2} stroke={STRIPE} strokeWidth={2.4} strokeDasharray={DASH} strokeLinecap="round" />
          <rect x={H - W / 2 - 3} y={H - 2} width={W + 6} height={5} fill={EDGE} rx={1.5} />
          <rect x={H - W / 2 - 3} y={H - 2} width={W + 6} height={2} fill="#DC2626" rx={1.5} />
          <circle cx={H - 7} cy={S - 14} r={5} fill={TREE} stroke={EDGE} strokeWidth={1.5} />
          <circle cx={H + 7} cy={S - 14} r={5} fill={TREE} stroke={EDGE} strokeWidth={1.5} />
        </g>
      );

    case "tiraha":
      return (
        <g>
          <rect x={H - W / 2} y={0} width={W} height={S} fill={ROAD} />
          <rect x={0} y={H - W / 2} width={H + W / 2} height={W} fill={ROAD} />
          <path
            d={`M ${H - W / 2} 0 L ${H + W / 2} 0 L ${H + W / 2} ${S} L ${H - W / 2} ${S} Z M 0 ${H - W / 2} L ${H + W / 2} ${H - W / 2} L ${H + W / 2} ${H + W / 2} L 0 ${H + W / 2}`}
            fill="none"
            stroke={EDGE}
            strokeWidth={STROKE}
            strokeLinejoin="round"
          />
          <Zebra x={H - W / 2 + 2} y={H - W / 2 - 4} w={W - 4} h={3} bars={4} horizontal />
          <Zebra x={H - W / 2 + 2} y={H + W / 2 + 1} w={W - 4} h={3} bars={4} horizontal />
          <Zebra x={H + W / 2 + 1} y={H - W / 2 + 2} w={3} h={W - 4} bars={4} />
          <circle cx={H} cy={H} r={3.5} fill={STRIPE} stroke={EDGE} strokeWidth={1} />
        </g>
      );

    case "chauraha":
      return (
        <g>
          <rect x={H - W / 2} y={0} width={W} height={S} fill={ROAD} />
          <rect x={0} y={H - W / 2} width={S} height={W} fill={ROAD} />
          <path
            d={`M ${H - W / 2} 0 L ${H - W / 2} ${H - W / 2} L 0 ${H - W / 2} M ${H + W / 2} 0 L ${H + W / 2} ${H - W / 2} L ${S} ${H - W / 2} M 0 ${H + W / 2} L ${H - W / 2} ${H + W / 2} L ${H - W / 2} ${S} M ${S} ${H + W / 2} L ${H + W / 2} ${H + W / 2} L ${H + W / 2} ${S}`}
            fill="none"
            stroke={EDGE}
            strokeWidth={STROKE}
            strokeLinejoin="round"
          />
          <Zebra x={H - W / 2 + 2} y={H - W / 2 - 4} w={W - 4} h={3} bars={4} horizontal />
          <Zebra x={H - W / 2 + 2} y={H + W / 2 + 1} w={W - 4} h={3} bars={4} horizontal />
          <Zebra x={H - W / 2 - 4} y={H - W / 2 + 2} w={3} h={W - 4} bars={4} />
          <Zebra x={H + W / 2 + 1} y={H - W / 2 + 2} w={3} h={W - 4} bars={4} />
          <circle cx={H} cy={H} r={4.5} fill="#F59E0B" stroke={EDGE} strokeWidth={1.2} />
          <circle cx={H} cy={H} r={1.8} fill={EDGE} />
        </g>
      );

    case "roundabout":
      return (
        <g>
          <rect x={H - W / 2} y={0} width={W} height={S} fill={ROAD} />
          <rect x={0} y={H - W / 2} width={S} height={W} fill={ROAD} />
          <path
            d={`M ${H - W / 2} 0 L ${H - W / 2} ${H - W / 2} L 0 ${H - W / 2} M ${H + W / 2} 0 L ${H + W / 2} ${H - W / 2} L ${S} ${H - W / 2} M 0 ${H + W / 2} L ${H - W / 2} ${H + W / 2} L ${H - W / 2} ${S} M ${S} ${H + W / 2} L ${H + W / 2} ${H + W / 2} L ${H + W / 2} ${S}`}
            fill="none"
            stroke={EDGE}
            strokeWidth={STROKE}
            strokeLinejoin="round"
          />
          <circle cx={H} cy={H} r={19} fill={ROAD} stroke={EDGE} strokeWidth={STROKE} />
          <circle cx={H} cy={H} r={15} fill="none" stroke={STRIPE} strokeWidth={1.4} strokeDasharray="3 3" />
          <circle cx={H} cy={H} r={11} fill={GRASS} stroke={GRASS_DARK} strokeWidth={1.5} />
          <circle cx={H} cy={H} r={4} fill={TREE} stroke={EDGE} strokeWidth={1} />
          <circle cx={H - 1.5} cy={H - 1.5} r={1.2} fill={GRASS} />
        </g>
      );

    case "bridge":
      return (
        <g>
          <rect x={0} y={H - 14} width={S} height={28} fill={WATER} opacity={0.55} />
          <path d={`M 0 ${H - 10} Q ${H / 2} ${H - 12} ${H} ${H - 10} T ${S} ${H - 10}`} stroke={STRIPE} strokeWidth={0.8} fill="none" opacity={0.6} />
          <path d={`M 0 ${H + 10} Q ${H / 2} ${H + 12} ${H} ${H + 10} T ${S} ${H + 10}`} stroke={STRIPE} strokeWidth={0.8} fill="none" opacity={0.6} />
          <rect x={H - W / 2 - 5} y={0} width={W + 10} height={S} fill={BRIDGE_DECK} stroke={EDGE} strokeWidth={STROKE} rx={3} />
          <rect x={H - W / 2 - 5} y={0} width={2.5} height={S} fill={BRIDGE_RAIL} />
          <rect x={H + W / 2 + 2.5} y={0} width={2.5} height={S} fill={BRIDGE_RAIL} />
          <rect x={H - W / 2} y={0} width={W} height={S} fill={ROAD} />
          <rect x={H - W / 2 + 2} y={0} width={1.2} height={S} fill={CURB} opacity={0.55} />
          <rect x={H + W / 2 - 3.2} y={0} width={1.2} height={S} fill={CURB} opacity={0.55} />
          <line x1={H} y1={4} x2={H} y2={S - 4} stroke={STRIPE} strokeWidth={2.4} strokeDasharray={DASH} strokeLinecap="round" />
        </g>
      );

    case "flyover":
      return (
        <g>
          <rect x={0} y={H - W / 2} width={S} height={W} fill={ROAD} stroke={EDGE} strokeWidth={STROKE} />
          <rect x={0} y={H - W / 2 + 2} width={S} height={1.2} fill={CURB} opacity={0.55} />
          <rect x={0} y={H + W / 2 - 3.2} width={S} height={1.2} fill={CURB} opacity={0.55} />
          <line x1={6} y1={H} x2={S - 6} y2={H} stroke={STRIPE} strokeWidth={2.2} strokeDasharray={DASH} strokeLinecap="round" />
          <rect x={H - W / 2 - 5} y={H - 2} width={W + 10} height={5} fill={FLYOVER_SHADOW} />
          <rect x={H - W / 2 - 5} y={-2} width={W + 10} height={S + 4} fill={FLYOVER_DECK} stroke={EDGE} strokeWidth={STROKE} rx={4} />
          <rect x={H - W / 2 - 5} y={-2} width={W + 10} height={5} fill={FLYOVER_DECK_EDGE} opacity={0.8} rx={4} />
          <rect x={H - W / 2 + 1} y={0} width={W - 2} height={S} fill={ROAD} rx={1} />
          <line x1={H} y1={5} x2={H} y2={S - 5} stroke={STRIPE} strokeWidth={2.4} strokeDasharray={DASH} strokeLinecap="round" />
        </g>
      );

    case "flyover_straight":
      return (
        <g>
          <ellipse cx={H - W / 2 - 6} cy={10} rx={5} ry={2} fill={FLYOVER_SHADOW} />
          <ellipse cx={H + W / 2 + 6} cy={10} rx={5} ry={2} fill={FLYOVER_SHADOW} />
          <ellipse cx={H - W / 2 - 6} cy={S - 10} rx={5} ry={2} fill={FLYOVER_SHADOW} />
          <ellipse cx={H + W / 2 + 6} cy={S - 10} rx={5} ry={2} fill={FLYOVER_SHADOW} />
          <rect x={H - W / 2 - 5} y={-2} width={W + 10} height={S + 4} fill={FLYOVER_DECK} stroke={EDGE} strokeWidth={STROKE} rx={5} />
          <rect x={H - W / 2 - 5} y={-2} width={W + 10} height={5} fill={FLYOVER_DECK_EDGE} opacity={0.8} rx={5} />
          <rect x={H - W / 2 + 1} y={0} width={W - 2} height={S} fill={ROAD} rx={1} />
          <rect x={H - W / 2 + 2} y={0} width={1} height={S} fill={CURB} opacity={0.5} />
          <rect x={H + W / 2 - 3} y={0} width={1} height={S} fill={CURB} opacity={0.5} />
          <line x1={H} y1={6} x2={H} y2={S - 6} stroke={STRIPE} strokeWidth={2.4} strokeDasharray={DASH} strokeLinecap="round" />
        </g>
      );

    case "flyover_curve": {
      const rMid = H;
      const rOut = H + W / 2 + 5;
      const rIn = H - W / 2 - 5;
      const rRoadOut = H + W / 2;
      const rRoadIn = H - W / 2;
      return (
        <g>
          <path d={`M ${H} -2 A ${rMid} ${rMid} 0 0 0 ${S + 2} ${H}`} stroke={FLYOVER_SHADOW} strokeWidth={W + 14} fill="none" transform="translate(0 3)" opacity={0.35} />
          <path d={`M ${H} -2 A ${rMid} ${rMid} 0 0 0 ${S + 2} ${H}`} stroke={FLYOVER_DECK} strokeWidth={W + 10} fill="none" />
          <path d={`M ${H - W / 2 - 5} 0 A ${rOut} ${rOut} 0 0 0 ${S} ${H + W / 2 + 5}`} stroke={EDGE} strokeWidth={STROKE} fill="none" />
          <path d={`M ${H + W / 2 + 5} 0 A ${rIn} ${rIn} 0 0 0 ${S} ${H - W / 2 - 5}`} stroke={EDGE} strokeWidth={STROKE} fill="none" />
          <path d={`M ${H - W / 2 - 5} 0 A ${rOut} ${rOut} 0 0 0 ${S} ${H + W / 2 + 5}`} stroke={FLYOVER_DECK_EDGE} strokeWidth={2} fill="none" opacity={0.7} />
          <path d={`M ${H} 0 A ${rMid} ${rMid} 0 0 0 ${S} ${H}`} stroke={ROAD} strokeWidth={W - 2} fill="none" strokeLinecap="butt" />
          <path d={`M ${H - W / 2} 0 A ${rRoadOut} ${rRoadOut} 0 0 0 ${S} ${H + W / 2}`} stroke={EDGE} strokeWidth={1} fill="none" opacity={0.5} />
          <path d={`M ${H + W / 2} 0 A ${rRoadIn} ${rRoadIn} 0 0 0 ${S} ${H - W / 2}`} stroke={EDGE} strokeWidth={1} fill="none" opacity={0.5} />
          <path d={`M ${H} 6 A ${rMid - 6} ${rMid - 6} 0 0 0 ${S - 6} ${H}`} stroke={STRIPE} strokeWidth={2.2} fill="none" strokeDasharray={DASH} strokeLinecap="round" />
        </g>
      );
    }
  }
}

export function RoadTile({ kind, rot, size = S, outline }: { kind: RoadKind; rot: 0 | 1 | 2 | 3; size?: number; outline?: "ok" | "bad" | "hover" | "named" | null }) {
  const outlineColor =
    outline === "ok" ? "#10B981" : outline === "bad" ? "#EF4444" : outline === "hover" ? "#F59E0B" : outline === "named" ? "#A855F7" : null;
  return (
    <svg width={size} height={size} viewBox={`0 0 ${S} ${S}`} style={{ display: "block" }}>
      <g transform={`rotate(${rot * 90} ${H} ${H})`}>
        <RoadSvg kind={kind} />
      </g>
      {outlineColor && (
        <rect x={1} y={1} width={S - 2} height={S - 2} fill="none" stroke={outlineColor} strokeWidth={3} rx={6} style={{ pointerEvents: "none" }} />
      )}
      {outline === "named" && <circle cx={60} cy={12} r={5} fill="#FDE047" stroke="#0F172A" strokeWidth={1.5} />}
      <title>{kind}</title>
    </svg>
  );
}

export const TILE_SIZE = S;
