import Link from "next/link";
import { TroutLogo } from "@/components/wall/trout-logo";
import { PineStand } from "@/components/wall/wilderness";

/** The bottom rail: the small trout, and where the numbers come from. */
export function SiteFooter() {
  return (
    <footer className="rail rail-bottom mt-auto">
      <PineStand className="mx-auto max-w-6xl px-4 text-trout-belly/50" />
      <div className="mx-auto grid w-full max-w-6xl grid-cols-1 gap-8 px-4 py-10 text-sm md:grid-cols-[220px_minmax(0,1fr)_minmax(0,1fr)]">
        <div className="min-w-0 space-y-3">
          <TroutLogo className="max-w-[140px]" />
          <p className="script text-3xl leading-none">Michigan Flies</p>
          <p className="woodtype-caps text-[0.76rem] opacity-80">Hand-tied for Michigan rivers</p>
        </div>
        <div className="min-w-0 space-y-2 opacity-90">
          <p className="woodtype-caps text-[0.76rem]">How the timing works</p>
          <p className="leading-relaxed md:max-w-prose">
            Hatch windows start from Au Sable and Manistee charts and shift by river, then adjust to live USGS water temperature and growing
            degree days from gridMET. Every claim carries a tag: S for scientific, A for angler consensus, I for our inference.{" "}
            <Link href="/about-the-data" className="underline">
              Read about the data
            </Link>
            .
          </p>
        </div>
        <div className="min-w-0 space-y-2 opacity-90">
          <p className="woodtype-caps text-[0.76rem]">Regulations and credits</p>
          <p className="leading-relaxed md:max-w-prose">
            Gear rules quoted here come from the 2026 Michigan Fishing Regulations digest and can change; confirm with the current DNR guide before you
            fish. Insect photographs are Creative Commons from iNaturalist observers, credited on each page. Stocking history is from the Michigan DNR
            Fish Stocking Database.
          </p>
        </div>
      </div>
    </footer>
  );
}
