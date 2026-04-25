"use client";
import { useState } from "react";
import { useGame } from "@/store/game";

function randomCode() {
  return Math.random().toString(36).slice(2, 8).toUpperCase();
}

interface Props {
  open: boolean;
  onClose: () => void;
}

export function SettingsPanel({ open, onClose }: Props) {
  const maps = useGame((s) => s.maps);
  const activeMapId = useGame((s) => s.activeMapId);
  const addMap = useGame((s) => s.addMap);
  const deleteMap = useGame((s) => s.deleteMap);
  const renameMap = useGame((s) => s.renameMap);
  const switchMap = useGame((s) => s.switchMap);
  const clearAll = useGame((s) => s.clearAll);
  const logout = useGame((s) => s.logout);

  const [newName, setNewName] = useState("");
  const [renamingId, setRenamingId] = useState<string | null>(null);
  const [renameVal, setRenameVal] = useState("");

  const [clearCode, setClearCode] = useState("");
  const [clearInput, setClearInput] = useState("");
  const [showClear, setShowClear] = useState(false);

  const activeMap = maps.find((m) => m.id === activeMapId);

  function handleAdd() {
    const name = newName.trim();
    if (!name) return;
    addMap(name);
    setNewName("");
  }

  function startRename(id: string, current: string) {
    setRenamingId(id);
    setRenameVal(current);
  }

  function commitRename() {
    if (renamingId && renameVal.trim()) renameMap(renamingId, renameVal.trim());
    setRenamingId(null);
    setRenameVal("");
  }

  function openClear() {
    setClearCode(randomCode());
    setClearInput("");
    setShowClear(true);
  }

  function confirmClear() {
    if (clearInput !== clearCode) return;
    clearAll();
    setShowClear(false);
    setClearInput("");
  }

  if (!open) return null;

  return (
    <>
      <div className="fixed inset-0 bg-black/40 z-30" onClick={onClose} />

      <aside className="fixed right-0 top-0 h-full w-[360px] bg-white z-40 shadow-2xl flex flex-col">
        <div className="flex items-center justify-between px-5 py-4 border-b-2 border-asphalt-200 shrink-0">
          <h2 className="font-display font-extrabold text-xl text-asphalt-900">Settings</h2>
          <button
            onClick={onClose}
            className="rounded-lg p-1.5 hover:bg-asphalt-100 text-asphalt-500"
          >
            <XIcon />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-5 space-y-6">
          <section>
            <SectionLabel>Current Map</SectionLabel>
            {activeMap && (
              <div className="bg-marigold-400/10 border-2 border-marigold-400/50 rounded-xl p-3 mb-3">
                <p className="text-xs text-marigold-600 font-semibold mb-0.5">Active</p>
                <p className="font-display font-extrabold text-lg text-asphalt-900">{activeMap.name}</p>
              </div>
            )}
            <button
              onClick={openClear}
              className="w-full rounded-xl border-2 border-asphalt-200 bg-white py-2 text-sm font-bold text-asphalt-700 hover:bg-red-50 hover:border-red-300 hover:text-red-600 shadow-tile active:translate-y-0.5"
            >
              Clear City
            </button>
          </section>

          <section>
            <SectionLabel>Your Maps</SectionLabel>
            <ul className="space-y-2 mb-3">
              {maps.map((map) => (
                <li
                  key={map.id}
                  className={`rounded-xl border-2 p-3 flex items-center gap-2 ${
                    map.id === activeMapId
                      ? "border-marigold-400 bg-marigold-50"
                      : "border-asphalt-200 bg-white"
                  }`}
                >
                  {renamingId === map.id ? (
                    <input
                      className="flex-1 text-sm font-semibold border border-asphalt-300 rounded-lg px-2 py-1 focus:outline-none focus:border-marigold-400"
                      value={renameVal}
                      onChange={(e) => setRenameVal(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === "Enter") commitRename();
                        if (e.key === "Escape") setRenamingId(null);
                      }}
                      autoFocus
                    />
                  ) : (
                    <button
                      className="flex-1 text-left text-sm font-semibold text-asphalt-900 truncate"
                      onClick={() => switchMap(map.id)}
                    >
                      {map.name}
                      {map.id === activeMapId && (
                        <span className="ml-2 text-xs text-marigold-600 font-normal">active</span>
                      )}
                    </button>
                  )}

                  <div className="flex items-center gap-1 shrink-0">
                    {renamingId === map.id ? (
                      <button
                        onClick={commitRename}
                        className="px-2 py-0.5 rounded text-xs font-bold text-green-600 hover:bg-green-50"
                      >
                        Save
                      </button>
                    ) : (
                      <button
                        onClick={() => startRename(map.id, map.name)}
                        className="p-1 rounded hover:bg-asphalt-100 text-asphalt-400"
                        title="Rename"
                      >
                        <PencilIcon />
                      </button>
                    )}
                    <button
                      onClick={() => deleteMap(map.id)}
                      disabled={maps.length <= 1}
                      className="p-1 rounded hover:bg-red-50 text-asphalt-400 hover:text-red-500 disabled:opacity-30"
                      title="Delete"
                    >
                      <TrashIcon />
                    </button>
                  </div>
                </li>
              ))}
            </ul>

            <div className="flex gap-2">
              <input
                className="flex-1 text-sm border-2 border-asphalt-200 rounded-xl px-3 py-2 focus:outline-none focus:border-marigold-400"
                placeholder="New city name..."
                value={newName}
                onChange={(e) => setNewName(e.target.value)}
                onKeyDown={(e) => { if (e.key === "Enter") handleAdd(); }}
              />
              <button
                onClick={handleAdd}
                disabled={!newName.trim()}
                className="rounded-xl bg-asphalt-900 text-white font-bold px-3 py-2 text-sm hover:bg-asphalt-700 disabled:opacity-40 shadow-pop active:translate-y-0.5"
              >
                Add
              </button>
            </div>
          </section>

          <section>
            <SectionLabel>Account</SectionLabel>
            <button
              onClick={() => { logout(); onClose(); }}
              className="w-full rounded-xl border-2 border-asphalt-200 bg-white py-2 text-sm font-bold text-asphalt-700 hover:bg-asphalt-50 shadow-tile active:translate-y-0.5"
            >
              Sign Out
            </button>
          </section>
        </div>
      </aside>

      {showClear && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60"
          onClick={() => { setShowClear(false); setClearInput(""); }}
        >
          <div
            className="bg-white rounded-2xl shadow-2xl border-2 border-asphalt-200 w-full max-w-sm p-6"
            onClick={(e) => e.stopPropagation()}
          >
            <h3 className="font-display font-extrabold text-lg text-asphalt-900 mb-1">Clear city?</h3>
            <p className="text-sm text-asphalt-500 mb-4">
              All tiles will be permanently erased. Type the code below to confirm.
            </p>
            <div className="bg-asphalt-100 rounded-xl px-4 py-3 text-center mb-4">
              <span className="font-mono font-extrabold text-2xl tracking-widest text-asphalt-900 select-none">
                {clearCode}
              </span>
            </div>
            <input
              className="w-full border-2 border-asphalt-200 rounded-xl px-3 py-2 font-mono text-center text-lg tracking-widest focus:outline-none focus:border-red-400 mb-4"
              placeholder="Type code here"
              value={clearInput}
              onChange={(e) => setClearInput(e.target.value.toUpperCase())}
              autoFocus
            />
            <div className="flex gap-3">
              <button
                onClick={() => { setShowClear(false); setClearInput(""); }}
                className="flex-1 rounded-xl border-2 border-asphalt-200 py-2 font-bold text-asphalt-700 hover:bg-asphalt-50"
              >
                Cancel
              </button>
              <button
                onClick={confirmClear}
                disabled={clearInput !== clearCode}
                className="flex-1 rounded-xl bg-red-500 text-white font-bold py-2 hover:bg-red-600 disabled:opacity-40 shadow-pop active:translate-y-0.5"
              >
                Clear
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <p className="text-xs font-bold text-asphalt-500 uppercase tracking-wider mb-2">{children}</p>
  );
}

function XIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
      <path d="M5 5l10 10M15 5L5 15" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
}

function PencilIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
      <path d="M11 2l3 3L5 14H2v-3L11 2z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" />
    </svg>
  );
}

function TrashIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
      <path
        d="M3 5h10M7 8v4M9 8v4M5 5l1-2h4l1 2M6 5v7h4V5"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
