"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowRight } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import type { Region, SpeciesId, Technique } from "@/data/schema";
import { cn } from "@/lib/utils";

export interface CounterRiver {
  id: string;
  name: string;
  region: Region;
  speciesIds: SpeciesId[];
}
export interface CounterOption<T extends string> {
  id: T;
  label: string;
}

/**
 * The order card on the counter: river, date, fish, setup, one button.
 * Submits into the existing results page. Fish is multi-select.
 */
export function CounterCard({
  rivers,
  species,
  techniques,
  regionLabels,
  today,
  children,
}: {
  rivers: CounterRiver[];
  species: CounterOption<SpeciesId>[];
  techniques: CounterOption<Technique>[];
  regionLabels: Record<Region, string>;
  today: string;
  /** Optional key rendered at the foot of the card, below the button. */
  children?: React.ReactNode;
}) {
  const router = useRouter();
  const [riverId, setRiverId] = useState("");
  const [date, setDate] = useState(today);
  const [fish, setFish] = useState<string[]>([]);
  const [setup, setSetup] = useState<string>("");

  const byRegion = useMemo(() => {
    const order: Region[] = ["southeast-lp", "southwest-lp", "northeast-lp", "northwest-lp", "upper-peninsula"];
    return order.map((r) => [r, rivers.filter((x) => x.region === r)] as const).filter(([, list]) => list.length);
  }, [rivers]);
  const river = rivers.find((r) => r.id === riverId);
  const here = new Set(river?.speciesIds ?? []);
  const ready = Boolean(riverId) && /^\d{4}-\d{2}-\d{2}$/.test(date) && fish.length > 0 && Boolean(setup);

  function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!ready) return;
    const params = new URLSearchParams({ river: riverId, date, species: fish.join(","), setup });
    router.push(`/quiz/results?${params}`);
  }

  return (
    <form onSubmit={submit} className="counter-card flex h-full flex-col justify-between p-5 pl-16 sm:p-7 sm:pl-20" aria-labelledby="counter-title">
      <h2 id="counter-title" className="woodtype text-2xl leading-none sm:text-3xl">
        What should be on the end of my line?
      </h2>
      <p className="mt-2 max-w-prose text-sm text-muted-foreground">Four questions. The answer is a ranked box for that river on that date, with the reasons.</p>

      <div className="mt-6 grid gap-5 sm:grid-cols-2">
        <div className="grid gap-1.5">
          <label htmlFor="counter-river" className="counter-label">
            River
          </label>
          <Select value={riverId} onValueChange={setRiverId}>
            <SelectTrigger id="counter-river" className="h-11 w-full bg-card">
              <SelectValue placeholder="Choose a river" />
            </SelectTrigger>
            <SelectContent className="max-h-80">
              {byRegion.map(([region, list]) => (
                <SelectGroup key={region}>
                  <SelectLabel>{regionLabels[region]}</SelectLabel>
                  {list.map((r) => (
                    <SelectItem key={r.id} value={r.id}>
                      {r.name}
                    </SelectItem>
                  ))}
                </SelectGroup>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="grid gap-1.5">
          <label htmlFor="counter-date" className="counter-label">
            Date
          </label>
          <Input id="counter-date" type="date" value={date} onChange={(e) => setDate(e.target.value)} className="h-11 bg-card font-mono" />
        </div>
      </div>

      <fieldset className="mt-5">
        <legend className="counter-label">Fish</legend>
        <ToggleGroup type="multiple" value={fish} onValueChange={setFish} className="mt-1.5 flex flex-wrap justify-start gap-1.5" aria-label="Target fish">
          {species.map((s) => {
            const present = !river || here.has(s.id);
            return (
              <ToggleGroupItem
                key={s.id}
                value={s.id}
                variant="outline"
                size="sm"
                className={cn(
                  "h-9 rounded-full border-ink/60 bg-card px-3 text-[0.8rem] font-medium data-[state=on]:border-ink data-[state=on]:bg-primary data-[state=on]:text-primary-foreground",
                  !present && "opacity-45",
                )}
                title={present ? undefined : `Not documented in the ${river?.name}`}
              >
                {s.label}
              </ToggleGroupItem>
            );
          })}
        </ToggleGroup>
      </fieldset>

      <div className="mt-5 grid gap-5 sm:grid-cols-[1fr_auto] sm:items-end">
        <div className="grid gap-1.5">
          <div className="flex items-baseline justify-between gap-3">
            <label htmlFor="counter-setup" className="counter-label">
              Setup
            </label>
            <Link href="/faq#setups" className="text-xs text-muted-foreground underline underline-offset-2 hover:text-foreground">
              What do these mean?
            </Link>
          </div>
          <Select value={setup} onValueChange={setSetup}>
            <SelectTrigger id="counter-setup" className="h-11 w-full bg-card">
              <SelectValue placeholder="How you're rigged" />
            </SelectTrigger>
            <SelectContent>
              {techniques.map((t) => (
                <SelectItem key={t.id} value={t.id}>
                  {t.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <button type="submit" className="counter-submit inline-flex items-center justify-center gap-2" disabled={!ready}>
          Find my flies
          <ArrowRight className="size-4" aria-hidden />
        </button>
      </div>
      {children ? <div className="pt-7">{children}</div> : null}
    </form>
  );
}
