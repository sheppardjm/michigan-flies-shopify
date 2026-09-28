import Image from "next/image";
import Link from "next/link";
import { Suspense } from "react";
import { EvidenceBadge } from "@/components/evidence-badge";
import { InsectThumb } from "@/components/insect-photo";
import { Skeleton } from "@/components/ui/skeleton";
import { BoardReveal } from "@/components/wall/board-reveal";
import { CounterCard, type CounterRiver } from "@/components/wall/counter-card";
import { HatchBoard } from "@/components/wall/hatch-board";
import { RiverBadge, REGION_SHORT } from "@/components/wall/river-badge";
import { TroutSign } from "@/components/wall/trout-sign";
import { Wallpaper } from "@/components/wall/wallpaper";
import { REGION_LABELS, Region, TECHNIQUE_LABELS, Technique, flyById, hatchById, rivers, species, speciesById } from "@/data";
import { collectionById } from "@/data/collections";
import { flyPhotoSrc, getFlyReferenceHero } from "@/lib/fly-photos";
import { getHatchHero } from "@/lib/photos";
import { formatUsd, priceFor } from "@/lib/pricing";
import { toIsoDate, toUtcDay } from "@/lib/season";

export const revalidate = 1800;

const SHELF_ORDER: Region[] = ["upper-peninsula", "tip-of-mitt", "northern-lp", "mid-lp", "southern-lp"];

export default function HomePage() {
  const today = toUtcDay(new Date());
  const riverOptions: CounterRiver[] = rivers.map((r) => ({ id: r.id, name: r.name, region: r.region, speciesIds: r.species.map((s) => s.speciesId) }));
  const speciesOptions = species.map((s) => ({ id: s.id, label: s.name.replace(" (resident)", "") }));
  const techniqueOptions = Technique.options.map((t) => ({ id: t, label: TECHNIQUE_LABELS[t] }));
  const batch = collectionById.get("two-hearted-first-batch");
  const popular = (batch?.flies ?? []).slice(0, 8).map((f) => flyById.get(f.flyId)).filter((f): f is NonNullable<typeof f> => Boolean(f));

  return (
    <div className="wall">
      <Wallpaper className="plane-wallpaper" />

      {/* First viewport: sign, counter card, hatch board */}
      <section className="plane-content mx-auto w-full max-w-6xl px-4 pt-6 pb-16 sm:pt-8">
        <div className="plane-near">
          <TroutSign />
        </div>
        <div className="mt-6 grid gap-6 lg:grid-cols-[minmax(0,7fr)_minmax(0,5fr)] lg:items-start">
          <div className="plane-front">
            <CounterCard rivers={riverOptions} species={speciesOptions} techniques={techniqueOptions} regionLabels={REGION_LABELS} today={toIsoDate(today)} />
          </div>
          <div className="plane-near">
            <Suspense fallback={<Skeleton className="h-[28rem] rounded-lg bg-board/70" />}>
              <BoardReveal>
                <HatchBoard today={today} />
              </BoardReveal>
            </Suspense>
          </div>
        </div>
      </section>

      {/* The shelf of river patches */}
      <section className="plane-content mx-auto w-full max-w-6xl px-4 pb-16" aria-labelledby="shelf-title">
        <div className="flex flex-wrap items-end justify-between gap-3">
          <h2 id="shelf-title" className="woodtype text-3xl sm:text-4xl">
            Pick your river
          </h2>
          <p className="max-w-md text-sm text-muted-foreground">
            {rivers.length} reaches, grouped by the region that sets their hatch timing. The U.P. runs about three weeks behind the Au Sable; mid-state rivers run
            ten days ahead.
          </p>
        </div>
        <div className="mt-6 space-y-10">
          {SHELF_ORDER.map((region) => {
            const list = rivers.filter((r) => r.region === region);
            if (!list.length) return null;
            return (
              <div key={region} className="shelf">
                <div className="mb-3 flex items-baseline gap-3">
                  <h3 className="woodtype-caps text-sm">{REGION_LABELS[region]}</h3>
                  <span className="whitespace-nowrap rounded-sm border border-ink/40 bg-card px-1.5 py-0.5 text-[0.76rem] font-medium text-ink">{formatOffset(list[0].offsetDays, region)}</span>
                </div>
                <ul className="-mx-4 flex snap-x snap-mandatory gap-3 overflow-x-auto px-4 pb-2 sm:mx-0 sm:grid sm:grid-cols-3 sm:gap-x-3 sm:gap-y-4 sm:overflow-visible sm:px-0 sm:pb-0 md:grid-cols-4 lg:grid-cols-5">
                  {list.map((r) => (
                    <li key={r.id} className="w-[9.5rem] shrink-0 snap-start sm:w-auto">
                      <RiverBadge name={badgeName(r.name)} sub={badgeSub(r.name, region)} region={region} href={`/rivers/${r.id}`} />
                    </li>
                  ))}
                </ul>
              </div>
            );
          })}
        </div>
      </section>

      {/* Popular flies with their naturals */}
      <section className="plane-content mx-auto w-full max-w-6xl px-4 pb-16" aria-labelledby="popular-title">
        <div className="flex flex-wrap items-end justify-between gap-3">
          <h2 id="popular-title" className="woodtype text-3xl sm:text-4xl">
            Most asked for
          </h2>
          <p className="max-w-md text-sm text-muted-foreground">
            From the Two Hearted box, our first batch. Each fly with the natural it imitates and the grade of the evidence behind it. Sales will reorder this list once
            checkout opens.
          </p>
        </div>
        <ul className="mt-6 grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4">
          {popular.map((fly) => {
            const photo = getFlyReferenceHero(fly.id);
            const natural = fly.hatchIds.map((id) => hatchById.get(id)).find(Boolean);
            const naturalPhoto = natural ? getHatchHero(natural.id) : null;
            return (
              <li key={fly.id} className="group relative overflow-hidden rounded-lg border-2 border-ink bg-card shadow-[0_12px_22px_-14px_oklch(0.2_0.02_60/0.55)]">
                <Link href={`/shop/${fly.id}`} className="block">
                  <div className="relative aspect-[4/3] bg-plank">
                    {photo ? (
                      <>
                        <Image src={flyPhotoSrc(photo, "thumb")} alt={`${fly.name} (reference photo)`} fill sizes="(min-width: 1024px) 25vw, (min-width: 640px) 50vw, 100vw" className="object-cover" />
                        <span className="absolute left-1.5 top-1.5 rounded-sm border border-ink/50 bg-card/95 px-1.5 py-0.5 text-[0.7rem] font-medium leading-none text-ink">
                          Reference photo, not our tie
                        </span>
                      </>
                    ) : (
                      <div className="flex h-full items-center justify-center text-xs text-muted-foreground">Bench photo coming</div>
                    )}
                    {naturalPhoto && natural ? (
                      <div className="absolute bottom-1.5 right-1.5 flex items-center gap-1.5 rounded-md border border-ink bg-card/95 p-1 text-[0.72rem] shadow sm:bottom-2 sm:right-2 sm:pr-2">
                        <InsectThumb photo={naturalPhoto} alt={natural.commonName} className="size-8 rounded sm:size-9" sizes="36px" />
                        <span className="hidden max-w-[7rem] leading-tight sm:block">
                          <span className="block font-medium">{natural.commonName}</span>
                          <span className="block text-muted-foreground">the natural</span>
                        </span>
                        <span className="sr-only">Imitates {natural.commonName}</span>
                      </div>
                    ) : null}
                  </div>
                  <div className="p-2.5 sm:p-3">
                    <div className="flex items-start justify-between gap-2">
                      <h3 className="text-sm font-semibold leading-tight group-hover:underline sm:text-base">{fly.name}</h3>
                      <EvidenceBadge evidence={fly.evidence} />
                    </div>
                    <p className="mt-1 line-clamp-1 text-xs text-muted-foreground">
                      {fly.species
                        .slice(0, 3)
                        .map((s) => speciesById.get(s)?.name.split(" ")[0])
                        .join(" · ")}
                      {fly.species.length > 3 ? ` · +${fly.species.length - 3}` : ""}
                    </p>
                    <p className="mt-2 text-sm tabular-nums">
                      <span className="font-semibold">{formatUsd(priceFor(fly))}</span> <span className="text-muted-foreground">each, provisional</span>
                    </p>
                  </div>
                </Link>
              </li>
            );
          })}
        </ul>
        <div className="mt-6 flex flex-wrap gap-4 text-sm">
          <Link href="/collections/two-hearted-first-batch" className="underline underline-offset-4">
            The whole Two Hearted box
          </Link>
          <Link href="/flies" className="underline underline-offset-4">
            All {130} patterns
          </Link>
        </div>
      </section>

      {/* How to read the board */}
      <section className="plane-content mx-auto w-full max-w-6xl px-4 pb-20" aria-labelledby="evidence-title">
        <div className="rounded-lg border-2 border-ink bg-card p-6 shadow-[0_12px_22px_-14px_oklch(0.2_0.02_60/0.55)] sm:p-8">
          <h2 id="evidence-title" className="woodtype text-2xl sm:text-3xl">
            How much to trust each line
          </h2>
          <div className="mt-4 grid gap-6 sm:grid-cols-3">
            <div className="flex gap-3">
              <EvidenceBadge evidence="S" className="mt-0.5 shrink-0" />
              <p className="text-sm">
                <span className="font-semibold">Scientific or agency.</span> Peer-reviewed papers, Michigan DNR reports and weir counts, university checklists, USGS gauges.
                Thin for hatches: Hex degree days, Michigan caddis being date-driven, a steelhead movement model, two DNR diet studies.
              </p>
            </div>
            <div className="flex gap-3">
              <EvidenceBadge evidence="A" className="mt-0.5 shrink-0" />
              <p className="text-sm">
                <span className="font-semibold">Angler consensus.</span> Fly shop hatch charts, guides, magazines. Most Michigan-specific dates rest here, and the site says
                so rather than dressing them up.
              </p>
            </div>
            <div className="flex gap-3">
              <EvidenceBadge evidence="I" className="mt-0.5 shrink-0" />
              <p className="text-sm">
                <span className="font-semibold">Inferred.</span> Our reasonable extension when no source spoke to Michigan. Marked so you can weigh it yourself.
              </p>
            </div>
          </div>
          <p className="mt-5 max-w-prose text-sm text-muted-foreground">
            Live numbers on the board are USGS provisional readings. Calendar windows shift by river region and are gated by water temperature within a week of your date.{" "}
            <Link href="/about-the-data" className="underline underline-offset-4">
              About the data
            </Link>
            .
          </p>
        </div>
      </section>
    </div>
  );
}

function formatOffset(days: number, region: Region): string {
  if (days === 0) return "baseline";
  const sign = days > 0 ? "+" : "";
  return region === "upper-peninsula" || region === "tip-of-mitt" ? `${sign}${days} d behind Au Sable` : `${Math.abs(days)} d ahead`;
}

/** Patch text: the river's short name; the parenthetical detail lives on the river page unless it is short enough to stitch. */
function badgeName(name: string): string {
  return name.replace(/\s*\(.*\)$/, "").replace(/ River$/, " River");
}
function badgeSub(name: string, region: Region): string {
  const detail = name.match(/\((.*)\)$/)?.[1];
  return detail && detail.length <= 12 ? detail : REGION_SHORT[region];
}
