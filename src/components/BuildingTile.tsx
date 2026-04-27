"use client";
import { useId } from "react";
import { BUILDINGS, type BuildingKind } from "@/lib/buildings";

const S = 72;
const EDGE = "#1E293B";
const WHITE = "#FFFFFF";
const GLASS = "#DFF6FF";
const SHADOW = "rgba(15, 23, 42, 0.18)";
const ROAD = "#64748B";
const STRIPE = "#F8FAFC";
const TREE = "#15803D";
const LEAF = "#22C55E";
const DIRT = "#A16207";
const BRICK = "#B45309";
const ROOF = "#DC2626";
const GOLD = "#F59E0B";
const WATER = "#38BDF8";

function Base({ fill, roof = ROOF, flat = false }: { fill: string; roof?: string; flat?: boolean }) {
  return (
    <g>
      <ellipse cx={36} cy={62} rx={24} ry={5} fill={SHADOW} />
      {flat ? (
        <rect x={15} y={15} width={42} height={42} rx={5} fill={fill} stroke={EDGE} strokeWidth={2.2} />
      ) : (
        <>
          <rect x={16} y={22} width={40} height={35} rx={4} fill={fill} stroke={EDGE} strokeWidth={2.2} />
          <path d="M12 24 L36 9 L60 24 Z" fill={roof} stroke={EDGE} strokeWidth={2.2} strokeLinejoin="round" />
        </>
      )}
    </g>
  );
}

function Windows({ y = 32, rows = 1 }: { y?: number; rows?: number }) {
  const cells = [];
  for (let row = 0; row < rows; row++) {
    for (const x of [22, 42]) {
      cells.push(
        <rect key={`${row}-${x}`} x={x} y={y + row * 11} width={8} height={7} rx={1.2} fill={GLASS} stroke={EDGE} strokeWidth={1.1} />,
      );
    }
  }
  return <>{cells}</>;
}

function Door({ x = 31, y = 43, fill = "#475569" }: { x?: number; y?: number; fill?: string }) {
  return <rect x={x} y={y} width={10} height={14} rx={1.5} fill={fill} stroke={EDGE} strokeWidth={1.2} />;
}

function Plus({ cx = 36, cy = 27, size = 9, fill = "#DC2626" }: { cx?: number; cy?: number; size?: number; fill?: string }) {
  return (
    <g>
      <rect x={cx - size / 4} y={cy - size} width={size / 2} height={size * 2} rx={1} fill={fill} />
      <rect x={cx - size} y={cy - size / 4} width={size * 2} height={size / 2} rx={1} fill={fill} />
    </g>
  );
}

function Tree({ x, y, r = 6 }: { x: number; y: number; r?: number }) {
  return (
    <g>
      <rect x={x - 1.5} y={y} width={3} height={10} rx={1} fill={DIRT} />
      <circle cx={x} cy={y - 2} r={r} fill={TREE} stroke={EDGE} strokeWidth={1.2} />
      <circle cx={x - 2} cy={y - 4} r={r / 2.5} fill={LEAF} />
    </g>
  );
}

function SmallRoad({ y = 54 }: { y?: number }) {
  return (
    <g>
      <rect x={5} y={y} width={62} height={10} rx={2} fill={ROAD} stroke={EDGE} strokeWidth={1.4} />
      <line x1={11} y1={y + 5} x2={61} y2={y + 5} stroke={STRIPE} strokeWidth={1.4} strokeDasharray="5 5" />
    </g>
  );
}

function Vehicle({ x, y, fill }: { x: number; y: number; fill: string }) {
  return (
    <g>
      <rect x={x} y={y} width={20} height={9} rx={2} fill={fill} stroke={EDGE} strokeWidth={1.3} />
      <rect x={x + 4} y={y - 5} width={11} height={6} rx={2} fill={fill} stroke={EDGE} strokeWidth={1.3} />
      <circle cx={x + 5} cy={y + 10} r={2.3} fill={EDGE} />
      <circle cx={x + 16} cy={y + 10} r={2.3} fill={EDGE} />
    </g>
  );
}

function Hospital() {
  return (
    <g>
      <Base fill="#FEE2E2" roof="#F8FAFC" flat />
      <rect x={20} y={18} width={32} height={39} rx={3} fill={WHITE} stroke={EDGE} strokeWidth={1.6} />
      <Plus cx={36} cy={30} size={8} />
      <Windows y={42} />
      <Door fill="#DC2626" />
      <Vehicle x={7} y={50} fill={WHITE} />
      <Plus cx={17} cy={54} size={3.4} />
    </g>
  );
}

function Residential() {
  return (
    <g>
      <ellipse cx={36} cy={62} rx={24} ry={5} fill={SHADOW} />
      <rect x={10} y={28} width={23} height={29} rx={3} fill="#DBEAFE" stroke={EDGE} strokeWidth={1.9} />
      <path d="M7 29 L21.5 16 L36 29 Z" fill="#2563EB" stroke={EDGE} strokeWidth={1.9} />
      <rect x={38} y={23} width={24} height={34} rx={3} fill="#E0F2FE" stroke={EDGE} strokeWidth={1.9} />
      <path d="M35 25 L50 11 L65 25 Z" fill="#0284C7" stroke={EDGE} strokeWidth={1.9} />
      <rect x={17} y={44} width={7} height={13} rx={1} fill="#475569" />
      <rect x={46} y={43} width={8} height={14} rx={1} fill="#475569" />
      <rect x={14} y={34} width={7} height={6} fill={GLASS} stroke={EDGE} strokeWidth={1} />
      <rect x={26} y={34} width={5} height={6} fill={GLASS} stroke={EDGE} strokeWidth={1} />
      <rect x={43} y={30} width={6} height={6} fill={GLASS} stroke={EDGE} strokeWidth={1} />
      <rect x={55} y={30} width={6} height={6} fill={GLASS} stroke={EDGE} strokeWidth={1} />
    </g>
  );
}

function EmptyPlot() {
  return (
    <g>
      <rect x={8} y={10} width={56} height={52} rx={4} fill="#F5F5F4" stroke={EDGE} strokeWidth={2} strokeDasharray="5 4" />
      <path d="M15 53 L55 20 M16 21 L56 52" stroke="#A8A29E" strokeWidth={2} strokeDasharray="4 4" />
      <path d="M18 46 Q26 40 35 47 T55 43" stroke={DIRT} strokeWidth={3} fill="none" strokeLinecap="round" />
      <rect x={13} y={13} width={7} height={9} fill="#D6D3D1" stroke={EDGE} strokeWidth={1} />
      <Tree x={54} y={49} r={5} />
    </g>
  );
}

function Pharmacy() {
  return (
    <g>
      <Base fill="#DCFCE7" roof="#16A34A" flat />
      <rect x={18} y={20} width={36} height={24} rx={4} fill={WHITE} stroke={EDGE} strokeWidth={1.8} />
      <Plus cx={36} cy={32} size={8} fill="#16A34A" />
      <path d="M23 52 H49" stroke={EDGE} strokeWidth={2} />
      <rect x={21} y={46} width={8} height={8} rx={2} fill="#FDE68A" stroke={EDGE} strokeWidth={1.2} />
      <rect x={34} y={47} width={18} height={7} rx={3.5} fill="#60A5FA" stroke={EDGE} strokeWidth={1.2} />
      <line x1={43} y1={47} x2={43} y2={54} stroke={WHITE} strokeWidth={1.2} />
    </g>
  );
}

function PoliceStation() {
  return (
    <g>
      <Base fill="#DBEAFE" roof="#1D4ED8" flat />
      <path d="M36 18 L49 23 V35 C49 44 42 49 36 52 C30 49 23 44 23 35 V23 Z" fill={WHITE} stroke={EDGE} strokeWidth={1.8} />
      <path d="M36 23 L43 26 V34 C43 40 39 43 36 45 C33 43 29 40 29 34 V26 Z" fill="#1D4ED8" />
      <rect x={29} y={10} width={14} height={7} rx={3.5} fill="#EF4444" stroke={EDGE} strokeWidth={1.2} />
      <Vehicle x={8} y={51} fill="#DBEAFE" />
    </g>
  );
}

function Temple() {
  return (
    <g>
      <ellipse cx={36} cy={62} rx={24} ry={5} fill={SHADOW} />
      <rect x={18} y={44} width={36} height={13} fill="#FFEDD5" stroke={EDGE} strokeWidth={2} />
      <path d="M20 43 L36 14 L52 43 Z" fill="#FDBA74" stroke={EDGE} strokeWidth={2} />
      <path d="M25 43 L36 23 L47 43 Z" fill="#EA580C" stroke={EDGE} strokeWidth={1.5} />
      {[23, 31, 41, 49].map((x) => <line key={x} x1={x} y1={45} x2={x} y2={57} stroke={BRICK} strokeWidth={2.4} />)}
      <path d="M36 14 V8 L47 11" stroke={EDGE} strokeWidth={1.6} fill="none" />
      <path d="M36 8 L47 11 L36 14 Z" fill="#F97316" />
    </g>
  );
}

function Mosque() {
  return (
    <g>
      <ellipse cx={36} cy={62} rx={24} ry={5} fill={SHADOW} />
      <rect x={16} y={34} width={40} height={23} rx={4} fill="#D1FAE5" stroke={EDGE} strokeWidth={2} />
      <path d="M18 34 Q36 10 54 34 Z" fill="#34D399" stroke={EDGE} strokeWidth={2} />
      <rect x={10} y={22} width={8} height={35} rx={3} fill="#A7F3D0" stroke={EDGE} strokeWidth={1.7} />
      <rect x={54} y={22} width={8} height={35} rx={3} fill="#A7F3D0" stroke={EDGE} strokeWidth={1.7} />
      <path d="M10 22 Q14 13 18 22 M54 22 Q58 13 62 22" fill="#34D399" stroke={EDGE} strokeWidth={1.5} />
      <path d="M38 17 A7 7 0 1 0 44 8" fill="none" stroke={WHITE} strokeWidth={2} strokeLinecap="round" />
    </g>
  );
}

function Bank() {
  return (
    <g>
      <ellipse cx={36} cy={62} rx={24} ry={5} fill={SHADOW} />
      <path d="M14 25 L36 11 L58 25 Z" fill="#FBBF24" stroke={EDGE} strokeWidth={2} />
      <rect x={17} y={25} width={38} height={5} fill="#FEF3C7" stroke={EDGE} strokeWidth={1.5} />
      {[22, 31, 40, 49].map((x) => <rect key={x} x={x - 2} y={30} width={4} height={23} fill="#B45309" stroke={EDGE} strokeWidth={1.1} />)}
      <rect x={15} y={53} width={42} height={5} fill="#FEF3C7" stroke={EDGE} strokeWidth={1.5} />
      <circle cx={36} cy={22} r={4} fill={WHITE} stroke={EDGE} strokeWidth={1.2} />
      <path d="M34 22 H39 M36 19 V25" stroke="#B45309" strokeWidth={1.4} strokeLinecap="round" />
    </g>
  );
}

function SchoolLike({ college = false }: { college?: boolean }) {
  return (
    <g>
      <Base fill={college ? "#EDE9FE" : "#E0E7FF"} roof={college ? "#7C3AED" : "#4F46E5"} flat />
      <rect x={21} y={22} width={30} height={18} rx={2} fill="#14532D" stroke={EDGE} strokeWidth={1.6} />
      <path d="M28 49 Q36 43 44 49" stroke={college ? "#7C3AED" : "#4F46E5"} strokeWidth={3} fill="none" strokeLinecap="round" />
      <path d="M28 49 Q36 53 44 49" stroke={college ? "#7C3AED" : "#4F46E5"} strokeWidth={3} fill="none" strokeLinecap="round" />
      {college && <path d="M36 11 L51 18 L36 25 L21 18 Z" fill="#312E81" stroke={EDGE} strokeWidth={1.5} />}
      <Door fill={college ? "#7C3AED" : "#4F46E5"} />
    </g>
  );
}

function Market() {
  return (
    <g>
      <Base fill="#FCE7F3" roof="#DB2777" flat />
      <path d="M14 25 H58 L54 36 H18 Z" fill="#F9A8D4" stroke={EDGE} strokeWidth={1.8} />
      {[18, 26, 34, 42, 50].map((x, i) => <rect key={x} x={x} y={25} width={8} height={11} fill={i % 2 ? WHITE : "#DB2777"} opacity={0.92} />)}
      <rect x={19} y={39} width={34} height={18} rx={2} fill={WHITE} stroke={EDGE} strokeWidth={1.4} />
      <circle cx={26} cy={48} r={4} fill="#F97316" stroke={EDGE} strokeWidth={1} />
      <circle cx={37} cy={48} r={4} fill="#22C55E" stroke={EDGE} strokeWidth={1} />
      <circle cx={48} cy={48} r={4} fill="#EF4444" stroke={EDGE} strokeWidth={1} />
    </g>
  );
}

function RailwayStation() {
  return (
    <g>
      <rect x={12} y={16} width={48} height={32} rx={5} fill="#E2E8F0" stroke={EDGE} strokeWidth={2} />
      <path d="M9 18 H63 L56 10 H16 Z" fill="#475569" stroke={EDGE} strokeWidth={1.8} />
      <rect x={20} y={24} width={32} height={13} rx={4} fill={WHITE} stroke={EDGE} strokeWidth={1.5} />
      <circle cx={27} cy={42} r={2.5} fill={EDGE} />
      <circle cx={45} cy={42} r={2.5} fill={EDGE} />
      <path d="M18 56 H54 M23 48 L16 62 M49 48 L56 62" stroke={EDGE} strokeWidth={2} />
      <path d="M20 59 H52" stroke={ROAD} strokeWidth={2} />
    </g>
  );
}

function BusStand() {
  return (
    <g>
      <rect x={11} y={18} width={50} height={29} rx={5} fill="#CCFBF1" stroke={EDGE} strokeWidth={2} />
      <path d="M9 20 H63 L57 12 H15 Z" fill="#0F766E" stroke={EDGE} strokeWidth={1.8} />
      <Vehicle x={21} y={35} fill="#14B8A6" />
      <rect x={15} y={47} width={42} height={9} fill="#E2E8F0" stroke={EDGE} strokeWidth={1.4} />
      <line x1={23} y1={47} x2={23} y2={56} stroke={EDGE} strokeWidth={1.2} />
      <line x1={49} y1={47} x2={49} y2={56} stroke={EDGE} strokeWidth={1.2} />
    </g>
  );
}

function PostOffice() {
  return (
    <g>
      <Base fill="#FEE2E2" roof="#B91C1C" flat />
      <rect x={18} y={24} width={36} height={22} rx={3} fill={WHITE} stroke={EDGE} strokeWidth={1.8} />
      <path d="M18 25 L36 38 L54 25 M18 46 L31 34 M54 46 L41 34" stroke="#B91C1C" strokeWidth={2.2} fill="none" strokeLinecap="round" />
      <Door fill="#B91C1C" />
    </g>
  );
}

function FireStation() {
  return (
    <g>
      <Base fill="#FED7AA" roof="#C2410C" flat />
      <path d="M36 17 C49 30 43 47 36 49 C27 47 24 37 31 29 C31 36 40 32 36 17 Z" fill="#F97316" stroke={EDGE} strokeWidth={1.4} />
      <path d="M36 29 C41 36 39 43 36 44 C32 43 31 38 34 34 C34 38 38 35 36 29 Z" fill="#FDE68A" />
      <Vehicle x={8} y={51} fill="#DC2626" />
    </g>
  );
}

function PetrolPump() {
  return (
    <g>
      <rect x={12} y={14} width={48} height={43} rx={5} fill="#DCFCE7" stroke={EDGE} strokeWidth={2} />
      <path d="M14 18 H58 L52 10 H20 Z" fill="#15803D" stroke={EDGE} strokeWidth={1.8} />
      <rect x={23} y={25} width={18} height={25} rx={3} fill={WHITE} stroke={EDGE} strokeWidth={1.7} />
      <rect x={27} y={29} width={10} height={8} fill="#BAE6FD" stroke={EDGE} strokeWidth={1} />
      <path d="M41 30 H50 V47" stroke="#15803D" strokeWidth={2.5} fill="none" />
      <circle cx={50} cy={48} r={2.5} fill="#15803D" />
      <SmallRoad y={58} />
    </g>
  );
}

function Hotel() {
  return (
    <g>
      <Base fill="#E0F2FE" roof="#0284C7" flat />
      <rect x={22} y={18} width={28} height={39} rx={3} fill="#BAE6FD" stroke={EDGE} strokeWidth={1.8} />
      <Windows y={24} rows={2} />
      <path d="M17 51 H55" stroke="#0284C7" strokeWidth={4} strokeLinecap="round" />
      <rect x={31} y={45} width={10} height={12} fill="#0284C7" stroke={EDGE} strokeWidth={1.1} />
      <path d="M21 17 Q36 7 51 17" stroke="#0284C7" strokeWidth={2.5} fill="none" />
    </g>
  );
}

function Restaurant() {
  return (
    <g>
      <Base fill="#FFEDD5" roof="#D97706" flat />
      <circle cx={36} cy={32} r={13} fill={WHITE} stroke={EDGE} strokeWidth={1.8} />
      <circle cx={36} cy={32} r={7} fill="#FED7AA" stroke="#D97706" strokeWidth={1.4} />
      <path d="M20 19 V45 M17 20 V30 M23 20 V30" stroke="#D97706" strokeWidth={2} strokeLinecap="round" />
      <path d="M53 19 C47 25 47 36 53 42 V51" stroke="#D97706" strokeWidth={2.2} fill="none" strokeLinecap="round" />
    </g>
  );
}

function Office() {
  return (
    <g>
      <Base fill="#E5E7EB" roof="#4B5563" flat />
      <rect x={21} y={15} width={30} height={42} rx={3} fill="#CBD5E1" stroke={EDGE} strokeWidth={1.8} />
      {[23, 34, 45].map((x) => [21, 31, 41].map((y) => <rect key={`${x}-${y}`} x={x} y={y} width={6} height={6} fill={GLASS} stroke={EDGE} strokeWidth={0.9} />))}
      <Door fill="#4B5563" />
    </g>
  );
}

function Industrial({ warehouse = false }: { warehouse?: boolean }) {
  return (
    <g>
      <ellipse cx={36} cy={62} rx={25} ry={5} fill={SHADOW} />
      <path d={warehouse ? "M13 27 H59 V57 H13 Z" : "M12 45 V29 L24 37 V29 L36 37 V29 L49 37 V29 L60 43 V57 H12 Z"} fill={warehouse ? "#F1F5F9" : "#E7E5E4"} stroke={EDGE} strokeWidth={2} />
      <rect x={18} y={43} width={14} height={14} fill="#94A3B8" stroke={EDGE} strokeWidth={1.4} />
      <rect x={39} y={43} width={14} height={14} fill="#94A3B8" stroke={EDGE} strokeWidth={1.4} />
      <rect x={20} y={18} width={7} height={23} fill={warehouse ? "#475569" : "#57534E"} stroke={EDGE} strokeWidth={1.2} />
      {!warehouse && <path d="M24 16 C30 10 35 18 41 12" stroke="#CBD5E1" strokeWidth={3} fill="none" strokeLinecap="round" />}
      {warehouse && <path d="M13 27 L36 13 L59 27" fill="#CBD5E1" stroke={EDGE} strokeWidth={1.8} />}
    </g>
  );
}

function Park() {
  return (
    <g>
      <rect x={8} y={10} width={56} height={52} rx={7} fill="#BBF7D0" stroke={EDGE} strokeWidth={2} />
      <path d="M15 52 C25 42 39 58 56 43" stroke="#86EFAC" strokeWidth={5} fill="none" strokeLinecap="round" />
      <Tree x={22} y={39} r={8} />
      <Tree x={48} y={34} r={6} />
      <rect x={31} y={47} width={19} height={4} rx={2} fill={BRICK} stroke={EDGE} strokeWidth={1} />
      <line x1={34} y1={51} x2={34} y2={56} stroke={EDGE} strokeWidth={1.3} />
      <line x1={47} y1={51} x2={47} y2={56} stroke={EDGE} strokeWidth={1.3} />
    </g>
  );
}

function WaterTank() {
  return (
    <g>
      <ellipse cx={36} cy={61} rx={20} ry={4} fill={SHADOW} />
      <ellipse cx={36} cy={20} rx={16} ry={6} fill={WATER} stroke={EDGE} strokeWidth={1.7} />
      <rect x={20} y={20} width={32} height={18} fill="#BAE6FD" stroke={EDGE} strokeWidth={1.7} />
      <ellipse cx={36} cy={38} rx={16} ry={6} fill="#7DD3FC" stroke={EDGE} strokeWidth={1.7} />
      <line x1={25} y1={42} x2={18} y2={58} stroke={EDGE} strokeWidth={2} />
      <line x1={47} y1={42} x2={54} y2={58} stroke={EDGE} strokeWidth={2} />
      <line x1={31} y1={42} x2={31} y2={58} stroke={EDGE} strokeWidth={1.6} />
      <line x1={41} y1={42} x2={41} y2={58} stroke={EDGE} strokeWidth={1.6} />
    </g>
  );
}

function Civic({ court = false }: { court?: boolean }) {
  return (
    <g>
      <Bank />
      {court ? (
        <g>
          <line x1={36} y1={18} x2={36} y2={40} stroke="#9333EA" strokeWidth={2} />
          <path d="M26 25 H46 M29 25 L25 38 H33 Z M43 25 L39 38 H47 Z" fill="#F3E8FF" stroke={EDGE} strokeWidth={1.2} />
        </g>
      ) : (
        <circle cx={36} cy={22} r={5} fill="#FEF9C3" stroke="#A16207" strokeWidth={1.5} />
      )}
    </g>
  );
}

function ClockTower() {
  return (
    <g>
      <ellipse cx={36} cy={62} rx={20} ry={4} fill={SHADOW} />
      <rect x={24} y={23} width={24} height={34} rx={3} fill="#FDE68A" stroke={EDGE} strokeWidth={2} />
      <path d="M22 24 L36 9 L50 24 Z" fill="#B45309" stroke={EDGE} strokeWidth={2} />
      <rect x={31} y={13} width={10} height={7} rx={2} fill="#F59E0B" stroke={EDGE} strokeWidth={1.4} />
      <circle cx={36} cy={36} r={8} fill={WHITE} stroke={EDGE} strokeWidth={1.7} />
      <line x1={36} y1={36} x2={36} y2={31} stroke="#0F172A" strokeWidth={1.8} strokeLinecap="round" />
      <line x1={36} y1={36} x2={40} y2={38} stroke="#0F172A" strokeWidth={1.8} strokeLinecap="round" />
      <rect x={31} y={46} width={10} height={11} rx={1.8} fill="#B45309" stroke={EDGE} strokeWidth={1.2} />
    </g>
  );
}

function CommunityHall() {
  return (
    <g>
      <Base fill="#FCE7F3" roof="#BE185D" flat />
      <path d="M18 35 Q36 18 54 35" fill="#F9A8D4" stroke={EDGE} strokeWidth={1.8} />
      <circle cx={29} cy={44} r={4} fill="#BE185D" />
      <circle cx={43} cy={44} r={4} fill="#BE185D" />
      <path d="M22 55 C27 48 45 48 50 55" stroke="#BE185D" strokeWidth={3} fill="none" strokeLinecap="round" />
    </g>
  );
}

function Cinema() {
  return (
    <g>
      <Base fill="#FAE8FF" roof="#A21CAF" flat />
      <rect x={18} y={20} width={36} height={28} rx={3} fill="#111827" stroke={EDGE} strokeWidth={1.8} />
      <polygon points="32,27 32,41 45,34" fill={WHITE} />
      {[21, 28, 35, 42, 49].map((x) => <rect key={x} x={x} y={16} width={4} height={5} fill={WHITE} />)}
      <rect x={22} y={52} width={28} height={5} rx={2.5} fill="#F0ABFC" stroke={EDGE} strokeWidth={1} />
    </g>
  );
}

function Playground() {
  return (
    <g>
      <rect x={8} y={10} width={56} height={52} rx={7} fill="#DCFCE7" stroke={EDGE} strokeWidth={2} />
      <rect x={16} y={20} width={40} height={27} rx={13.5} fill="#BBF7D0" stroke="#65A30D" strokeWidth={2} />
      <circle cx={29} cy={34} r={5.5} fill="#F97316" stroke={EDGE} strokeWidth={1.2} />
      <line x1={43} y1={22} x2={43} y2={48} stroke={EDGE} strokeWidth={2} />
      <path d="M48 23 L39 33 L48 43" stroke="#65A30D" strokeWidth={2.2} fill="none" strokeLinecap="round" strokeLinejoin="round" />
    </g>
  );
}

function Parking() {
  return (
    <g>
      <rect x={8} y={10} width={56} height={52} rx={6} fill="#E0F2FE" stroke={EDGE} strokeWidth={2} />
      <rect x={16} y={18} width={40} height={36} rx={4} fill={WHITE} stroke="#0369A1" strokeWidth={2.5} />
      <rect x={21} y={25} width={16} height={20} rx={2} fill="#0369A1" />
      <rect x={37} y={25} width={10} height={7} rx={3.5} fill="#0369A1" />
      <Vehicle x={26} y={47} fill="#60A5FA" />
    </g>
  );
}

function Shop() {
  return (
    <g>
      <Base fill="#FEF3C7" roof="#CA8A04" flat />
      <path d="M14 24 H58 L54 35 H18 Z" fill="#FDE68A" stroke={EDGE} strokeWidth={1.8} />
      {[18, 26, 34, 42, 50].map((x, i) => <rect key={x} x={x} y={24} width={8} height={11} fill={i % 2 ? WHITE : "#CA8A04"} />)}
      <rect x={21} y={40} width={30} height={17} rx={2} fill={GLASS} stroke={EDGE} strokeWidth={1.4} />
      <line x1={36} y1={40} x2={36} y2={57} stroke={EDGE} strokeWidth={1.2} />
    </g>
  );
}

function TileArt({ kind }: { kind: BuildingKind }) {
  switch (kind) {
    case "hospital":
      return <Hospital />;
    case "residential":
      return <Residential />;
    case "empty_plot":
      return <EmptyPlot />;
    case "pharmacy":
      return <Pharmacy />;
    case "police_station":
      return <PoliceStation />;
    case "temple":
      return <Temple />;
    case "mosque":
      return <Mosque />;
    case "bank":
      return <Bank />;
    case "school":
      return <SchoolLike />;
    case "college":
      return <SchoolLike college />;
    case "market":
      return <Market />;
    case "railway_station":
      return <RailwayStation />;
    case "bus_stand":
      return <BusStand />;
    case "post_office":
      return <PostOffice />;
    case "fire_station":
      return <FireStation />;
    case "petrol_pump":
      return <PetrolPump />;
    case "hotel":
      return <Hotel />;
    case "restaurant":
      return <Restaurant />;
    case "office":
      return <Office />;
    case "factory":
      return <Industrial />;
    case "warehouse":
      return <Industrial warehouse />;
    case "park":
      return <Park />;
    case "water_tank":
      return <WaterTank />;
    case "government_office":
      return <Civic />;
    case "clocktower":
      return <ClockTower />;
    case "court":
      return <Civic court />;
    case "community_hall":
      return <CommunityHall />;
    case "cinema":
      return <Cinema />;
    case "playground":
      return <Playground />;
    case "parking":
      return <Parking />;
    case "shop":
      return <Shop />;
  }
}

export function BuildingTile({ kind, size = S, outline }: { kind: BuildingKind; size?: number; outline?: "ok" | "bad" | "hover" | "named" | "selected" | null }) {
  const outlineColor =
    outline === "ok" ? "#10B981" : outline === "bad" ? "#EF4444" : outline === "hover" ? "#F59E0B" : outline === "named" ? "#A855F7" : null;
  const def = BUILDINGS[kind];
  const glowId = useId();
  const glowUrl = outline === "selected" ? `url(#${glowId})` : undefined;

  return (
    <svg width={size} height={size} viewBox={`0 0 ${S} ${S}`} style={{ display: "block" }}>
      {outline === "selected" && <TileGlow id={glowId} />}
      <g filter={glowUrl}>
        <TileArt kind={kind} />
      </g>
      {outlineColor && (
        <rect x={1} y={1} width={S - 2} height={S - 2} fill="none" stroke={outlineColor} strokeWidth={3} rx={6} style={{ pointerEvents: "none" }} />
      )}
      {outline === "named" && <circle cx={60} cy={12} r={5} fill="#FDE047" stroke="#0F172A" strokeWidth={1.5} />}
      <title>{def.label}</title>
    </svg>
  );
}

function TileGlow({ id }: { id: string }) {
  return (
    <defs>
      <filter id={id} x="-35%" y="-35%" width="170%" height="170%" colorInterpolationFilters="sRGB">
        <feDropShadow dx="0" dy="0" stdDeviation="2.4" floodColor="#F59E0B" floodOpacity="0.95" />
        <feDropShadow dx="0" dy="0" stdDeviation="5.8" floodColor="#F59E0B" floodOpacity="0.62" />
      </filter>
    </defs>
  );
}
