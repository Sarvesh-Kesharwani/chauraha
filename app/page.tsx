import { Header } from "@/components/Header";
import { GridCanvas } from "@/components/GridCanvas";
import { RoadPalette } from "@/components/RoadPalette";
import { ScoreBoard } from "@/components/ScoreBoard";

export default function Page() {
  return (
    <main className="min-h-screen flex flex-col">
      <Header />
      <section className="flex-1 max-w-[1400px] w-full mx-auto px-6 py-6">
        <div className="mb-5">
          <h1 className="font-display font-extrabold text-3xl text-asphalt-900 leading-tight">
            Plan your <span className="text-marigold-600">Chauraha</span>.
          </h1>
          <p className="text-asphalt-500">
            Drag sadak blocks onto the grid. Match connectors. Build loops. Avoid open ends and mismatches.
          </p>
        </div>

        <div className="flex gap-5 items-start flex-wrap">
          <RoadPalette />
          <div className="flex-1 min-w-[600px]">
            <GridCanvas />
            <div className="mt-3 text-xs text-asphalt-500">
              Tip: Hover a placed tile and press <kbd className="px-1 bg-white border rounded">R</kbd> to rotate it.
            </div>
          </div>
          <ScoreBoard />
        </div>
      </section>

      <footer className="border-t border-asphalt-200 py-4 text-center text-xs text-asphalt-500">
        Chauraha · Built with Next.js · Made in India
      </footer>
    </main>
  );
}
