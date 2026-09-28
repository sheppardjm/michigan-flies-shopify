import Link from "next/link";

export function SiteFooter() {
  return (
    <footer className="border-t border-border bg-muted/30">
      <div className="mx-auto grid w-full max-w-6xl gap-6 px-4 py-10 text-sm text-muted-foreground md:grid-cols-3">
        <div className="space-y-2">
          <p className="font-medium text-foreground">Michigan Flies</p>
          <p>Hand-tied flies and a hatch calendar built for Michigan rivers, from the Au Sable to the Two Hearted.</p>
        </div>
        <div className="space-y-2">
          <p className="font-medium text-foreground">How timing works</p>
          <p>
            Hatch windows start from northern Lower Peninsula charts and shift by river region, then adjust to live USGS
            water temperature and growing degree days from gridMET. Every claim carries a tag: S for scientific, A for
            angler consensus, I for our inference. <Link href="/about-the-data" className="underline underline-offset-4">Read about the data</Link>.
          </p>
        </div>
        <div className="space-y-2">
          <p className="font-medium text-foreground">Regulations</p>
          <p>
            Gear rules quoted here come from the 2026 Michigan Fishing Regulations digest and can change. Always confirm
            with the current Michigan DNR guide before you fish.
          </p>
        </div>
      </div>
    </footer>
  );
}
