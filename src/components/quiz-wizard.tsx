"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, ArrowRight, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { cn } from "@/lib/utils";
import type { Region, SpeciesId, Technique } from "@/data/schema";

/** Serializable subsets passed from the server page so the client bundle stays small. */
export interface QuizRiverOption {
  id: string;
  name: string;
  system: string;
  region: Region;
  locale: string;
  speciesIds: SpeciesId[];
}
export interface QuizSpeciesOption {
  id: SpeciesId;
  name: string;
  blurb: string;
}
export interface QuizTechniqueOption {
  id: Technique;
  label: string;
  description: string;
}

const STEPS = ["Where", "When", "What", "Setup"] as const;

export function QuizWizard({
  rivers,
  species,
  techniques,
  regionLabels,
  today,
  initial,
}: {
  rivers: QuizRiverOption[];
  species: QuizSpeciesOption[];
  techniques: QuizTechniqueOption[];
  regionLabels: Record<Region, string>;
  today: string;
  initial?: Partial<{ river: string; date: string; species: SpeciesId[]; setup: Technique }>;
}) {
  const router = useRouter();
  const [step, setStep] = useState(0);
  const [riverId, setRiverId] = useState(initial?.river ?? "");
  const [date, setDate] = useState(initial?.date ?? today);
  const [speciesIds, setSpeciesIds] = useState<SpeciesId[]>(initial?.species ?? []);
  const [technique, setTechnique] = useState<Technique | "">(initial?.setup ?? "");
  const [riverQuery, setRiverQuery] = useState("");

  const river = rivers.find((r) => r.id === riverId);
  const riversByRegion = useMemo(() => {
    const q = riverQuery.trim().toLowerCase();
    const filtered = q ? rivers.filter((r) => `${r.name} ${r.locale} ${r.system}`.toLowerCase().includes(q)) : rivers;
    const groups = new Map<Region, QuizRiverOption[]>();
    for (const r of filtered) groups.set(r.region, [...(groups.get(r.region) ?? []), r]);
    const order: Region[] = ["southeast-lp", "southwest-lp", "northeast-lp", "northwest-lp", "upper-peninsula"];
    return order.filter((reg) => groups.has(reg)).map((reg) => [reg, groups.get(reg)!] as const);
  }, [rivers, riverQuery]);

  const speciesHere = new Set(river?.speciesIds ?? []);

  const canNext = [Boolean(riverId), /^\d{4}-\d{2}-\d{2}$/.test(date), speciesIds.length > 0, Boolean(technique)][step];

  function toggleSpecies(id: SpeciesId, on: boolean) {
    setSpeciesIds((prev) => (on ? (prev.includes(id) ? prev : [...prev, id]) : prev.filter((x) => x !== id)));
  }

  function submit() {
    const params = new URLSearchParams({ river: riverId, date, species: speciesIds.join(","), setup: technique });
    router.push(`/quiz/results?${params}`);
  }

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <div className="flex items-center justify-between text-sm">
          <ol className="flex gap-3" aria-label="Steps">
            {STEPS.map((s, i) => (
              <li key={s} className={cn("flex items-center gap-1.5", i === step ? "font-medium text-foreground" : "text-muted-foreground")}>
                <span
                  className={cn(
                    "flex size-5 items-center justify-center rounded-full border font-mono text-[10px]",
                    i < step ? "border-primary bg-primary text-primary-foreground" : i === step ? "border-primary" : "border-border",
                  )}
                >
                  {i + 1}
                </span>
                <span className="hidden sm:inline">{s}</span>
              </li>
            ))}
          </ol>
          <span className="text-muted-foreground">
            Step {step + 1} of {STEPS.length}
          </span>
        </div>
        <Progress value={((step + 1) / STEPS.length) * 100} aria-label="Progress" />
      </div>

      {step === 0 ? (
        <Card>
          <CardHeader>
            <CardTitle>Which river?</CardTitle>
            <CardDescription>Hatch timing shifts by two to four weeks between the Muskegon and the Two Hearted, so start here.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="relative">
              <Search className="pointer-events-none absolute left-2.5 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" aria-hidden />
              <Input
                value={riverQuery}
                onChange={(e) => setRiverQuery(e.target.value)}
                placeholder="Search rivers or towns"
                className="pl-8"
                aria-label="Search rivers"
              />
            </div>
            <RadioGroup value={riverId} onValueChange={setRiverId} className="grid gap-4">
              {riversByRegion.map(([region, list]) => (
                <fieldset key={region} className="space-y-2">
                  <legend className="text-xs font-medium uppercase tracking-wide text-muted-foreground">{regionLabels[region]}</legend>
                  <div className="grid gap-2 sm:grid-cols-2">
                    {list.map((r) => (
                      <Label
                        key={r.id}
                        htmlFor={`river-${r.id}`}
                        className={cn(
                          "flex cursor-pointer items-start gap-3 rounded-lg border p-3 transition-colors hover:bg-muted",
                          riverId === r.id && "border-primary bg-primary/5",
                        )}
                      >
                        <RadioGroupItem id={`river-${r.id}`} value={r.id} className="mt-0.5" />
                        <span className="space-y-0.5">
                          <span className="block font-medium leading-tight">{r.name}</span>
                          <span className="block text-xs font-normal text-muted-foreground">{r.locale}</span>
                        </span>
                      </Label>
                    ))}
                  </div>
                </fieldset>
              ))}
              {riversByRegion.length === 0 ? <p className="text-sm text-muted-foreground">No rivers match that search.</p> : null}
            </RadioGroup>
          </CardContent>
        </Card>
      ) : null}

      {step === 1 ? (
        <Card>
          <CardHeader>
            <CardTitle>When are you fishing?</CardTitle>
            <CardDescription>
              Pick the date of your trip. Windows are calendar-based and then adjusted for {river?.name ?? "the river"} using live water temperature and degree days when
              you fish within the next week.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid max-w-xs gap-2">
              <Label htmlFor="trip-date">Trip date</Label>
              <Input id="trip-date" type="date" value={date} onChange={(e) => setDate(e.target.value)} />
            </div>
            <div className="flex flex-wrap gap-2">
              <Button type="button" variant="outline" size="sm" onClick={() => setDate(today)}>
                Today
              </Button>
              {[7, 14, 30].map((d) => (
                <Button key={d} type="button" variant="outline" size="sm" onClick={() => setDate(addDays(today, d))}>
                  +{d} days
                </Button>
              ))}
            </div>
          </CardContent>
        </Card>
      ) : null}

      {step === 2 ? (
        <Card>
          <CardHeader>
            <CardTitle>What are you after?</CardTitle>
            <CardDescription>
              Pick one or more. {river ? `Fish documented in the ${river.name} are marked. ` : ""}Each species has a different feeding model, which changes the fly
              box as much as the date does.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-2 sm:grid-cols-2" role="group" aria-label="Target species">
              {species.map((s) => {
                const here = speciesHere.has(s.id);
                const checked = speciesIds.includes(s.id);
                return (
                  <Label
                    key={s.id}
                    htmlFor={`species-${s.id}`}
                    className={cn(
                      "flex cursor-pointer items-start gap-3 rounded-lg border p-3 transition-colors hover:bg-muted",
                      checked && "border-primary bg-primary/5",
                    )}
                  >
                    <Checkbox id={`species-${s.id}`} checked={checked} onCheckedChange={(v) => toggleSpecies(s.id, v === true)} className="mt-0.5" />
                    <span className="space-y-1">
                      <span className="flex items-center gap-2 font-medium leading-tight">
                        {s.name}
                        {river ? (
                          <Badge variant={here ? "default" : "outline"} className="text-[10px]">
                            {here ? "In this river" : "Not documented here"}
                          </Badge>
                        ) : null}
                      </span>
                      <span className="line-clamp-3 block text-xs font-normal text-muted-foreground">{s.blurb}</span>
                    </span>
                  </Label>
                );
              })}
            </div>
            {speciesIds.length > 1 ? (
              <p className="mt-3 text-xs text-muted-foreground">
                Results will rank flies that work for {speciesIds.length} species higher, and label which fish each fly is for.
              </p>
            ) : null}
          </CardContent>
        </Card>
      ) : null}

      {step === 3 ? (
        <Card>
          <CardHeader>
            <CardTitle>What is your setup?</CardTitle>
            <CardDescription>We only recommend flies you can actually fish with the rig you are carrying.</CardDescription>
          </CardHeader>
          <CardContent>
            <RadioGroup value={technique} onValueChange={(v) => setTechnique(v as Technique)} className="grid gap-2 sm:grid-cols-2">
              {techniques.map((t) => (
                <Label
                  key={t.id}
                  htmlFor={`setup-${t.id}`}
                  className={cn(
                    "flex cursor-pointer items-start gap-3 rounded-lg border p-3 transition-colors hover:bg-muted",
                    technique === t.id && "border-primary bg-primary/5",
                  )}
                >
                  <RadioGroupItem id={`setup-${t.id}`} value={t.id} className="mt-0.5" />
                  <span className="space-y-0.5">
                    <span className="block font-medium leading-tight">{t.label}</span>
                    <span className="block text-xs font-normal text-muted-foreground">{t.description}</span>
                  </span>
                </Label>
              ))}
            </RadioGroup>
          </CardContent>
        </Card>
      ) : null}

      <div className="flex items-center justify-between">
        <Button type="button" variant="ghost" onClick={() => setStep((s) => Math.max(0, s - 1))} disabled={step === 0}>
          <ArrowLeft data-icon="inline-start" />
          Back
        </Button>
        {step < STEPS.length - 1 ? (
          <Button type="button" onClick={() => setStep((s) => s + 1)} disabled={!canNext}>
            Next
            <ArrowRight data-icon="inline-end" />
          </Button>
        ) : (
          <Button type="button" onClick={submit} disabled={!canNext}>
            Show my flies
            <ArrowRight data-icon="inline-end" />
          </Button>
        )}
      </div>
    </div>
  );
}

function addDays(iso: string, days: number): string {
  const [y, m, d] = iso.split("-").map(Number);
  const dt = new Date(Date.UTC(y, m - 1, d + days));
  return dt.toISOString().slice(0, 10);
}
