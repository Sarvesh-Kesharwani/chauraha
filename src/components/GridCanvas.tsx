"use client";
import { useEffect, useLayoutEffect, useRef, useState, type FormEvent, type MouseEvent as ReactMouseEvent } from "react";
import { useGame, type SelectedTool } from "@/store/game";
import { cellKey, parseKey, type Tile } from "@/lib/grid";
import { BUILDINGS } from "@/lib/buildings";
import { ROADS } from "@/lib/roads";
import { WATERS } from "@/lib/water";
import { BuildingTile } from "./BuildingTile";
import { RoadTile, TILE_SIZE } from "./RoadTile";
import { WaterTile } from "./WaterTile";

const GRASS_LAYERS = [
  "radial-gradient(circle at 12% 18%, rgba(255,255,255,0.9) 0 1.2px, transparent 1.4px)",
  "radial-gradient(circle at 42% 72%, rgba(250,204,21,0.8) 0 1.1px, transparent 1.3px)",
  "radial-gradient(circle at 78% 34%, rgba(244,114,182,0.7) 0 1px, transparent 1.2px)",
  "radial-gradient(circle at 18% 82%, rgba(34,197,94,0.45) 0 2px, transparent 2.3px)",
  "radial-gradient(circle at 68% 16%, rgba(22,163,74,0.35) 0 2.5px, transparent 2.8px)",
  "linear-gradient(135deg, rgba(255,255,255,0.22) 0 8%, transparent 8% 50%, rgba(22,163,74,0.08) 50% 58%, transparent 58%)",
  "radial-gradient(ellipse at 24% 18%, #D9F99D 0%, transparent 34%)",
  "radial-gradient(ellipse at 82% 78%, #86EFAC 0%, transparent 38%)",
  "linear-gradient(160deg, #CFFAFE 0%, #BBF7D0 42%, #A7F3D0 100%)",
];

const GRASS_SIZES = "92px 92px, 116px 116px, 104px 104px, 130px 130px, 150px 150px, 144px 144px, 100% 100%, 100% 100%, 100% 100%";
const MIN_ZOOM = 0.6;
const MAX_ZOOM = 1.8;
const ZOOM_STEP = 0.1;

export function GridCanvas() {
  const grid = useGame((s) => s.grid);
  const selected = useGame((s) => s.selected);
  const eraseMode = useGame((s) => s.eraseMode);
  const selectMode = useGame((s) => s.selectMode);
  const selectedKeys = useGame((s) => s.selectedKeys);
  const setSelectMode = useGame((s) => s.setSelectMode);
  const toggleSelectKey = useGame((s) => s.toggleSelectKey);
  const clearSelectedKeys = useGame((s) => s.clearSelectedKeys);
  const moveSelectedTiles = useGame((s) => s.moveSelectedTiles);
  const rot = useGame((s) => s.rot);
  const placeTile = useGame((s) => s.placeTile);
  const removeTile = useGame((s) => s.removeTile);
  const rotateTile = useGame((s) => s.rotateTile);
  const renameTile = useGame((s) => s.renameTile);
  const cycleRot = useGame((s) => s.cycleRot);
  const feedback = useGame((s) => s.feedback);
  const focusTarget = useGame((s) => s.focusTarget);
  const setFocusTarget = useGame((s) => s.setFocusTarget);

  const [hover, setHover] = useState<{ x: number; y: number } | null>(null);
  const [editingKey, setEditingKey] = useState<string | null>(null);
  const [draftName, setDraftName] = useState("");
  const [viewport, setViewport] = useState({ width: 960, height: 640 });
  const [camera, setCamera] = useState({ x: -6, y: -4 });
  const [zoom, setZoom] = useState(1);
  const [moving, setMoving] = useState(false);

  const selectionAnchor = (() => {
    if (selectedKeys.size === 0) return null;
    let minX = Infinity, minY = Infinity;
    for (const k of selectedKeys) {
      const [x, y] = parseKey(k);
      if (x < minX) minX = x;
      if (y < minY) minY = y;
    }
    return { x: minX, y: minY };
  })();

  const moveOffset = (() => {
    if (!moving || !hover || !selectionAnchor) return null;
    return { dx: hover.x - selectionAnchor.x, dy: hover.y - selectionAnchor.y };
  })();
  const ref = useRef<HTMLDivElement>(null);
  const tileSize = TILE_SIZE * zoom;

  const clampZoom = (value: number) => Math.min(MAX_ZOOM, Math.max(MIN_ZOOM, Math.round(value * 100) / 100));

  const focusCity = () => {
    if (grid.size === 0) return;
    let minX = Infinity, maxX = -Infinity, minY = Infinity, maxY = -Infinity;
    for (const key of grid.keys()) {
      const [x, y] = parseKey(key);
      if (x < minX) minX = x;
      if (x > maxX) maxX = x;
      if (y < minY) minY = y;
      if (y > maxY) maxY = y;
    }
    const cx = (minX + maxX + 1) / 2;
    const cy = (minY + maxY + 1) / 2;
    setCamera({
      x: cx - viewport.width / (2 * tileSize),
      y: cy - viewport.height / (2 * tileSize),
    });
  };
  const panRef = useRef<{ startX: number; startY: number; startCamX: number; startCamY: number; moved: boolean } | null>(null);
  const justPannedRef = useRef(false);

  useLayoutEffect(() => {
    const el = ref.current;
    if (!el) return;

    const update = () => {
      const rect = el.getBoundingClientRect();
      setViewport({ width: rect.width, height: rect.height });
    };

    update();
    const observer = new ResizeObserver(update);
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!selectMode || selectedKeys.size === 0) setMoving(false);
  }, [selectMode, selectedKeys]);

  useEffect(() => {
    if (!focusTarget) return;
    setCamera({
      x: focusTarget.x + 0.5 - viewport.width / (2 * tileSize),
      y: focusTarget.y + 0.5 - viewport.height / (2 * tileSize),
    });
    setFocusTarget(null);
  }, [focusTarget, setFocusTarget, viewport, tileSize]);

  const activeCloud = (() => {
    if (editingKey) {
      const [x, y] = parseKey(editingKey);
      const tile = grid.get(editingKey);
      return tile ? { x, y, key: editingKey, tile } : null;
    }
    if (!hover) return null;
    const key = cellKey(hover.x, hover.y);
    const tile = grid.get(key);
    return tile ? { x: hover.x, y: hover.y, key, tile } : null;
  })();

  const pixelOffsetX = -((camera.x * tileSize) % 144);
  const pixelOffsetY = -((camera.y * tileSize) % 144);

  const cellAt = (clientX: number, clientY: number) => {
    const el = ref.current;
    if (!el) return null;
    const r = el.getBoundingClientRect();
    const localX = clientX - r.left;
    const localY = clientY - r.top;
    return {
      x: Math.floor(localX / tileSize + camera.x),
      y: Math.floor(localY / tileSize + camera.y),
    };
  };

  const screenPos = (x: number, y: number) => ({
    left: (x - camera.x) * tileSize,
    top: (y - camera.y) * tileSize,
  });

  const startPan = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.button !== 2 && e.button !== 1) return false;
    panRef.current = {
      startX: e.clientX,
      startY: e.clientY,
      startCamX: camera.x,
      startCamY: camera.y,
      moved: false,
    };

    const onMove = (ev: globalThis.MouseEvent) => {
      if (!panRef.current) return;
      const rawDx = ev.clientX - panRef.current.startX;
      const rawDy = ev.clientY - panRef.current.startY;
      if (Math.abs(rawDx) > 3 || Math.abs(rawDy) > 3) panRef.current.moved = true;
      setCamera({
        x: panRef.current.startCamX - rawDx / tileSize,
        y: panRef.current.startCamY - rawDy / tileSize,
      });
    };

    const onUp = () => {
      justPannedRef.current = panRef.current?.moved ?? false;
      panRef.current = null;
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("mouseup", onUp);
    };

    window.addEventListener("mousemove", onMove);
    window.addEventListener("mouseup", onUp);
    return true;
  };

  const zoomAroundPoint = (nextZoom: number, clientX?: number, clientY?: number) => {
    const el = ref.current;
    const clamped = clampZoom(nextZoom);
    if (!el || clamped === zoom) {
      setZoom(clamped);
      return;
    }

    const rect = el.getBoundingClientRect();
    const localX = clientX === undefined ? viewport.width / 2 : clientX - rect.left;
    const localY = clientY === undefined ? viewport.height / 2 : clientY - rect.top;
    const worldX = localX / tileSize + camera.x;
    const worldY = localY / tileSize + camera.y;
    const nextTileSize = TILE_SIZE * clamped;

    setZoom(clamped);
    setCamera({
      x: worldX - localX / nextTileSize,
      y: worldY - localY / nextTileSize,
    });
  };

  const confirmReplaceTile = (x: number, y: number) => {
    if (!selected) return false;
    const existing = grid.get(cellKey(x, y));
    if (!existing) return true;

    return window.confirm(
      `Replace ${getTileLabel(existing)} with ${getSelectedToolLabel(selected)}?`
    );
  };

  const commitMove = (dx: number, dy: number) => {
    if (selectedKeys.size === 0) return;
    if (dx === 0 && dy === 0) {
      setMoving(false);
      return;
    }
    const collisions: Array<{ key: string; tile: Tile }> = [];
    for (const k of selectedKeys) {
      const [x, y] = parseKey(k);
      const nk = cellKey(x + dx, y + dy);
      if (selectedKeys.has(nk)) continue;
      const existing = grid.get(nk);
      if (existing) collisions.push({ key: nk, tile: existing });
    }
    if (collisions.length > 0) {
      const labels = collisions.slice(0, 5).map((c) => getTileLabel(c.tile)).join(", ");
      const more = collisions.length > 5 ? ` and ${collisions.length - 5} more` : "";
      const ok = window.confirm(
        `Do you want to replace the items below moving group of items?\n\n${collisions.length} tile(s): ${labels}${more}`
      );
      if (!ok) return;
    }
    moveSelectedTiles(dx, dy, true);
    setMoving(false);
  };

  return (
    <div
      ref={ref}
      className="relative h-full w-full overflow-hidden rounded-xl2 border-[3px] border-asphalt-900/80 shadow-pop no-select cursor-default"
      style={{
        minHeight: 0,
        background: GRASS_LAYERS.join(", "),
        backgroundSize: GRASS_SIZES,
        backgroundPosition: `${pixelOffsetX}px ${pixelOffsetY}px, ${pixelOffsetX}px ${pixelOffsetY}px, ${pixelOffsetX}px ${pixelOffsetY}px, ${pixelOffsetX}px ${pixelOffsetY}px, ${pixelOffsetX}px ${pixelOffsetY}px, ${pixelOffsetX}px ${pixelOffsetY}px, center, center, center`,
      }}
      onMouseDown={(e) => {
        const target = e.target as HTMLElement;
        if (target.closest("[data-tile-name-cloud]")) return;
        if (startPan(e)) {
          e.preventDefault();
          return;
        }
      }}
      onMouseMove={(e) => {
        const target = e.target as HTMLElement;
        if (target.closest("[data-tile-name-cloud]")) return;
        if (panRef.current) return;
        setHover(cellAt(e.clientX, e.clientY));
      }}
      onMouseLeave={() => {
        if (!editingKey) setHover(null);
      }}
      onClick={(e) => {
        const c = cellAt(e.clientX, e.clientY);
        if (!c) return;
        if (moving && selectionAnchor) {
          commitMove(c.x - selectionAnchor.x, c.y - selectionAnchor.y);
          return;
        }
        if (selectMode) {
          toggleSelectKey(c.x, c.y);
          return;
        }
        if (eraseMode) {
          if (grid.has(cellKey(c.x, c.y))) removeTile(c.x, c.y);
          return;
        }
        if (!selected) return;
        if (!confirmReplaceTile(c.x, c.y)) return;
        placeTile(c.x, c.y);
      }}
      onContextMenu={(e) => {
        e.preventDefault();
        if (justPannedRef.current) {
          justPannedRef.current = false;
          return;
        }
        if (eraseMode || selectMode) return;
        const c = cellAt(e.clientX, e.clientY);
        if (!c) return;
        if (grid.has(cellKey(c.x, c.y))) rotateTile(c.x, c.y);
        else cycleRot();
      }}
      onDragOver={(e) => {
        e.preventDefault();
        setHover(cellAt(e.clientX, e.clientY));
      }}
      onDrop={(e) => {
        e.preventDefault();
        if (selectMode) return;
        const c = cellAt(e.clientX, e.clientY);
        if (!c) return;
        if (!confirmReplaceTile(c.x, c.y)) return;
        placeTile(c.x, c.y);
      }}
      onWheel={(e) => {
        e.preventDefault();
        const direction = e.deltaY > 0 ? -1 : 1;
        zoomAroundPoint(zoom + direction * ZOOM_STEP, e.clientX, e.clientY);
      }}
    >
      <div
        className="absolute inset-0 pointer-events-none opacity-20"
        style={{
          backgroundImage:
            "linear-gradient(to right, rgba(15,23,42,0.08) 1px, transparent 1px), linear-gradient(to bottom, rgba(15,23,42,0.08) 1px, transparent 1px)",
          backgroundSize: `${tileSize}px ${tileSize}px`,
          backgroundPosition: `${-(camera.x * tileSize)}px ${-(camera.y * tileSize)}px`,
        }}
      />

      {[...grid.entries()].map(([k, t]) => {
        const [x, y] = parseKey(k);
        const pos = screenPos(x, y);
        if (pos.left < -tileSize || pos.top < -tileSize || pos.left > viewport.width || pos.top > viewport.height) {
          return null;
        }

        const fresh = feedback && feedback.x === x && feedback.y === y;
        const pulse = fresh && feedback.kind === "ok";
        const shake = fresh && feedback.kind === "bad";
        const named = Boolean(t.name?.trim());

        return (
          <div
            key={k}
            className={`absolute ${pulse ? "animate-pulseJoin" : ""} ${shake ? "animate-shake" : ""}`}
            style={{ left: pos.left, top: pos.top, width: tileSize, height: tileSize, zIndex: named ? 2 : 1 }}
          >
            {t.type === "road" ? (
              <RoadTile kind={t.kind} rot={t.rot} outline={named ? "named" : null} size={tileSize} />
            ) : t.type === "water" ? (
              <WaterTile kind={t.kind} rot={t.rot} outline={named ? "named" : null} size={tileSize} />
            ) : (
              <BuildingTile kind={t.kind} outline={named ? "named" : null} size={tileSize} />
            )}
            {named && (
              <div className="absolute -top-4 left-0 right-0 flex justify-center pointer-events-none">
                <span className="max-w-[80px] truncate rounded-full border border-fuchsia-400 bg-fuchsia-500 px-1.5 py-px text-[8px] font-bold leading-3 text-white shadow-sm">
                  {t.name}
                </span>
              </div>
            )}
          </div>
        );
      })}

      {[...selectedKeys].map((k) => {
        const [x, y] = parseKey(k);
        const pos = screenPos(x, y);
        if (pos.left < -tileSize || pos.top < -tileSize || pos.left > viewport.width || pos.top > viewport.height) {
          return null;
        }
        return (
          <div
            key={`sel-${k}`}
            className="absolute pointer-events-none rounded-md ring-[3px] ring-cyan-400 ring-inset bg-cyan-300/20"
            style={{ left: pos.left, top: pos.top, width: tileSize, height: tileSize, zIndex: 5 }}
          />
        );
      })}

      {moving && moveOffset && [...selectedKeys].map((k) => {
        const t = grid.get(k);
        if (!t) return null;
        const [x, y] = parseKey(k);
        const gx = x + moveOffset.dx;
        const gy = y + moveOffset.dy;
        const pos = screenPos(gx, gy);
        if (pos.left < -tileSize || pos.top < -tileSize || pos.left > viewport.width || pos.top > viewport.height) {
          return null;
        }
        const collides = !selectedKeys.has(cellKey(gx, gy)) && grid.has(cellKey(gx, gy));
        return (
          <div
            key={`ghost-${k}`}
            className="absolute pointer-events-none opacity-70"
            style={{ left: pos.left, top: pos.top, width: tileSize, height: tileSize, zIndex: 6 }}
          >
            {t.type === "road" ? (
              <RoadTile kind={t.kind} rot={t.rot} outline={null} size={tileSize} />
            ) : t.type === "water" ? (
              <WaterTile kind={t.kind} rot={t.rot} outline={null} size={tileSize} />
            ) : (
              <BuildingTile kind={t.kind} outline={null} size={tileSize} />
            )}
            <div
              className={`absolute inset-0 rounded-md ring-[3px] ring-inset ${collides ? "ring-rose-500 bg-rose-400/30" : "ring-emerald-400 bg-emerald-300/20"}`}
            />
          </div>
        );
      })}

      {hover && selected && !eraseMode && !selectMode && !panRef.current && !grid.has(cellKey(hover.x, hover.y)) && (() => {
        const pos = screenPos(hover.x, hover.y);
        return (
          <div
            className="absolute pointer-events-none opacity-60"
            style={{ left: pos.left, top: pos.top, width: tileSize, height: tileSize }}
          >
            {selected.type === "road" ? (
              <RoadTile kind={selected.kind} rot={rot} outline="hover" size={tileSize} />
            ) : selected.type === "water" ? (
              <WaterTile kind={selected.kind} rot={rot} outline="hover" size={tileSize} />
            ) : (
              <BuildingTile kind={selected.kind} outline="hover" size={tileSize} />
            )}
          </div>
        );
      })()}

      {activeCloud && (
        <TileNameCloud
          screenX={screenPos(activeCloud.x, activeCloud.y).left}
          screenY={screenPos(activeCloud.x, activeCloud.y).top}
          tileSize={tileSize}
          viewportWidth={viewport.width}
          name={activeCloud.tile.name || getTileLabel(activeCloud.tile)}
          hindi={getTileHindi(activeCloud.tile)}
          editing={editingKey === activeCloud.key}
          draftName={draftName}
          onStartEdit={() => {
            setEditingKey(activeCloud.key);
            setDraftName(activeCloud.tile.name || getTileLabel(activeCloud.tile));
          }}
          onDraftChange={setDraftName}
          onCancel={() => {
            setEditingKey(null);
            setDraftName("");
          }}
          onSave={() => {
            renameTile(activeCloud.x, activeCloud.y, draftName);
            setEditingKey(null);
            setDraftName("");
          }}
        />
      )}

      {selectMode && (
        <div
          className="absolute top-3 left-1/2 -translate-x-1/2 flex items-center gap-2 rounded-full border-2 border-asphalt-900 bg-white/95 px-3 py-1.5 shadow-tile backdrop-blur z-20"
          onClick={(e) => e.stopPropagation()}
          onContextMenu={(e) => e.stopPropagation()}
          onMouseDown={(e) => e.stopPropagation()}
        >
          <span className="text-[11px] font-extrabold text-asphalt-700">
            {moving
              ? "Click destination to drop"
              : `${selectedKeys.size} selected${selectedKeys.size === 0 ? " — click tiles to add" : ""}`}
          </span>
          {selectedKeys.size > 0 && !moving && (
            <button
              onClick={() => setMoving(true)}
              className="rounded-full border-2 border-asphalt-900 bg-cyan-300 px-2.5 py-0.5 text-[11px] font-extrabold text-asphalt-950 shadow-tile hover:-translate-y-0.5 transition"
            >
              Move
            </button>
          )}
          {moving && (
            <button
              onClick={() => setMoving(false)}
              className="rounded-full border-2 border-asphalt-900 bg-white px-2.5 py-0.5 text-[11px] font-bold text-asphalt-900 hover:bg-rose-100"
            >
              Cancel move
            </button>
          )}
          {selectedKeys.size > 0 && !moving && (
            <button
              onClick={() => clearSelectedKeys()}
              className="rounded-full border-2 border-asphalt-900 bg-white px-2.5 py-0.5 text-[11px] font-bold text-asphalt-900 hover:bg-rose-100"
            >
              Clear
            </button>
          )}
          <button
            onClick={() => {
              setMoving(false);
              setSelectMode(false);
            }}
            className="rounded-full border-2 border-asphalt-900 bg-white px-2.5 py-0.5 text-[11px] font-bold text-asphalt-900 hover:bg-asphalt-100"
          >
            Exit
          </button>
        </div>
      )}

      <div className="absolute bottom-3 left-3 flex items-center gap-2">
        {grid.size > 0 && (
          <button
            onClick={(e) => {
              e.stopPropagation();
              focusCity();
            }}
            className="flex items-center gap-1.5 rounded-full border-2 border-asphalt-900 bg-white/90 px-3 py-1 text-[11px] font-bold text-asphalt-700 shadow-tile backdrop-blur hover:-translate-y-0.5 hover:bg-marigold-400/20 active:translate-y-0 transition"
            title="Find my city"
          >
            <LocateIcon />
            Find City
          </button>
        )}

        <button
          onClick={(e) => {
            e.stopPropagation();
            setSelectMode(!selectMode);
          }}
          className={`flex items-center gap-1.5 rounded-full border-2 border-asphalt-900 px-3 py-1 text-[11px] font-bold shadow-tile backdrop-blur transition hover:-translate-y-0.5 ${
            selectMode ? "bg-cyan-300 text-asphalt-950" : "bg-white/90 text-asphalt-700 hover:bg-cyan-100"
          }`}
          title="Select multiple tiles"
        >
          <SelectIcon />
          {selectMode ? "Selecting" : "Select"}
        </button>

        <div className="flex items-center gap-1 rounded-full border-2 border-asphalt-900 bg-white/90 px-1.5 py-1 shadow-tile backdrop-blur">
          <button
            onClick={(e) => {
              e.stopPropagation();
              zoomAroundPoint(zoom - ZOOM_STEP);
            }}
            className="grid h-6 w-6 place-items-center rounded-full border border-asphalt-300 text-sm font-black text-asphalt-700 hover:bg-asphalt-100"
            title="Zoom out"
          >
            -
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              zoomAroundPoint(1);
            }}
            className="min-w-[56px] rounded-full border border-asphalt-300 px-2.5 py-0.5 text-[11px] font-extrabold text-asphalt-700 tabular-nums hover:bg-asphalt-100"
            title="Reset zoom"
          >
            {Math.round(zoom * 100)}%
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              zoomAroundPoint(zoom + ZOOM_STEP);
            }}
            className="grid h-6 w-6 place-items-center rounded-full border border-asphalt-300 text-sm font-black text-asphalt-700 hover:bg-asphalt-100"
            title="Zoom in"
          >
            +
          </button>
        </div>
      </div>

      <div className="absolute bottom-3 right-3 rounded-full border-2 border-asphalt-900 bg-white/80 px-3 py-1 text-[11px] font-bold text-asphalt-700 backdrop-blur">
        Right-click tile to rotate | Right-click + drag to pan | Mouse wheel to zoom
      </div>
    </div>
  );
}

function SelectIcon() {
  return (
    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="3" width="7" height="7" rx="1" />
      <rect x="14" y="3" width="7" height="7" rx="1" />
      <rect x="3" y="14" width="7" height="7" rx="1" />
      <rect x="14" y="14" width="7" height="7" rx="1" />
    </svg>
  );
}

function LocateIcon() {
  return (
    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="4" />
      <line x1="12" y1="2" x2="12" y2="6" />
      <line x1="12" y1="18" x2="12" y2="22" />
      <line x1="2" y1="12" x2="6" y2="12" />
      <line x1="18" y1="12" x2="22" y2="12" />
    </svg>
  );
}

function getTileLabel(tile: Tile) {
  return tile.type === "road" ? ROADS[tile.kind].label : tile.type === "water" ? WATERS[tile.kind].label : BUILDINGS[tile.kind].label;
}

function getTileHindi(tile: Tile) {
  return tile.type === "road" ? ROADS[tile.kind].hindi : tile.type === "water" ? WATERS[tile.kind].hindi : BUILDINGS[tile.kind].hindi;
}

function getSelectedToolLabel(tool: SelectedTool) {
  return tool.type === "road" ? ROADS[tool.kind].label : tool.type === "water" ? WATERS[tool.kind].label : BUILDINGS[tool.kind].label;
}

function TileNameCloud({
  screenX,
  screenY,
  tileSize,
  viewportWidth,
  name,
  hindi,
  editing,
  draftName,
  onStartEdit,
  onDraftChange,
  onCancel,
  onSave,
}: {
  screenX: number;
  screenY: number;
  tileSize: number;
  viewportWidth: number;
  name: string;
  hindi: string;
  editing: boolean;
  draftName: string;
  onStartEdit: () => void;
  onDraftChange: (value: string) => void;
  onCancel: () => void;
  onSave: () => void;
}) {
  const below = screenY < tileSize * 0.9;
  const left = Math.min(Math.max(screenX + tileSize / 2 - 88, 8), viewportWidth - 192);
  const top = below ? screenY + tileSize - 2 : screenY - 54;

  const stop = (e: ReactMouseEvent) => {
    e.stopPropagation();
  };

  const submit = (e: FormEvent) => {
    e.preventDefault();
    onSave();
  };

  return (
    <div
      data-tile-name-cloud
      className="absolute z-30 w-48 rounded-[26px] border-[3px] border-fuchsia-500 bg-[#FFF7AD] px-4 py-2.5 text-asphalt-950 shadow-[0_8px_0_#7C2D12,0_18px_30px_rgba(124,45,18,0.35)]"
      style={{ left, top }}
      onClick={stop}
      onContextMenu={stop}
      onMouseDown={stop}
    >
      <div
        className={`absolute left-1/2 h-5 w-5 -translate-x-1/2 rotate-45 border-fuchsia-500 bg-[#FFF7AD] ${
          below ? "-top-3 border-l-[3px] border-t-[3px]" : "-bottom-3 border-b-[3px] border-r-[3px]"
        }`}
      />
      <div className="absolute -left-3 top-3 h-7 w-7 rounded-full border-[3px] border-fuchsia-500 bg-[#FFF7AD]" />
      <div className="absolute -right-4 top-2 h-9 w-9 rounded-full border-[3px] border-fuchsia-500 bg-[#FFF7AD]" />
      <div className="absolute left-7 -top-4 h-8 w-8 rounded-full border-[3px] border-fuchsia-500 bg-[#FFF7AD]" />

      {editing ? (
        <form onSubmit={submit} className="relative flex flex-col gap-2">
          <input
            value={draftName}
            onChange={(e) => onDraftChange(e.target.value)}
            autoFocus
            maxLength={28}
            className="h-9 rounded-xl border-2 border-asphalt-900 bg-white px-2 font-display text-sm font-extrabold text-asphalt-950 outline-none ring-fuchsia-300 focus:ring-4"
            placeholder="Tile name"
          />
          <div className="flex gap-1.5">
            <button type="submit" className="flex-1 rounded-xl border-2 border-asphalt-900 bg-lime-300 px-2 py-1 text-xs font-extrabold text-asphalt-950 shadow-tile">
              Save
            </button>
            <button type="button" onClick={onCancel} className="flex-1 rounded-xl border-2 border-asphalt-900 bg-white px-2 py-1 text-xs font-bold text-asphalt-900 hover:bg-fuchsia-100">
              Cancel
            </button>
          </div>
        </form>
      ) : (
        <div className="relative flex items-center gap-2">
          <div className="min-w-0 flex-1">
            <div className="truncate font-display text-base font-extrabold leading-tight text-fuchsia-700 drop-shadow-[1px_1px_0_#ffffff]">{name}</div>
            <div className="truncate text-[10px] font-black uppercase text-asphalt-700">{hindi}</div>
          </div>
          <button
            type="button"
            onClick={onStartEdit}
            className="grid h-9 w-9 shrink-0 place-items-center rounded-full border-2 border-asphalt-900 bg-fuchsia-500 text-white shadow-[0_3px_0_#1E293B] hover:-translate-y-0.5 hover:bg-lime-300 hover:text-asphalt-950"
            aria-label="Edit tile name"
            title="Edit tile name"
          >
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" aria-hidden="true">
              <path d="M4 20H8L18.5 9.5L14.5 5.5L4 16V20Z" fill="currentColor" />
              <path d="M13.5 6.5L17.5 10.5" stroke="#1E293B" strokeWidth="1.6" strokeLinecap="round" />
              <path d="M15.5 4.5L19.5 8.5L20.5 7.5C21.3 6.7 21.3 5.4 20.5 4.6L19.4 3.5C18.6 2.7 17.3 2.7 16.5 3.5L15.5 4.5Z" fill="currentColor" />
            </svg>
          </button>
        </div>
      )}
    </div>
  );
}

