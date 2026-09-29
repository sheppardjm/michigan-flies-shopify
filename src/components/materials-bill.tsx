import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import type { BillItem } from "@/data";

const GROUPS: { label: string; kinds: BillItem["kind"][] }[] = [
  { label: "Hook and hardware", kinds: ["hook", "shank", "line", "eyes"] },
  { label: "Feathers and fur", kinds: ["feather", "fur"] },
  { label: "Synthetics, flash and legs", kinds: ["synthetic", "flash", "legs"] },
  { label: "Thread and finish", kinds: ["thread", "adhesive"] },
  { label: "Other", kinds: ["other"] },
];

/** The shopping list for one fly: every material once, grouped by kind, with the parts it builds. */
export function MaterialsBill({ bill, flyName }: { bill: BillItem[]; flyName: string }) {
  if (!bill.length) return null;
  const required = bill.filter((b) => !b.optional).length;
  const optional = bill.length - required;
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">Materials to buy</CardTitle>
        <CardDescription>
          Everything one {flyName} takes, each item once: {required} {required === 1 ? "item" : "items"}
          {optional ? `, plus ${optional} optional` : ""}. Quantities are for a single fly. We do not sell components yet; when we do, these will link to
          them.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-5 text-sm">
        {GROUPS.map((g) => {
          const items = bill.filter((b) => g.kinds.includes(b.kind));
          if (!items.length) return null;
          return (
            <section key={g.label} aria-label={g.label}>
              <h3 className="text-xs font-medium uppercase tracking-wide text-muted-foreground">{g.label}</h3>
              <ul className="mt-2 divide-y divide-border rounded-lg border border-border">
                {items.map((b) => (
                  <li key={b.item} className="grid gap-x-4 gap-y-1 px-3 py-2.5 sm:grid-cols-[minmax(0,1fr)_9rem]">
                    <div className="min-w-0">
                      <p className="flex items-baseline justify-between gap-3 font-medium">
                        <span>
                          {b.item}
                        {b.optional ? (
                          <Badge variant="outline" className="ml-1.5 align-middle text-[0.7rem]">
                            optional
                          </Badge>
                        ) : null}
                        </span>
                        <span className="shrink-0 font-mono text-sm font-normal tabular-nums text-muted-foreground sm:hidden">{b.quantity}</span>
                      </p>
                      {b.variant || b.maker ? (
                        <p className="text-xs text-muted-foreground">
                          {[b.variant, b.maker].filter(Boolean).join(" · ")}
                        </p>
                      ) : null}
                      {b.usedFor.length ? (
                        <p className="mt-1 flex flex-wrap gap-1">
                          {b.usedFor.map((part) => (
                            <Badge key={part} variant="secondary" className="text-[0.7rem]">
                              {part}
                            </Badge>
                          ))}
                        </p>
                      ) : null}
                      {b.note ? <p className="mt-1 text-xs text-muted-foreground">{b.note}</p> : null}
                    </div>
                    <p className="hidden font-mono text-sm tabular-nums text-foreground sm:block sm:text-right">{b.quantity}</p>
                  </li>
                ))}
              </ul>
            </section>
          );
        })}
      </CardContent>
    </Card>
  );
}
