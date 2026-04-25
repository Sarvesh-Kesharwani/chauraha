import { AuthControls } from "@/components/AuthControls";

interface HeaderProps {
  onSettingsOpen: () => void;
  cityName?: string;
}

export function Header({ onSettingsOpen, cityName }: HeaderProps) {
  return (
    <header className="w-full bg-white/70 backdrop-blur-md border-b-2 border-asphalt-200">
      <div className="max-w-[1400px] mx-auto px-6 py-3 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Logo />
          <div>
            <div className="font-display font-extrabold text-xl text-asphalt-900 leading-none">ChowkCraft</div>
            {cityName ? (
              <div className="text-[11px] text-asphalt-500 leading-none mt-0.5">
                Building: <span className="font-bold text-asphalt-700">{cityName}</span>
              </div>
            ) : (
              <div className="text-[11px] text-asphalt-500 leading-none mt-0.5">Desi city map maker</div>
            )}
          </div>
        </div>

        <nav className="flex items-center gap-2">
          <button
            onClick={onSettingsOpen}
            className="px-3 py-1.5 rounded-full text-sm font-semibold transition text-asphalt-700 hover:bg-asphalt-100 flex items-center gap-1.5"
          >
            <GearIcon />
            Settings
          </button>
          <Pill active>Builder</Pill>
          <AuthControls />
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
    <div className="relative flex h-12 w-12 items-center justify-center rounded-[18px] border-[3px] border-asphalt-900 bg-[#FFF7AD] shadow-[0_5px_0_#1E293B]">
      <div className="absolute -right-1 -top-1 h-4 w-4 rounded-full border-2 border-asphalt-900 bg-fuchsia-500" />
      <svg width="38" height="38" viewBox="0 0 48 48" aria-hidden="true">
        <defs>
          <linearGradient id="logoRoad" x1="0" x2="1" y1="0" y2="1">
            <stop stopColor="#475569" />
            <stop offset="1" stopColor="#0F172A" />
          </linearGradient>
        </defs>
        <path d="M24 3 C35 3 44 12 44 23 C44 36 29 44 24 46 C19 44 4 36 4 23 C4 12 13 3 24 3Z" fill="#A7F3D0" stroke="#1E293B" strokeWidth="3" />
        <path d="M20 7 H28 V41 H20 Z" fill="url(#logoRoad)" />
        <path d="M7 20 H41 V28 H7 Z" fill="url(#logoRoad)" />
        <path d="M24 9 V39 M9 24 H39" stroke="#FDE68A" strokeWidth="2.4" strokeDasharray="5 4" strokeLinecap="round" />
        <circle cx="24" cy="24" r="7" fill="#F59E0B" stroke="#1E293B" strokeWidth="2.5" />
        <circle cx="24" cy="24" r="2.5" fill="#10B981" />
        <path d="M14 13 L20 8 L26 13" fill="#38BDF8" stroke="#1E293B" strokeWidth="1.6" strokeLinejoin="round" />
        <rect x="15" y="13" width="9" height="8" rx="1.5" fill="#DBEAFE" stroke="#1E293B" strokeWidth="1.5" />
        <path d="M32 33 L38 28 L43 33" fill="#F472B6" stroke="#1E293B" strokeWidth="1.6" strokeLinejoin="round" />
        <rect x="33" y="33" width="8" height="7" rx="1.4" fill="#FCE7F3" stroke="#1E293B" strokeWidth="1.5" />
      </svg>
    </div>
  );
}

function GearIcon() {
  return (
    <svg width="15" height="15" viewBox="0 0 15 15" fill="none">
      <path d="M7.5 9.5a2 2 0 100-4 2 2 0 000 4z" stroke="currentColor" strokeWidth="1.4" />
      <path
        d="M12.2 9.1l.6 1-.9 1.6-1.1-.3a4.8 4.8 0 01-1 .6l-.2 1.1H8l-.2-1.1a4.8 4.8 0 01-1-.6l-1.1.3-.9-1.6.6-1a4.9 4.9 0 010-1.2l-.6-1 .9-1.6 1.1.3a4.8 4.8 0 011-.6L8 3.9h1.6l.2 1.1a4.8 4.8 0 011 .6l1.1-.3.9 1.6-.6 1a4.9 4.9 0 010 1.2z"
        stroke="currentColor"
        strokeWidth="1.4"
        strokeLinejoin="round"
      />
    </svg>
  );
}
