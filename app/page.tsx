import { Header } from "@/components/Header";
import { GridCanvas } from "@/components/GridCanvas";
import { RoadPalette } from "@/components/RoadPalette";
import { ScoreBoard } from "@/components/ScoreBoard";

export default function Page() {
  return (
    <main className="h-screen flex flex-col overflow-hidden">
      <Header />
      <section className="flex-1 min-h-0 max-w-[1500px] w-full mx-auto px-4 py-4 overflow-hidden">
        <div className="mb-3">
          <h1 className="font-display font-extrabold text-3xl text-asphalt-900 leading-tight">
            Craft your <span className="text-marigold-600">ChowkCraft</span> city.
          </h1>
          <p className="text-asphalt-500 text-sm">
            Drag sadak blocks onto the grid. Match connectors. Build loops. Avoid open ends and mismatches.
          </p>
        </div>

        <div className="flex h-[calc(100%-72px)] min-h-0 gap-4 items-stretch">
          <RoadPalette />
          <div className="flex-1 min-w-0 min-h-0 flex flex-col">
            <GridCanvas />
            <div className="mt-3 text-xs text-asphalt-500">
              Tip: Hover a placed tile and press <kbd className="px-1 bg-white border rounded">R</kbd> to rotate it.
            </div>
          </div>
          <ScoreBoard />
        </div>
      </section>

      <footer className="border-t border-asphalt-200 py-2 text-center text-xs text-asphalt-500">
        ChowkCraft - Built with Next.js - Made in India
      </footer>
    </main>
  );
}
