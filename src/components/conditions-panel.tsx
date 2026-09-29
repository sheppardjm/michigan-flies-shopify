import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import type { RiverConditions } from "@/lib/conditions";
import { GDD_BASES_F } from "@/lib/gdd";

function Stat({ label, value, sub }: { label: string; value: string; sub?: string }) {
  return (
    <div className="space-y-0.5">
      <p className="text-xs text-muted-foreground">{label}</p>
      <p className="font-mono text-lg tabular-nums">{value}</p>
      {sub ? <p className="text-xs text-muted-foreground">{sub}</p> : null}
    </div>
  );
}

export function ConditionsPanel({ conditions }: { conditions: RiverConditions }) {
  const { gdd, gauges, waterTempF, waterTempSource, errors } = conditions;
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">Live conditions</CardTitle>
        <CardDescription>
          Air degree days from gridMET at the river centroid, water from USGS gauges. Provisional data.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-5">
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-4 lg:grid-cols-2">
          <Stat
            label="Water temperature"
            value={waterTempF !== null ? `${waterTempF.toFixed(0)} °F` : "—"}
            sub={waterTempSource ? `${waterTempSource.proxy ? "Proxy: " : ""}${waterTempSource.siteName}` : "No temperature gauge"}
          />
          {GDD_BASES_F.map((base) => (
            <Stat
              key={base}
              label={`GDD base ${base} °F`}
              value={gdd ? gdd.current[base].toLocaleString() : "—"}
              sub={
                gdd?.forecastEnd
                  ? `${gdd.forecastEnd[base].toLocaleString()} by ${gdd.days.at(-1)?.date ?? ""}`
                  : gdd?.observedThrough
                    ? `through ${gdd.observedThrough}`
                    : undefined
              }
            />
          ))}
        </div>
        {gauges.length ? (
          <ul className="divide-y divide-border rounded-lg border border-border text-sm">
            {gauges.map((g) => (
              <li key={g.siteId} className="flex flex-wrap items-center justify-between gap-2 px-3 py-2">
                <a href={g.url} target="_blank" rel="noreferrer" className="font-medium underline-offset-4 hover:underline">
                  {g.siteName}
                </a>
                <span className="font-mono text-xs text-muted-foreground">
                  {g.waterTempF !== null ? `${g.waterTempF.toFixed(1)} °F` : "no temp"}
                  {" · "}
                  {g.dischargeCfs !== null ? `${g.dischargeCfs.toLocaleString()} cfs` : "no flow"}
                </span>
              </li>
            ))}
          </ul>
        ) : null}
        {errors.length ? (
          <Alert>
            <AlertTitle>Some sources were unavailable</AlertTitle>
            <AlertDescription>
              <ul className="list-disc pl-4">
                {errors.map((e) => (
                  <li key={e}>{e}</li>
                ))}
              </ul>
            </AlertDescription>
          </Alert>
        ) : null}
      </CardContent>
    </Card>
  );
}
