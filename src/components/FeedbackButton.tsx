"use client";
import { useEffect, useMemo, useRef, useState } from "react";

type Request = {
  id: string;
  text: string;
  done: boolean;
  category: string;
  createdAt: number;
};

type Category = {
  id: string;
  name: string;
  color: string;
  builtin?: boolean;
};

const STORAGE_KEY = "chowkcraft:feature-requests";
const CATEGORIES_KEY = "chowkcraft:feature-categories";

const DEFAULT_CATEGORIES: Category[] = [
  { id: "low", name: "Low", color: "#10b981", builtin: true },
  { id: "medium", name: "Medium", color: "#f59e0b", builtin: true },
  { id: "high", name: "High", color: "#ef4444", builtin: true },
];

function loadJSON<T>(key: string, fallback: T): T {
  if (typeof window === "undefined") return fallback;
  try {
    const raw = window.localStorage.getItem(key);
    if (!raw) return fallback;
    const parsed = JSON.parse(raw);
    return parsed ?? fallback;
  } catch {
    return fallback;
  }
}

function saveJSON(key: string, value: unknown) {
  try {
    window.localStorage.setItem(key, JSON.stringify(value));
  } catch {}
}

export function FeedbackButton() {
  const [open, setOpen] = useState(false);
  const [items, setItems] = useState<Request[]>([]);
  const [categories, setCategories] = useState<Category[]>(DEFAULT_CATEGORIES);
  const [draft, setDraft] = useState("");
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);
  const [moveOpenId, setMoveOpenId] = useState<string | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [activeCategory, setActiveCategory] = useState<string>("all");
  const [addingCategory, setAddingCategory] = useState(false);
  const [newCategoryName, setNewCategoryName] = useState("");
  const popupRef = useRef<HTMLDivElement | null>(null);
  const btnRef = useRef<HTMLButtonElement | null>(null);

  useEffect(() => {
    const loaded = loadJSON<Request[]>(STORAGE_KEY, []);
    const migrated = (Array.isArray(loaded) ? loaded : []).map((it) => ({
      ...it,
      category: it.category ?? "low",
    }));
    setItems(migrated);
    const cats = loadJSON<Category[]>(CATEGORIES_KEY, DEFAULT_CATEGORIES);
    const merged = mergeCategories(cats);
    setCategories(merged);
  }, []);

  useEffect(() => {
    if (!open) return;
    function onDocClick(e: MouseEvent) {
      const t = e.target as Node;
      if (popupRef.current?.contains(t) || btnRef.current?.contains(t)) return;
      setOpen(false);
      setConfirmDeleteId(null);
      setMoveOpenId(null);
    }
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") {
        setOpen(false);
        setConfirmDeleteId(null);
        setMoveOpenId(null);
      }
    }
    document.addEventListener("mousedown", onDocClick);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onDocClick);
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  function update(next: Request[]) {
    setItems(next);
    saveJSON(STORAGE_KEY, next);
  }

  function updateCategories(next: Category[]) {
    setCategories(next);
    saveJSON(CATEGORIES_KEY, next);
  }

  function addItem() {
    const text = draft.trim();
    if (!text) return;
    const item: Request = {
      id: Math.random().toString(36).slice(2, 10),
      text,
      done: false,
      category: activeCategory === "all" ? "low" : activeCategory,
      createdAt: Date.now(),
    };
    update([item, ...items]);
    setDraft("");
  }

  function toggleDone(id: string) {
    update(items.map((it) => (it.id === id ? { ...it, done: !it.done } : it)));
  }

  function deleteItem(id: string) {
    update(items.filter((it) => it.id !== id));
    setConfirmDeleteId(null);
  }

  function moveItem(id: string, categoryId: string) {
    update(items.map((it) => (it.id === id ? { ...it, category: categoryId } : it)));
    setMoveOpenId(null);
  }

  async function copyText(id: string, text: string) {
    try {
      await navigator.clipboard.writeText(text);
    } catch {
      const el = document.createElement("textarea");
      el.value = text;
      document.body.appendChild(el);
      el.select();
      try {
        document.execCommand("copy");
      } catch {}
      document.body.removeChild(el);
    }
    setCopiedId(id);
    window.setTimeout(() => {
      setCopiedId((cur) => (cur === id ? null : cur));
    }, 1200);
  }

  function addCategory() {
    const name = newCategoryName.trim();
    if (!name) return;
    const id =
      name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "") +
      "-" +
      Math.random().toString(36).slice(2, 5);
    const palette = ["#a259ff", "#06b6d4", "#ec4899", "#84cc16", "#f97316", "#0ea5e9"];
    const color = palette[categories.length % palette.length];
    const next: Category = { id, name, color };
    updateCategories([...categories, next]);
    setNewCategoryName("");
    setAddingCategory(false);
    setActiveCategory(id);
  }

  function deleteCategory(id: string) {
    const cat = categories.find((c) => c.id === id);
    if (!cat || cat.builtin) return;
    updateCategories(categories.filter((c) => c.id !== id));
    update(items.map((it) => (it.category === id ? { ...it, category: "low" } : it)));
    if (activeCategory === id) setActiveCategory("all");
  }

  const filtered = useMemo(
    () =>
      activeCategory === "all"
        ? items
        : items.filter((it) => it.category === activeCategory),
    [items, activeCategory],
  );

  const openCount = items.filter((it) => !it.done).length;
  const categoryById = useMemo(() => {
    const m = new Map<string, Category>();
    categories.forEach((c) => m.set(c.id, c));
    return m;
  }, [categories]);

  return (
    <div className="relative">
      <button
        ref={btnRef}
        onClick={() => setOpen((v) => !v)}
        className="relative px-2.5 sm:px-3 py-1.5 rounded-full text-sm font-semibold transition text-asphalt-700 hover:bg-asphalt-100 flex items-center gap-1.5"
        title="Feature requests & bug reports"
        aria-label="Feedback"
        aria-expanded={open}
      >
        <FeedbackIcon />
        <span className="hidden sm:inline">Feedback</span>
        {openCount > 0 && (
          <span className="absolute -top-0.5 -right-0.5 min-w-[18px] h-[18px] px-1 rounded-full bg-fuchsia-500 text-white text-[10px] font-bold flex items-center justify-center border-2 border-white">
            {openCount}
          </span>
        )}
      </button>

      {open && (
        <div
          ref={popupRef}
          className="absolute right-0 mt-2 w-[min(92vw,380px)] max-h-[min(80vh,560px)] overflow-hidden rounded-2xl border-2 border-asphalt-900 bg-white shadow-tile z-40 flex flex-col"
        >
          <div className="px-3 py-2 border-b-2 border-asphalt-200 bg-marigold-50">
            <div className="text-[11px] font-bold uppercase tracking-wider text-asphalt-500 mb-1">
              New request
            </div>
            <div className="flex gap-1.5">
              <input
                type="text"
                value={draft}
                onChange={(e) => setDraft(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") addItem();
                }}
                placeholder="Describe a feature or bug…"
                className="flex-1 min-w-0 px-2.5 py-1.5 rounded-lg border-2 border-asphalt-300 bg-white text-sm text-asphalt-900 placeholder-asphalt-400 focus:outline-none focus:border-asphalt-900"
              />
              <button
                onClick={addItem}
                disabled={!draft.trim()}
                className="px-3 py-1.5 rounded-lg bg-asphalt-900 text-white text-sm font-semibold disabled:opacity-40 hover:bg-asphalt-800 transition"
              >
                Add
              </button>
            </div>
          </div>

          <div className="px-2 py-1.5 border-b border-asphalt-200 bg-white flex gap-1 overflow-x-auto">
            <CategoryChip
              label="All"
              count={items.length}
              active={activeCategory === "all"}
              onClick={() => setActiveCategory("all")}
            />
            {categories.map((c) => (
              <CategoryChip
                key={c.id}
                label={c.name}
                count={items.filter((it) => it.category === c.id).length}
                active={activeCategory === c.id}
                color={c.color}
                onClick={() => setActiveCategory(c.id)}
                onDelete={c.builtin ? undefined : () => deleteCategory(c.id)}
              />
            ))}
            {addingCategory ? (
              <div className="flex items-center gap-1 shrink-0">
                <input
                  autoFocus
                  type="text"
                  value={newCategoryName}
                  onChange={(e) => setNewCategoryName(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") addCategory();
                    if (e.key === "Escape") {
                      setAddingCategory(false);
                      setNewCategoryName("");
                    }
                  }}
                  placeholder="Name"
                  className="w-20 px-2 py-0.5 rounded-full border-2 border-asphalt-300 text-xs focus:outline-none focus:border-asphalt-900"
                />
                <button
                  onClick={addCategory}
                  className="text-xs font-bold text-emerald-600 hover:text-emerald-700"
                >
                  ✓
                </button>
                <button
                  onClick={() => {
                    setAddingCategory(false);
                    setNewCategoryName("");
                  }}
                  className="text-xs font-bold text-asphalt-400 hover:text-asphalt-700"
                >
                  ✕
                </button>
              </div>
            ) : (
              <button
                onClick={() => setAddingCategory(true)}
                className="shrink-0 px-2 py-0.5 rounded-full border border-dashed border-asphalt-400 text-asphalt-500 text-xs font-semibold hover:border-asphalt-700 hover:text-asphalt-700 transition"
                title="Add category"
              >
                + Cat
              </button>
            )}
          </div>

          <div className="overflow-y-auto flex-1">
            {filtered.length === 0 ? (
              <div className="px-4 py-8 text-center text-sm text-asphalt-500">
                {items.length === 0 ? (
                  <>
                    No requests yet.
                    <br />
                    Add the first one above.
                  </>
                ) : (
                  <>Nothing in this category.</>
                )}
              </div>
            ) : (
              <ul className="divide-y divide-asphalt-100">
                {filtered.map((it) => {
                  const cat = categoryById.get(it.category);
                  return (
                    <li
                      key={it.id}
                      className="px-3 py-2 flex items-start gap-2 hover:bg-asphalt-50 relative"
                    >
                      <input
                        type="checkbox"
                        checked={it.done}
                        onChange={() => toggleDone(it.id)}
                        className="mt-1 h-4 w-4 shrink-0 cursor-pointer accent-emerald-500"
                        aria-label="Mark complete"
                      />
                      <div className="flex-1 min-w-0">
                        <div
                          className={`text-sm break-words ${
                            it.done
                              ? "line-through text-asphalt-400"
                              : "text-asphalt-900"
                          }`}
                        >
                          {it.text}
                        </div>
                        {cat && (
                          <button
                            onClick={() =>
                              setMoveOpenId(moveOpenId === it.id ? null : it.id)
                            }
                            className="mt-1 inline-flex items-center gap-1 px-1.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider hover:opacity-80 transition"
                            style={{
                              backgroundColor: cat.color + "22",
                              color: cat.color,
                            }}
                            title="Move to category"
                          >
                            <span
                              className="h-1.5 w-1.5 rounded-full"
                              style={{ backgroundColor: cat.color }}
                            />
                            {cat.name}
                            <span className="text-[8px]">▾</span>
                          </button>
                        )}
                        {moveOpenId === it.id && (
                          <div className="absolute left-9 z-10 mt-1 rounded-lg border-2 border-asphalt-900 bg-white shadow-tile py-1">
                            {categories.map((c) => (
                              <button
                                key={c.id}
                                onClick={() => moveItem(it.id, c.id)}
                                className={`w-full px-3 py-1 text-left text-xs font-semibold hover:bg-asphalt-50 flex items-center gap-2 ${
                                  c.id === it.category ? "bg-asphalt-50" : ""
                                }`}
                              >
                                <span
                                  className="h-2 w-2 rounded-full"
                                  style={{ backgroundColor: c.color }}
                                />
                                {c.name}
                              </button>
                            ))}
                          </div>
                        )}
                      </div>
                      <div className="flex items-center gap-0.5 shrink-0">
                        <button
                          onClick={() => copyText(it.id, it.text)}
                          className="p-1 rounded-md text-asphalt-400 hover:text-asphalt-900 hover:bg-asphalt-100 transition"
                          aria-label="Copy"
                          title={copiedId === it.id ? "Copied!" : "Copy text"}
                        >
                          {copiedId === it.id ? <CheckIcon /> : <CopyIcon />}
                        </button>
                        {confirmDeleteId === it.id ? (
                          <div className="flex items-center gap-1">
                            <button
                              onClick={() => deleteItem(it.id)}
                              className="px-2 py-0.5 rounded-md bg-red-500 text-white text-xs font-semibold hover:bg-red-600 transition"
                            >
                              Delete?
                            </button>
                            <button
                              onClick={() => setConfirmDeleteId(null)}
                              className="px-2 py-0.5 rounded-md bg-asphalt-100 text-asphalt-700 text-xs font-semibold hover:bg-asphalt-200 transition"
                            >
                              Cancel
                            </button>
                          </div>
                        ) : (
                          <button
                            onClick={() => setConfirmDeleteId(it.id)}
                            className="p-1 rounded-md text-asphalt-400 hover:text-red-500 hover:bg-red-50 transition"
                            aria-label="Delete"
                            title="Delete"
                          >
                            <TrashIcon />
                          </button>
                        )}
                      </div>
                    </li>
                  );
                })}
              </ul>
            )}
          </div>

          {items.length > 0 && (
            <div className="px-3 py-1.5 border-t-2 border-asphalt-200 bg-asphalt-50 text-[11px] text-asphalt-500 flex justify-between">
              <span>{openCount} open</span>
              <span>{items.length - openCount} done</span>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

function mergeCategories(stored: Category[]): Category[] {
  const map = new Map<string, Category>();
  DEFAULT_CATEGORIES.forEach((c) => map.set(c.id, c));
  if (Array.isArray(stored)) {
    stored.forEach((c) => {
      if (!c || !c.id) return;
      map.set(c.id, { ...map.get(c.id), ...c });
    });
  }
  return Array.from(map.values());
}

function CategoryChip({
  label,
  count,
  active,
  color,
  onClick,
  onDelete,
}: {
  label: string;
  count: number;
  active: boolean;
  color?: string;
  onClick: () => void;
  onDelete?: () => void;
}) {
  return (
    <div className="shrink-0 inline-flex items-center">
      <button
        onClick={onClick}
        className={`px-2 py-0.5 rounded-full text-xs font-semibold transition flex items-center gap-1 border-2 ${
          active
            ? "bg-asphalt-900 text-white border-asphalt-900"
            : "bg-white text-asphalt-700 border-asphalt-200 hover:border-asphalt-400"
        }`}
        style={
          active && color
            ? { backgroundColor: color, borderColor: color, color: "#fff" }
            : undefined
        }
      >
        {color && (
          <span
            className="h-1.5 w-1.5 rounded-full"
            style={{ backgroundColor: active ? "#fff" : color }}
          />
        )}
        {label}
        <span className="opacity-70">{count}</span>
      </button>
      {onDelete && (
        <button
          onClick={onDelete}
          className="ml-0.5 text-asphalt-300 hover:text-red-500 text-xs"
          title={`Delete ${label} category`}
          aria-label={`Delete ${label} category`}
        >
          ×
        </button>
      )}
    </div>
  );
}

function FeedbackIcon() {
  return (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
      <line x1="12" y1="8" x2="12" y2="12" />
      <line x1="12" y1="15" x2="12" y2="15" />
    </svg>
  );
}

function TrashIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="3 6 5 6 21 6" />
      <path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6" />
      <path d="M10 11v6M14 11v6" />
      <path d="M9 6V4a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2v2" />
    </svg>
  );
}

function CopyIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
      <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
    </svg>
  );
}

function CheckIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#10b981" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="20 6 9 17 4 12" />
    </svg>
  );
}
