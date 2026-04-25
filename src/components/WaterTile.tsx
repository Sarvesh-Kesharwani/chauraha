"use client";
import type { WaterKind } from "@/lib/water";

const S = 72;
const H = S / 2;
const EDGE = "#0F172A";
const DEEP = "#0284C7";
const MID = "#38BDF8";
const SHALLOW = "#BAE6FD";
const FOAM = "#F8FAFC";
const BANK = "#C2410C";
const STONE = "#CBD5E1";
const LEAF = "#16A34A";

function WaterPath({ d, width }: { d: string; width: number }) {
  return (
    <>
      <path d={d} stroke={DEEP} strokeWidth={width} fill="none" strokeLinecap="round" strokeLinejoin="round" />
      <path d={d} stroke={MID} strokeWidth={width - 6} fill="none" strokeLinecap="round" strokeLinejoin="round" />
      <path d={d} stroke={SHALLOW} strokeWidth={width - 14} fill="none" strokeLinecap="round" strokeLinejoin="round" opacity={0.95} />
      <path d={d} stroke={FOAM} strokeWidth={2.5} fill="none" strokeLinecap="round" strokeLinejoin="round" strokeDasharray="7 8" opacity={0.7} />
    </>
  );
}

function CanalEnd() {
  return (
    <g>
      <WaterPath d={`M ${H} 0 L ${H} ${H + 8}`} width={20} />
      <path d={`M ${H - 10} ${H + 6} Q ${H} ${S - 2} ${H + 10} ${H + 6}`} fill={MID} stroke={EDGE} strokeWidth={2} />
      <path d={`M ${H - 14} ${H + 10} Q ${H} ${S - 8} ${H + 14} ${H + 10}`} stroke={BANK} strokeWidth={2.5} fill="none" strokeLinecap="round" />
      <circle cx={H - 16} cy={S - 12} r={4} fill={LEAF} />
      <circle cx={H + 16} cy={S - 13} r={3.6} fill={LEAF} />
    </g>
  );
}

function Ghat() {
  return (
    <g>
      <WaterPath d={`M 6 ${H} L ${S - 6} ${H}`} width={28} />
      {[0, 1, 2, 3].map((i) => (
        <rect key={i} x={18 + i * 8} y={H + 4 + i * 3} width={36 - i * 6} height={4} rx={1} fill={STONE} stroke={EDGE} strokeWidth={1} />
      ))}
      <path d={`M 18 ${H + 7} H 54`} stroke={BANK} strokeWidth={2} strokeLinecap="round" />
    </g>
  );
}

function Pond() {
  return (
    <g>
      <path d="M17 19 C25 8 49 8 57 20 C66 32 63 51 48 58 C32 66 15 58 10 42 C7 33 10 25 17 19 Z" fill={MID} stroke={EDGE} strokeWidth={2.4} />
      <path d="M21 23 C29 15 47 15 54 24 C59 31 57 46 46 52 C33 59 18 51 15 40 C13 33 15 28 21 23 Z" fill={SHALLOW} opacity={0.95} />
      <path d="M21 23 C30 19 42 20 50 27" stroke={FOAM} strokeWidth={2.2} fill="none" strokeLinecap="round" />
      <circle cx="20" cy="51" r="5" fill={LEAF} />
      <circle cx="54" cy="18" r="4" fill={LEAF} />
    </g>
  );
}

function WaterArt({ kind }: { kind: WaterKind }) {
  switch (kind) {
    case "canal_straight":
      return <WaterPath d={`M ${H} 0 L ${H} ${S}`} width={20} />;
    case "canal_curve":
      return <WaterPath d={`M ${H} 0 Q ${H} ${H} ${S} ${H}`} width={20} />;
    case "canal_t":
      return (
        <g>
          <WaterPath d={`M ${H} 0 L ${H} ${S}`} width={20} />
          <WaterPath d={`M 0 ${H} L ${H} ${H}`} width={20} />
        </g>
      );
    case "canal_cross":
      return (
        <g>
          <WaterPath d={`M ${H} 0 L ${H} ${S}`} width={20} />
          <WaterPath d={`M 0 ${H} L ${S} ${H}`} width={20} />
        </g>
      );
    case "canal_end":
      return <CanalEnd />;
    case "river_straight":
      return <WaterPath d={`M ${H - 4} -2 C ${H - 12} 20 ${H + 12} 48 ${H - 3} ${S + 2}`} width={30} />;
    case "river_curve":
      return <WaterPath d={`M ${H - 3} -2 C ${H - 10} 18 ${H + 6} 34 ${S + 2} ${H + 2}`} width={30} />;
    case "pond":
      return <Pond />;
    case "ghat":
      return <Ghat />;
  }
}

export function WaterTile({ kind, rot, size = S, outline }: { kind: WaterKind; rot: 0 | 1 | 2 | 3; size?: number; outline?: "ok" | "bad" | "hover" | "named" | null }) {
  const outlineColor =
    outline === "ok"
      ? "#10B981"
      : outline === "bad"
        ? "#EF4444"
        : outline === "hover"
          ? "#F59E0B"
          : outline === "named"
            ? "#A855F7"
            : null;
  return (
    <svg width={size} height={size} viewBox={`0 0 ${S} ${S}`} style={{ display: "block" }}>
      <g transform={`rotate(${rot * 90} ${H} ${H})`}>
        <WaterArt kind={kind} />
      </g>
      {outlineColor && <rect x={1} y={1} width={S - 2} height={S - 2} fill="none" stroke={outlineColor} strokeWidth={3} rx={6} style={{ pointerEvents: "none" }} />}
      {outline === "named" && <circle cx={60} cy={12} r={5} fill="#FDE047" stroke="#0F172A" strokeWidth={1.5} />}
      <title>{kind}</title>
    </svg>
  );
}
