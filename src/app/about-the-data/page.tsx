import type { Metadata } from "next";
import Link from "next/link";
import { EvidenceBadge } from "@/components/evidence-badge";

export const metadata: Metadata = {
  title: "About the data",
  description: "Where the hatch windows, egg calendars, species ranges, and degree-day model come from, and how much to trust each piece.",
};

export default function AboutDataPage() {
  return (
    <article className="prose prose-neutral mx-auto w-full max-w-3xl px-4 py-8 dark:prose-invert sm:py-12">
      <h1 className="text-3xl font-semibold tracking-tight">About the data</h1>
      <p className="lead text-muted-foreground">
        This site models Michigan&apos;s fly calendar as three thermal processes rather than one date table: insect emergence, egg availability,
        and forage. Here is what each rests on.
      </p>

      <h2>Evidence tags</h2>
      <ul>
        <li className="flex items-start gap-2">
          <EvidenceBadge evidence="S" className="mt-1" />
          <span>Scientific or agency: peer-reviewed papers, Michigan DNR reports and weir data, university checklists, USGS.</span>
        </li>
        <li className="flex items-start gap-2">
          <EvidenceBadge evidence="A" className="mt-1" />
          <span>Angler: fly shop hatch charts, guides, magazine articles. Most Michigan-specific dates come from here.</span>
        </li>
        <li className="flex items-start gap-2">
          <EvidenceBadge evidence="I" className="mt-1" />
          <span>Inference: a reasonable extension we made when no source spoke directly to Michigan.</span>
        </li>
      </ul>

      <h2>Hatch timing</h2>
      <p>
        Baseline windows are for the northern Lower Peninsula (Au Sable and Manistee). Mid-state rivers run about one to two weeks ahead, the
        Tip of the Mitt one to two weeks behind, and the Upper Peninsula two to four weeks behind. Where a river&apos;s own chart gives a
        window, we use it instead. The scientific layer is thin: <em>Hexagenia limbata</em> has a real degree-day model (emergence at or above 20 °C
        water after roughly 1,800 to 2,030 degree days above 10 °C), and Michigan caddis are date-driven rather than temperature-driven. Everything
        else is guide consensus, and we say so.
      </p>

      <h2>Growing degree days</h2>
      <p>
        Air temperatures come from <a href="https://www.climatologylab.org/gridmet.html">gridMET</a>, a 4 km daily grid released CC0 and updated
        through yesterday, sampled at each river&apos;s centroid. We accumulate from January 1 at bases 32, 42, and 50 °F with the simple-average
        method and extend the series six to seven days with the <a href="https://www.weather.gov/documentation/services-web-api">National Weather
        Service forecast</a>. Water temperature comes from <a href="https://waterdata.usgs.gov/state/michigan/">USGS gauges</a> where a river has
        one. Groundwater-fed rivers like the Au Sable and Pere Marquette respond slowly to air temperature, so we treat air degree days as a guide
        and let live water temperature override it. Calibrated degree-day thresholds per river do not exist yet for any Michigan hatch; building
        that record from seasons of local reports is the long-term project.
      </p>

      <h2>Eggs</h2>
      <p>
        Spawn timing and egg sizes come from Michigan DNR egg-take dates, Great Lakes fisheries literature, and Detroit River spawning studies.
        Suckers spawn near 43 to 45 °F with a peak around the second week of May; Chinook drop 7 mm orange eggs in late September and October;
        steelhead spawn in March and April. Egg fly colors and sizes follow what Michigan shops recommend for each.
      </p>

      <h2>Fish presence</h2>
      <p>
        Species-by-river-by-month tables are anchored on DNR weir counts and stocking records and carry a confidence letter: A for weir or
        stocking data, B for multiple angler sources, C for inference. Runs shift with the year&apos;s weather; use the months as a guide.
      </p>

      <h2>Stocking</h2>
      <p>
        Each river page shows Michigan DNR Fish Stocking Database records since 1979 for the water bodies that feed that reach, pulled from the
        table behind the <a href="https://www.michigandnr.com/fishstock/">DNR stocking dashboard</a> and snapshotted into the site a few times a
        year. Counts are fish planted, not fish surviving. &ldquo;Rainbow trout&rdquo; plants in Great Lakes tributaries are steelhead strains
        unless the strain says otherwise. Average lengths are converted from the DNR&apos;s centimeters.
      </p>

      <h2>Insect photos</h2>
      <p>
        Insect photographs come from <a href="https://www.inaturalist.org">iNaturalist</a> observers who released them under CC0, CC BY, or CC BY-SA
        licenses. We prefer research-grade Michigan observations and widen the search only when Michigan has none. Each photo carries the
        observer&apos;s name, the license, and a link to the observation. If you see one of your photos here and want it removed or credited
        differently, contact us and we will fix it.
      </p>
      <p>
        Until our own bench photos are shot, some pattern pages show Creative Commons reference photos of the same pattern tied by others, sourced
        from Wikimedia Commons and Flickr via Openverse, or shared directly by their photographer (Quinn, whose work appears on Fly Deal Flies), and
        labeled &ldquo;reference photo.&rdquo; They show what the pattern looks like, not the fly you will receive, and they never appear as
        product images in the shop.
      </p>

      <h2>Regulations</h2>
      <p>
        Gear rules are transcribed from the 2026 Michigan Fishing Regulations digest. Two reaches have conflicting sources and are flagged. Always
        confirm with the current DNR guide.
      </p>

      <p>
        Questions or corrections are welcome. Start with the <Link href="/rivers">river</Link> or <Link href="/hatches">hatch</Link> page in
        question; every record lists its sources.
      </p>
    </article>
  );
}
