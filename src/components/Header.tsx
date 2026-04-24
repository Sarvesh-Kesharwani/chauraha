"use client";

export function Header() {
  return (
    <header className="w-full bg-white/80 backdrop-blur border-b-2 border-asphalt-200 sticky top-0 z-20">
      <div className="max-w-[1400px] mx-auto px-6 py-3 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Logo />
          <div>
            <div className="font-display font-extrabold text-xl text-asphalt-900 leading-none">Chauraha</div>
            <div className="text-[11px] text-asphalt-500 leading-none mt-0.5">Desi city road builder</div>
          </div>
        </div>

        <nav className="flex items-center gap-2">
          <Pill>Career</Pill>
          <Pill>Free Play</Pill>
          <Pill active>Builder</Pill>
          <button
            className="ml-3 rounded-xl bg-asphalt-900 text-white font-bold px-4 py-2 shadow-pop hover:bg-asphalt-700 active:translate-y-0.5"
          >
            Sign in
          </button>
        </nav>
      </div>
    </header>
  );
}

function Pill({ children, active }: { children: React.ReactNode; active?: boolean }) {
  return (
    <button
      className={`px-3 py-1.5 rounded-full text-sm font-semibold transition ${
        active
          ? "bg-marigold-500 text-asphalt-900 shadow-tile"
          : "text-asphalt-700 hover:bg-asphalt-100"
      }`}
    >
      {children}
    </button>
  );
}

function Logo() {
  return (
    <div className="relative w-10 h-10 rounded-xl bg-asphalt-900 shadow-pop flex items-center justify-center">
      <svg width="28" height="28" viewBox="0 0 28 28">
        <rect x="11" y="0" width="6" height="28" fill="#F59E0B" />
        <rect x="0" y="11" width="28" height="6" fill="#F59E0B" />
        <circle cx="14" cy="14" r="3.5" fill="#10B981" />
      </svg>
    </div>
  );
}
