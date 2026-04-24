"use client";
import { useMemo } from "react";
import { useGame } from "@/store/game";
import { scoreGrid } from "@/lib/grid";

export function ScoreBoard() {
  const grid = useGame((s) => s.grid);
  const clearAll = useGame((s) => s.clearAll);
  const score = useMemo(() => scoreGrid(grid), [grid]);
  const efficiency = score.roads === 0 ? 0 : Math.round((score.connectedTiles / score.roads) * 100);

  return (
    <aside className="bg-white rounded-xl2 shadow-pop border-2 border-asphalt-200 p-4 w-[260px] shrink-0">
      <div className="flex items-baseline justify-between mb-3">
        <h2 className="font-display font-extrabold text-lg text-asphalt-900">City Stats</h2>
        <span className="text-xs text-asphalt-500">Shahar Ka Hisaab</span>
      </div>

      <div className="rounded-xl bg-marigold-400/15 border-2 border-marigold-500/40 p-3 mb-3">
        <div className="text-xs font-semibold text-marigold-600">Score</div>
        <div className="font-display text-3xl font-extrabold text-asphalt-900 tabular-nums">{score.total}</div>
      </div>

      <ul className="text-sm space-y-1.5">
        <Row label="Tiles Placed" value={score.tiles} />
        <Row label="Roads" value={score.roads} />
        <Row label="Buildings" value={score.buildings} good={score.buildings > 0} />
        <Row label="Connected" value={`${score.connectedTiles} (${efficiency}%)`} good={efficiency >= 70} />
        <Row label="Open Ends" value={score.openEnds} warn={score.openEnds > 0} />
        <Row label="Mismatches" value={score.mismatched} bad={score.mismatched > 0} />
        <Row label="Loops" value={score.loops} good={score.loops > 0} />
        <Row label="Variety Bonus" value={`+${score.bonusDiversity}`} />
      </ul>

      <button
        onClick={clearAll}
        className="mt-4 w-full rounded-xl border-2 border-asphalt-200 bg-white py-2 font-bold text-asphalt-700 hover:bg-red-50 hover:border-red-300 hover:text-red-600 shadow-tile active:translate-y-0.5"
      >
        Clear City
      </button>
    </aside>
  );
}

function Row({ label, value, good, bad, warn }: { label: string; value: string | number; good?: boolean; bad?: boolean; warn?: boolean }) {
  const color = bad ? "text-red-600" : warn ? "text-amber-600" : good ? "text-paan-600" : "text-asphalt-700";
  return (
    <li className="flex justify-between items-center">
      <span className="text-asphalt-500">{label}</span>
      <span className={`font-bold tabular-nums ${color}`}>{value}</span>
    </li>
  );
}
