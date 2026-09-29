"use client";

import * as React from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Loader2, Search } from "lucide-react";
import { cn } from "cn";
import { KIND_ICONS } from "@/components/search-icons";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { KIND_LABELS, groupResults, type SearchResponse, type SearchResult } from "@/lib/search-types";

/** Shown before anything is typed. */
const STARTERS: SearchResult[] = [
  { kind: "page", title: "Hatch calendar", subtitle: "What is hatching now, by river", href: "/calendar" },
  { kind: "page", title: "Fly finder", subtitle: "Pick a river, month and fish; get a box", href: "/quiz" },
  { kind: "page", title: "All rivers", subtitle: "Every river we cover, by region", href: "/rivers" },
  { kind: "page", title: "Shop", subtitle: "Hand-tied flies for Michigan water", href: "/shop" },
];

const PER_GROUP = 5;

function isTypingTarget(el: EventTarget | null): boolean {
  if (!(el instanceof HTMLElement)) return false;
  return el.isContentEditable || ["INPUT", "TEXTAREA", "SELECT"].includes(el.tagName);
}

/** Header search: magnifier button that opens a dialog searching rivers, hatches, flies, fish and the shop. */
export function SiteSearch({ className }: { className?: string }) {
  const router = useRouter();
  const [open, setOpen] = React.useState(false);
  const [query, setQuery] = React.useState("");
  const [data, setData] = React.useState<SearchResponse | null>(null);
  const [loading, setLoading] = React.useState(false);
  const [active, setActive] = React.useState(0);
  const listId = React.useId();

  // ⌘K / Ctrl+K anywhere, or "/" when not already typing.
  React.useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if ((e.key === "k" && (e.metaKey || e.ctrlKey)) || (e.key === "/" && !isTypingTarget(e.target))) {
        e.preventDefault();
        setOpen(true);
      }
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  const trimmed = query.trim();
  React.useEffect(() => {
    if (trimmed.length < 2) return;
    const ctrl = new AbortController();
    const t = setTimeout(async () => {
      setLoading(true);
      try {
        const res = await fetch(`/api/search?q=${encodeURIComponent(trimmed)}`, { signal: ctrl.signal });
        if (res.ok) {
          setData((await res.json()) as SearchResponse);
          setActive(0);
        }
      } catch {
        // Aborted by the next keystroke, or offline; keep the last results.
      } finally {
        if (!ctrl.signal.aborted) setLoading(false);
      }
    }, 140);
    return () => {
      clearTimeout(t);
      ctrl.abort();
    };
  }, [trimmed]);

  const searching = trimmed.length >= 2;
  const groups = React.useMemo(() => {
    if (!searching) return [{ kind: "page" as const, label: "Start here", items: STARTERS }];
    return groupResults(data?.results ?? []).map((g) => ({ ...g, label: KIND_LABELS[g.kind], items: g.items.slice(0, PER_GROUP) }));
  }, [searching, data]);
  const flat = groups.flatMap((g) => g.items);
  const stale = searching && data?.query !== trimmed;
  const empty = searching && !stale && !loading && flat.length === 0;

  function onOpenChange(next: boolean) {
    setOpen(next);
    if (!next) {
      setQuery("");
      setData(null);
      setActive(0);
    }
  }

  function go(href: string) {
    onOpenChange(false);
    router.push(href);
  }

  function onKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === "ArrowDown" || e.key === "ArrowUp") {
      e.preventDefault();
      if (flat.length === 0) return;
      const step = e.key === "ArrowDown" ? 1 : -1;
      setActive((i) => (i + step + flat.length) % flat.length);
    } else if (e.key === "Enter" && flat[active] && !stale) {
      e.preventDefault();
      go(flat[active].href);
    }
    // Otherwise Enter submits the form to the full /search page.
  }

  const optionId = (i: number) => `${listId}-opt-${i}`;

  React.useEffect(() => {
    document.getElementById(optionId(active))?.scrollIntoView({ block: "nearest" });
  });
  const starts = groups.map((_, gi) => groups.slice(0, gi).reduce((n, g) => n + g.items.length, 0));

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogTrigger asChild>
        <Button
          variant="ghost"
          size="icon-sm"
          aria-label="Search the site"
          title="Search (⌘K)"
          className={cn("text-trout-belly hover:bg-white/10 hover:text-trout-belly", className)}
        >
          <Search />
        </Button>
      </DialogTrigger>
      <DialogContent
        showCloseButton={false}
        className="top-[8vh] translate-y-0 gap-0 overflow-hidden bg-card p-0 sm:top-[12vh] sm:max-w-xl"
      >
        <DialogTitle className="sr-only">Search Michigan Flies</DialogTitle>
        <DialogDescription className="sr-only">Rivers, hatches, flies, fish and the shop. Use the arrow keys to move through results.</DialogDescription>
        <form
          role="search"
          action="/search"
          onSubmit={(e) => {
            e.preventDefault();
            if (trimmed) go(`/search?q=${encodeURIComponent(trimmed)}`);
          }}
          className="flex items-center gap-2 border-b px-4"
        >
          {loading ? <Loader2 className="size-4 shrink-0 animate-spin text-muted-foreground" /> : <Search className="size-4 shrink-0 text-muted-foreground" />}
          <input
            name="q"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={onKeyDown}
            placeholder="Search rivers, hatches, flies, the shop…"
            autoComplete="off"
            spellCheck={false}
            role="combobox"
            aria-expanded={flat.length > 0}
            aria-controls={listId}
            aria-activedescendant={flat.length > 0 ? optionId(active) : undefined}
            aria-autocomplete="list"
            className="h-13 w-full min-w-0 bg-transparent text-base outline-none placeholder:text-muted-foreground"
          />
          <kbd className="hidden rounded border px-1.5 py-0.5 font-mono text-[0.7rem] text-muted-foreground sm:inline">esc</kbd>
        </form>

        <div id={listId} role="listbox" aria-label="Search results" className={cn("max-h-[min(60vh,28rem)] overflow-y-auto overscroll-contain p-2", stale && "opacity-70")}>
          {empty ? (
            <p className="px-3 py-8 text-center text-muted-foreground">
              Nothing matches “{trimmed}”. Try a river, a bug, or a pattern name, or let the{" "}
              <Link href="/quiz" onClick={() => onOpenChange(false)} className="underline underline-offset-4">
                fly finder
              </Link>{" "}
              pick for you.
            </p>
          ) : (
            groups.map((g, gi) => (
              <div key={g.label} role="group" aria-label={g.label} className="pb-1">
                <div className="px-3 pt-2 pb-1 text-[0.7rem] font-semibold tracking-[0.14em] text-muted-foreground uppercase">{g.label}</div>
                {g.items.map((r, ri) => {
                  const i = starts[gi] + ri;
                  const Icon = KIND_ICONS[r.kind];
                  return (
                    <Link
                      key={r.href}
                      id={optionId(i)}
                      href={r.href}
                      role="option"
                      aria-selected={i === active}
                      tabIndex={-1}
                      onMouseMove={() => setActive(i)}
                      onClick={() => onOpenChange(false)}
                      className={cn("flex items-center gap-3 rounded-md px-3 py-2", i === active && "bg-muted")}
                    >
                      {r.image ? (
                        <Image src={r.image} alt="" width={32} height={32} className="size-8 shrink-0 rounded object-cover" />
                      ) : (
                        <Icon className="size-4 shrink-0 text-trout-back" aria-hidden />
                      )}
                      <span className="min-w-0">
                        <span className="block truncate font-medium">{r.title}</span>
                        <span className="block truncate text-xs text-muted-foreground">{r.subtitle}</span>
                      </span>
                    </Link>
                  );
                })}
              </div>
            ))
          )}
        </div>

        {searching && flat.length > 0 ? (
          <div className="border-t px-4 py-2 text-xs text-muted-foreground">
            <Link href={`/search?q=${encodeURIComponent(trimmed)}`} onClick={() => onOpenChange(false)} className="underline underline-offset-4 hover:text-foreground">
              See every result for “{trimmed}”
            </Link>
          </div>
        ) : null}
      </DialogContent>
    </Dialog>
  );
}
