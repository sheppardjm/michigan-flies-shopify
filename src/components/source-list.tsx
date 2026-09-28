import type { Source } from "@/data";

export function SourceList({ sources, title = "Sources" }: { sources: Source[]; title?: string }) {
  if (!sources.length) return null;
  return (
    <section aria-label={title} className="text-xs text-muted-foreground">
      <p className="mb-1 font-medium text-foreground">{title}</p>
      <ul className="space-y-0.5">
        {sources.map((s) => (
          <li key={s.url} className="truncate">
            <a href={s.url} target="_blank" rel="noreferrer" className="underline underline-offset-2 hover:text-foreground">
              {s.title}
            </a>
            {s.year ? <span className="ml-1">({s.year})</span> : null}
          </li>
        ))}
      </ul>
    </section>
  );
}
