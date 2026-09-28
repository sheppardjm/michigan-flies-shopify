import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { FEATURED_DNR_SPECIES, STOCKING_FETCHED_AT, STOCKING_SOURCE, cmToInches, recentYears, speciesLabel, type RiverStocking } from "@/lib/stocking";

const fmt = new Intl.NumberFormat("en-US");

function fmtDate(iso: string): string {
  const [y, m, d] = iso.split("-").map(Number);
  return new Date(Date.UTC(y, m - 1, d)).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric", timeZone: "UTC" });
}

/** DNR stocking history for one river: species-by-year table plus the latest plants. */
export function StockingSection({ stocking }: { stocking: RiverStocking | null }) {
  const fetched = STOCKING_FETCHED_AT.slice(0, 10);
  if (!stocking || stocking.waters.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-base">DNR stocking</CardTitle>
          <CardDescription>No Michigan DNR stocking record is mapped to this water; treat the fish here as wild.</CardDescription>
        </CardHeader>
      </Card>
    );
  }
  const years = recentYears(stocking, 6);
  const currentYear = new Date().getUTCFullYear();
  const featured = stocking.species.filter((s) => FEATURED_DNR_SPECIES.includes(s.species));
  const others = stocking.species.filter((s) => !FEATURED_DNR_SPECIES.includes(s.species));
  const ordered = [...featured.sort((a, b) => FEATURED_DNR_SPECIES.indexOf(a.species) - FEATURED_DNR_SPECIES.indexOf(b.species)), ...others];
  const active = ordered.filter((s) => s.lastYear >= currentYear - 5);
  const historical = ordered.filter((s) => s.lastYear < currentYear - 5);
  const latestPlants = stocking.recentEvents.slice(0, 8);

  return (
    <section className="space-y-3">
      <div className="space-y-1">
        <h2 className="text-xl font-semibold tracking-tight">DNR stocking</h2>
        <p className="text-sm text-muted-foreground">
          Michigan DNR Fish Stocking Database records since 1979 for {stocking.waters.map((w) => w.name).join(", ")}
          {stocking.waters.some((w) => w.counties?.length) ? ` (${[...new Set(stocking.waters.flatMap((w) => w.counties ?? []))].join(", ")} County)` : ""}.{" "}
          {fmt.format(stocking.totalEvents)} plants on record. Snapshot {fetched}. DNR &ldquo;rainbow trout&rdquo; of Michigan or Skamania strain are
          steelhead smolts.{" "}
          <a href={STOCKING_SOURCE.url} target="_blank" rel="noreferrer" className="underline underline-offset-4">
            Open the DNR database
          </a>
          .
        </p>
      </div>

      {active.length ? (
        <div className="overflow-x-auto rounded-lg border border-border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="min-w-40">Species</TableHead>
                {years.map((y) => (
                  <TableHead key={y} className="text-right font-mono text-xs">
                    {y}
                  </TableHead>
                ))}
                <TableHead>Latest plant</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {active.map((s) => (
                <TableRow key={s.species}>
                  <TableCell className="max-w-56">
                    <p className="flex items-center gap-1.5 font-medium">
                      {speciesLabel(s.species, s.strains).label}
                      {speciesLabel(s.species, s.strains).note ? (
                        <Badge variant={speciesLabel(s.species, s.strains).note === "steelhead strain" ? "default" : "outline"} className="text-[10px]">
                          {speciesLabel(s.species, s.strains).note}
                        </Badge>
                      ) : null}
                    </p>
                    <p className="truncate text-xs text-muted-foreground" title={s.strains.join(", ")}>
                      {s.strains.length ? `${s.strains.slice(0, 2).join(", ")}${s.strains.length > 2 ? ` +${s.strains.length - 2}` : ""} · ` : ""}
                      since {s.firstYear}
                    </p>
                  </TableCell>
                  {years.map((y) => {
                    const n = s.byYear[String(y)];
                    return (
                      <TableCell key={y} className="text-right font-mono text-xs tabular-nums">
                        {n ? fmt.format(n) : <span className="text-muted-foreground/50">—</span>}
                      </TableCell>
                    );
                  })}
                  <TableCell className="max-w-48 text-xs text-muted-foreground">
                    <p>{fmtDate(s.latest.date)}</p>
                    <p className="truncate" title={s.latest.site ?? undefined}>
                      {s.latest.site ? titleCase(s.latest.site) : ""}
                      {s.latest.avgLengthCm ? ` · ${cmToInches(s.latest.avgLengthCm)} in` : ""}
                    </p>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      ) : (
        <Card>
          <CardContent className="py-6 text-sm text-muted-foreground">
            Nothing stocked in the last five years. The fish in this water are wild or drop down from stocked reaches upstream.
          </CardContent>
        </Card>
      )}

      {historical.length ? (
        <p className="text-xs text-muted-foreground">
          Historical only:{" "}
          {historical.map((s) => `${s.species} (${s.firstYear === s.lastYear ? s.lastYear : `${s.firstYear}–${s.lastYear}`}, ${fmt.format(s.totalAllYears)} fish)`).join("; ")}.
        </p>
      ) : null}

      {latestPlants.length ? (
        <details className="rounded-lg border border-border p-3 text-sm">
          <summary className="cursor-pointer font-medium">Recent plants, by date</summary>
          <ul className="mt-2 divide-y divide-border">
            {latestPlants.map((e, i) => (
              <li key={`${e.date}-${i}`} className="flex flex-wrap items-center justify-between gap-2 py-1.5">
                <span>
                  <span className="font-mono text-xs text-muted-foreground">{fmtDate(e.date)}</span>{" "}
                  <span className="font-medium">{fmt.format(e.count)}</span> {e.species.toLowerCase()}
                  {e.strain ? ` (${e.strain})` : ""}
                  {e.site ? ` at ${titleCase(e.site)}` : ""}
                </span>
                <span className="flex gap-1">
                  {e.avgLengthCm ? <Badge variant="outline">{cmToInches(e.avgLengthCm)} in</Badge> : null}
                  {e.marking ? <Badge variant="outline">{e.marking}</Badge> : null}
                  {e.operation && e.operation !== "State Plant" ? <Badge variant="secondary">{e.operation}</Badge> : null}
                </span>
              </li>
            ))}
          </ul>
        </details>
      ) : null}
    </section>
  );
}

function titleCase(s: string): string {
  return s
    .toLowerCase()
    .replace(/\b([a-z])/g, (m) => m.toUpperCase())
    .replace(/\b(Fr|Pas|Mdot|Usfs|Dnr|Nb|Sb|Wb|Eb)\b/gi, (m) => m.toUpperCase());
}
