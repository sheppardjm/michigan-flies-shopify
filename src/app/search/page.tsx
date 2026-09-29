import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { KIND_ICONS } from "@/components/search-icons";
import { searchEverything } from "@/lib/search";
import { KIND_LABELS, groupResults } from "@/lib/search-types";

export const metadata: Metadata = {
  title: "Search",
  description: "Search Michigan rivers, hatches, fly patterns, fish and the shop.",
  robots: { index: false },
};

export default async function SearchPage({ searchParams }: PageProps<"/search">) {
  const sp = await searchParams;
  const query = (typeof sp.q === "string" ? sp.q : "").slice(0, 80).trim();
  const groups = groupResults(await searchEverything(query, 150));
  const total = groups.reduce((n, g) => n + g.items.length, 0);

  return (
    <div className="mx-auto w-full max-w-3xl space-y-8 px-4 py-8 sm:py-12">
      <div className="space-y-4">
        <h1 className="text-3xl font-semibold tracking-tight">Search</h1>
        <form role="search" action="/search" className="flex gap-2">
          <input
            name="q"
            defaultValue={query}
            placeholder="Search rivers, hatches, flies, the shop…"
            aria-label="Search the site"
            autoComplete="off"
            className="h-10 w-full min-w-0 rounded-lg border border-input bg-card px-3 text-base outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50"
          />
          <button type="submit" className="h-10 shrink-0 rounded-lg bg-primary px-4 font-medium text-primary-foreground">
            Search
          </button>
        </form>
        {query.length >= 2 ? (
          <p className="text-sm text-muted-foreground" aria-live="polite">
            {total === 0 ? `Nothing matches “${query}”.` : `${total} result${total === 1 ? "" : "s"} for “${query}”.`}
          </p>
        ) : null}
      </div>

      {query.length >= 2 && total === 0 ? (
        <p className="text-muted-foreground">
          Try a river, a bug, or a pattern name, or let the{" "}
          <Link href="/quiz" className="underline underline-offset-4">
            fly finder
          </Link>{" "}
          pick for you.
        </p>
      ) : null}

      {groups.map((g) => {
        const Icon = KIND_ICONS[g.kind];
        return (
          <section key={g.kind} aria-labelledby={`results-${g.kind}`} className="space-y-2">
            <h2 id={`results-${g.kind}`} className="text-xs font-semibold tracking-[0.14em] text-muted-foreground uppercase">
              {KIND_LABELS[g.kind]}
            </h2>
            <ul className="divide-y rounded-lg border bg-card">
              {g.items.map((r) => (
                <li key={r.href}>
                  <Link href={r.href} className="flex items-center gap-3 px-4 py-3 hover:bg-muted/50">
                    {r.image ? (
                      <Image src={r.image} alt="" width={40} height={40} className="size-10 shrink-0 rounded object-cover" />
                    ) : (
                      <Icon className="size-4 shrink-0 text-trout-back" aria-hidden />
                    )}
                    <span className="min-w-0">
                      <span className="block font-medium">{r.title}</span>
                      <span className="block text-sm text-muted-foreground">{r.subtitle}</span>
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          </section>
        );
      })}
    </div>
  );
}
