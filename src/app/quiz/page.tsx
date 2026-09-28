import type { Metadata } from "next";
import { QuizWizard, type QuizRiverOption, type QuizSpeciesOption, type QuizTechniqueOption } from "@/components/quiz-wizard";
import { REGION_LABELS, SpeciesId, TECHNIQUE_DESCRIPTIONS, TECHNIQUE_LABELS, Technique, rivers, species } from "@/data";
import { toIsoDate, toUtcDay } from "@/lib/season";

export const metadata: Metadata = {
  title: "Fly finder",
  description: "Answer four questions and get the flies that match your Michigan river, date, target fish, and setup.",
};

export default async function QuizPage({ searchParams }: PageProps<"/quiz">) {
  const sp = await searchParams;
  const riverOptions: QuizRiverOption[] = rivers.map((r) => ({
    id: r.id,
    name: r.name,
    system: r.system,
    region: r.region,
    locale: r.locale,
    speciesIds: r.species.map((s) => s.speciesId),
  }));
  const speciesOptions: QuizSpeciesOption[] = species.map((s) => ({ id: s.id, name: s.name, blurb: s.dietSummary }));
  const techniqueOptions: QuizTechniqueOption[] = Technique.options.map((t) => ({
    id: t,
    label: TECHNIQUE_LABELS[t],
    description: TECHNIQUE_DESCRIPTIONS[t],
  }));
  const initial = {
    river: typeof sp.river === "string" ? sp.river : undefined,
    date: typeof sp.date === "string" ? sp.date : undefined,
    species:
      typeof sp.species === "string"
        ? sp.species
            .split(",")
            .map((s) => SpeciesId.safeParse(s))
            .flatMap((r) => (r.success ? [r.data] : []))
        : undefined,
    setup: typeof sp.setup === "string" ? (sp.setup as Technique) : undefined,
  };

  return (
    <div className="mx-auto w-full max-w-3xl px-4 py-8 sm:py-12">
      <div className="mb-8 space-y-2">
        <h1 className="text-3xl font-semibold tracking-tight">Find your flies</h1>
        <p className="text-muted-foreground">
          Where, when, what, and how you are rigged. We match the answer against hatch windows, egg drops, and forage for that
          river, then tighten it with live water temperature and degree days.
        </p>
      </div>
      <QuizWizard
        rivers={riverOptions}
        species={speciesOptions}
        techniques={techniqueOptions}
        regionLabels={REGION_LABELS}
        today={toIsoDate(toUtcDay(new Date()))}
        initial={initial}
      />
    </div>
  );
}
