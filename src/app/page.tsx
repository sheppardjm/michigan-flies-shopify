import Image from "next/image";
import Link from "next/link";
import { Suspense } from "react";
import { EvidenceBadge } from "@/components/evidence-badge";
import { InsectThumb } from "@/components/insect-photo";
import { Skeleton } from "@/components/ui/skeleton";
import { BoardReveal } from "@/components/wall/board-reveal";
import { CounterCard, type CounterRiver } from "@/components/wall/counter-card";
import { HatchBoard } from "@/components/wall/hatch-board";
import { MichiganOutlineDefs, RiverBadge, REGION_SHORT } from "@/components/wall/river-badge";
import { TroutSign } from "@/components/wall/trout-sign";
import { MichiganMap } from "@/components/wall/michigan-map";
import { CATEGORY_LABELS, REGION_LABELS, Region, TECHNIQUE_LABELS, Technique, eggSourceById, flyById, forageById, hatchById, rivers, species, speciesById } from "@/data";
import { collectionById } from "@/data/collections";
import { fieldPhotoById, fieldPhotosFor } from "@/data/field-photos";
import { FieldGallery } from "@/components/field-gallery";
import { flyPhotoSrc, getFlyReferenceHero } from "@/lib/fly-photos";
import { getHatchHero } from "@/lib/photos";
import { formatUsd, priceFor } from "@/lib/pricing";
import { toIsoDate, toUtcDay } from "@/lib/season";

export const revalidate = 1800;

const SHELF_ORDER: Region[] = ["southeast-lp", "southwest-lp", "northeast-lp", "northwest-lp", "upper-peninsula"];

export default function HomePage() {
  const today = toUtcDay(new Date());
  const riverOptions: CounterRiver[] = rivers.map((r) => ({ id: r.id, name: r.name, region: r.region, speciesIds: r.species.map((s) => s.speciesId) }));
  const speciesOptions = species.map((s) => ({ id: s.id, label: s.name.replace(" (resident)", "") }));
  const techniqueOptions = Technique.options.map((t) => ({ id: t, label: TECHNIQUE_LABELS[t] }));
  const batch = collectionById.get("two-hearted-first-batch");
  const popular = (batch?.flies ?? []).slice(0, 8).map((f) => flyById.get(f.flyId)).filter((f): f is NonNullable<typeof f> => Boolean(f));

  return (
    <div className="wall">
      {/* Rear plane: the river valley itself, faded into the wall, behind the first viewport */}
      {(() => {
        const ground = fieldPhotoById.get("river-valley-2025-05-14");
        return ground ? (
          <div className="plane-plate plane-photo" aria-hidden="true">
            <Image src={ground.file} alt="" fill sizes="100vw" priority className="plane-photo-image" />
          </div>
        ) : null;
      })()}

      {/* First viewport: sign, counter card, hatch board */}
      <section className="plane-content mx-auto w-full max-w-6xl px-4 pt-6 pb-16 sm:pt-8">
        <div className="plane-near">
          <TroutSign />
        </div>
        <div className="mt-6 grid gap-6 lg:grid-cols-[minmax(0,7fr)_minmax(0,5fr)] lg:items-stretch">
          <div className="plane-front">
            <CounterCard rivers={riverOptions} species={speciesOptions} techniques={techniqueOptions} regionLabels={REGION_LABELS} today={toIsoDate(today)}>
              <div className="border-t border-ink/15 pt-4">
                <p className="counter-label">How much to trust the answer</p>
                <ul className="mt-2 grid gap-x-4 gap-y-1.5 text-xs text-muted-foreground sm:grid-cols-3">
                  <li className="flex items-start gap-2">
                    <EvidenceBadge evidence="S" />
                    <span>
                      <span className="font-medium text-ink">Scientific.</span> Papers, DNR, USGS.
                    </span>
                  </li>
                  <li className="flex items-start gap-2">
                    <EvidenceBadge evidence="A" />
                    <span>
                      <span className="font-medium text-ink">Angler consensus.</span> Shop charts, guides.
                    </span>
                  </li>
                  <li className="flex items-start gap-2">
                    <EvidenceBadge evidence="I" />
                    <span>
                      <span className="font-medium text-ink">Inferred.</span> Our extension, marked.
                    </span>
                  </li>
                </ul>
                <p className="mt-2 text-xs text-muted-foreground">
                  Every line in the ranked box carries one.{" "}
                  <Link href="/about-the-data" className="underline underline-offset-4">
                    About the data
                  </Link>
                </p>
              </div>
            </CounterCard>
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

      {/* Caught on our flies: two hero catches over the run we swing */}
      {(() => {
        const heroes = fieldPhotosFor({ role: "hero" });
        const ground = fieldPhotoById.get("casting-2025-05-17");
        if (heroes.length < 2 || !ground) return null;
        const links: Record<string, { href: string; label: string }> = {
          steelhead: { href: "/species/steelhead", label: "Steelhead flies and timing" },
          chinook: { href: "/species/chinook", label: "Chinook flies and timing" },
        };
        return (
          <section className="catch-band plane-content mb-16 py-14 sm:py-20" aria-labelledby="catch-title">
            <Image src={ground.file} alt="" fill sizes="100vw" className="catch-band-photo" aria-hidden="true" />
            <div className="mx-auto w-full max-w-6xl px-4">
              <div className="max-w-2xl">
                <h2 id="catch-title" className="woodtype text-3xl sm:text-5xl">
                  Caught on our flies
                </h2>
                <p className="mt-3 text-base text-trout-belly/85 sm:text-lg">
                  Spring steelhead in May, fall Chinook in September, on the Two Hearted, on patterns tied at our bench. The calendar behind this site is the
                  same one we fish.
                </p>
              </div>
              <FieldGallery
                photos={heroes.slice(0, 2)}
                tilts={[-0.6, 0.6]}
                listClassName="mt-10 grid gap-6 sm:grid-cols-2 sm:gap-8"
                itemClassName="catch-hero"
                sizes="(min-width: 1024px) 560px, (min-width: 640px) 50vw, 100vw"
              />
              <ul className="mt-6 flex flex-wrap gap-x-6 gap-y-2 text-sm">
                {heroes.slice(0, 2).map((p) => {
                  const link = links[p.speciesIds[0] ?? ""];
                  return link ? (
                    <li key={p.id}>
                      <Link href={link.href} className="underline underline-offset-4 hover:text-trout-belly/80">
                        {link.label}
                      </Link>
                    </li>
                  ) : null;
                })}
              </ul>
            </div>
          </section>
        );
      })()}

      {/* The shelf of river patches */}
      <section className="shelf-section plane-content mx-auto w-full max-w-6xl px-4 pb-16" aria-labelledby="shelf-title">
        {(() => {
          const ground = fieldPhotoById.get("hummock-2025-05-09");
          return ground ? (
            <div className="shelf-ground" aria-hidden="true">
              <Image src={ground.file} alt="" fill sizes="100vw" />
            </div>
          ) : null;
        })()}
        <div className="grid gap-6 sm:grid-cols-[minmax(0,1fr)_380px] sm:items-center">
          <div className="space-y-3">
            <h2 id="shelf-title" className="woodtype text-3xl sm:text-4xl">
              Pick your river
            </h2>
            <p className="max-w-md text-sm text-muted-foreground">
              {rivers.length} reaches in the five regions of the DNR weekly fishing report. The U.P. runs about three weeks behind the Au Sable; the southwest
              runs ten days ahead. Every dot on the plate is a river page.
            </p>
          </div>
          <div>
            <MichiganMap className="plate-ink mx-auto w-64 sm:w-full" rivers={rivers.map((r) => ({ id: r.id, name: r.name, lat: r.centroid.lat, lon: r.centroid.lon, region: r.region }))} />
            <ul className="mt-2 flex flex-wrap justify-center gap-x-3 gap-y-1 text-[0.72rem] text-muted-foreground sm:justify-end" aria-label="Region key">
              {SHELF_ORDER.map((region) => (
                <li key={region} className="flex items-center gap-1.5">
                  <svg viewBox="0 0 10 10" className="size-2.5" aria-hidden="true" focusable="false">
                    <circle cx="5" cy="5" r="4" className={`map-dot map-dot-${region}`} />
                  </svg>
                  {REGION_SHORT[region]}
                </li>
              ))}
            </ul>
          </div>
        </div>
        <MichiganOutlineDefs />
        <div className="mt-6 space-y-10">
          {SHELF_ORDER.map((region) => {
            const list = rivers.filter((r) => r.region === region);
            if (!list.length) return null;
            return (
              <div key={region} className="shelf">
                <div className="mb-3 flex flex-wrap items-baseline gap-x-3 gap-y-1.5">
                  <h3 className="woodtype-caps basis-full text-sm sm:basis-auto">{REGION_LABELS[region]}</h3>
                  <span className="whitespace-nowrap rounded-sm border border-ink/40 bg-card px-2 py-1 text-[0.76rem] font-medium leading-none text-ink">{formatOffset(list.map((r) => r.offsetDays))}</span>
                  <Link href={`/rivers#${region}`} className="ml-auto whitespace-nowrap text-xs underline underline-offset-4 sm:hidden">
                    All {list.length} rivers
                  </Link>
                </div>
                <ul className="-mx-4 flex snap-x snap-mandatory gap-3 overflow-x-auto px-4 pb-2 sm:mx-0 sm:grid sm:grid-cols-3 sm:gap-x-3 sm:gap-y-4 sm:overflow-visible sm:px-0 sm:pb-0 md:grid-cols-4 lg:grid-cols-5">
                  {list.map((r) => (
                    <li key={r.id} className="w-[11.5rem] shrink-0 snap-start sm:w-auto">
                      <RiverBadge name={badgeName(r.name)} sub={badgeSub(r.name, region)} region={region} href={`/rivers/${r.id}`} lat={r.centroid.lat} lon={r.centroid.lon} />
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
            const naturalLabel =
              natural?.commonName ??
              forageById.get(fly.forageIds[0] ?? "")?.name ??
              eggSourceById.get(fly.eggSourceIds[0] ?? "")?.name ??
              `${CATEGORY_LABELS[fly.category]}, no single natural`;
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
                    <div className="mt-1.5 flex h-6 items-center gap-1.5 text-xs text-muted-foreground">
                      {naturalPhoto && natural ? <InsectThumb photo={naturalPhoto} alt="" className="size-6 shrink-0 rounded border border-ink/30" sizes="24px" /> : null}
                      <span className="line-clamp-1">
                        <span className="text-ink">{naturalLabel}</span>
                        {natural || fly.forageIds.length || fly.eggSourceIds.length ? " · the natural" : ""}
                      </span>
                    </div>
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

      {/* From the river: our own photographs, hung over our own water */}
      {(() => {
        const prints = fieldPhotosFor({ role: "home" });
        const ground = fieldPhotoById.get("tannin-bank-2025-05-09");
        if (!prints.length || !ground) return null;
        const tilts = [-1.2, 0.8, -0.6, 1.1, -0.9];
        return (
          <section className="river-band plane-content mb-16 py-12 sm:py-16" aria-labelledby="river-title">
            <Image src={ground.file} alt="" fill sizes="100vw" className="river-band-photo" aria-hidden="true" />
            <div className="mx-auto w-full max-w-6xl px-4">
              <div className="flex flex-wrap items-end justify-between gap-3">
                <h2 id="river-title" className="woodtype text-3xl sm:text-4xl">
                  From the river
                </h2>
                <p className="max-w-md text-sm text-trout-belly/85">
                  Our own photographs from the Two Hearted, 2022 to 2026. Every fish in them took a fly we tied. The water behind them is the river&apos;s
                  own tannin over sand.
                </p>
              </div>
              <FieldGallery
                photos={prints.slice(0, 5)}
                tilts={tilts}
                listClassName="-mx-4 mt-8 flex snap-x snap-mandatory gap-5 overflow-x-auto px-4 pb-3 sm:mx-0 sm:grid sm:grid-cols-3 sm:overflow-visible sm:px-0 sm:pb-0 lg:grid-cols-5"
                itemClassName="w-[15.5rem] shrink-0 snap-start sm:w-auto"
              />
              <p className="mt-6 text-sm">
                <Link href="/rivers/two-hearted" className="underline underline-offset-4 hover:text-trout-belly/80">
                  More from our trips on the Two Hearted page
                </Link>
              </p>
            </div>
          </section>
        );
      })()}

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

/** The spread of river offsets in a region, against the Au Sable: one number when they agree, a range when they do not. */
function formatOffset(offsets: number[]): string {
  const min = Math.min(...offsets);
  const max = Math.max(...offsets);
  const word = (d: number) => (d > 0 ? `+${d}` : `${d}`);
  if (min === max) return min === 0 ? "Au Sable baseline" : `${word(min)} d vs Au Sable`;
  return `${word(min)} to ${word(max)} d vs Au Sable`;
}

/** Patch text: the river's short name; the parenthetical detail lives on the river page unless it is short enough to stitch. */
function badgeName(name: string): string {
  return name.replace(/\s*\(.*\)$/, "").replace(/ River$/, " River");
}
function badgeSub(name: string, region: Region): string {
  const detail = name.match(/\((.*)\)$/)?.[1];
  return detail && detail.length <= 12 ? detail : REGION_SHORT[region];
}
