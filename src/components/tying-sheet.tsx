import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { EvidenceBadge } from "@/components/evidence-badge";
import type { TyingSheet as Sheet } from "@/data";

const LICENSE_LINE: Record<Sheet["license"], string> = {
  permission: "Reproduced with the tier's permission.",
  "published-sheet": "From the tier's published pattern sheet.",
  own: "Our own recipe.",
};

/** A pattern's tying sheet: materials, steps in order, the tier's comments, and where it came from. */
export function TyingSheet({ sheet, flyName }: { sheet: Sheet; flyName: string }) {
  return (
    <Card>
      <CardHeader>
        <div className="flex flex-wrap items-start justify-between gap-2">
          <CardTitle className="text-base">How it&apos;s tied</CardTitle>
          <EvidenceBadge evidence={sheet.evidence} />
        </div>
        <CardDescription>
          {sheet.title && sheet.title !== flyName ? `${sheet.title}. ` : ""}
          {sheet.summary ?? ""} {LICENSE_LINE[sheet.license]} Recipe by{" "}
          <a href={sheet.source.url} target="_blank" rel="noreferrer" className="underline underline-offset-2 hover:text-foreground">
            {sheet.source.author}
          </a>
          {sheet.source.year ? ` (${sheet.source.year})` : ""}.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6 text-sm">
        <section aria-labelledby="tying-materials">
          <h3 id="tying-materials" className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
            Materials
          </h3>
          <dl className="mt-2 divide-y divide-border rounded-lg border border-border">
            {sheet.materials.map((m) => (
              <div key={m.part} className="grid gap-x-4 gap-y-0.5 px-3 py-2 sm:grid-cols-[8.5rem_minmax(0,1fr)]">
                <dt className="font-medium">
                  {m.part}
                  {m.optional ? (
                    <Badge variant="outline" className="ml-1.5 align-middle text-[0.7rem]">
                      optional
                    </Badge>
                  ) : null}
                </dt>
                <dd className="min-w-0">
                  <span>{m.material}</span>
                  {m.note ? <span className="block text-xs text-muted-foreground">{m.note}</span> : null}
                </dd>
              </div>
            ))}
          </dl>
        </section>

        <section aria-labelledby="tying-steps">
          <h3 id="tying-steps" className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
            Steps
          </h3>
          <ol className="mt-2 space-y-2.5">
            {sheet.steps.map((step, i) => (
              <li key={i} className="grid grid-cols-[2rem_minmax(0,1fr)] gap-2">
                <span className="live pt-0.5 text-right text-xs text-muted-foreground">{i + 1}.</span>
                <span className="leading-relaxed">{step}</span>
              </li>
            ))}
          </ol>
        </section>

        {sheet.comments.length ? (
          <section aria-labelledby="tying-comments">
            <h3 id="tying-comments" className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
              From the tier
            </h3>
            <ul className="mt-2 list-disc space-y-1 pl-5 text-foreground">
              {sheet.comments.map((c) => (
                <li key={c}>{c}</li>
              ))}
            </ul>
          </section>
        ) : null}

        <p className="text-xs text-muted-foreground">
          <a href={sheet.source.url} target="_blank" rel="noreferrer" className="underline underline-offset-2 hover:text-foreground">
            {sheet.source.title}
          </a>
          {sheet.transcriptionNote ? ` ${sheet.transcriptionNote}` : ""}
        </p>
      </CardContent>
    </Card>
  );
}
