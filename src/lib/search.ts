import {
  CATEGORY_LABELS,
  REGION_LABELS,
  TECHNIQUE_LABELS,
  eggSourceById,
  flies,
  forageById,
  hatchById,
  hatches,
  rivers,
  species,
  speciesById,
} from "@/data";
import { collections } from "@/data/collections";

/**
 * Site-wide search over the local dataset: rivers, hatches, flies, fish,
 * river boxes, and the standalone pages. Shop products come from Shopify
 * separately (see /api/search). Server-only; the index is built once per process.
 */

export type SearchKind = "page" | "river" | "hatch" | "fly" | "species" | "collection";

export interface SearchResult {
  kind: SearchKind;
  title: string;
  subtitle: string;
  href: string;
}

export const KIND_LABELS: Record<SearchKind, string> = {
  page: "Pages",
  river: "Rivers",
  hatch: "Hatches",
  fly: "Flies",
  species: "Fish",
  collection: "Boxes",
};

interface Entry extends SearchResult {
  /** Other names the thing goes by; weighted nearly as high as the title. */
  aliases: string[];
  /** Related terms that should find this entry but rank below a name match. */
  keywords: string[];
  /** Small tiebreak so staples outrank niche patterns. */
  boost: number;
  titleWords: string[];
  aliasWords: string[];
  keywordWords: string[];
}

const ORDER_LABELS = { mayfly: "Mayfly", caddis: "Caddis", stonefly: "Stonefly", midge: "Midge", other: "Other" } as const;

const PAGES: { title: string; subtitle: string; href: string; keywords: string[] }[] = [
  { title: "Fly finder", subtitle: "Pick a river, month and fish; get a box", href: "/quiz", keywords: ["quiz", "recommend", "what fly", "wizard"] },
  { title: "Hatch calendar", subtitle: "What is hatching now, by river", href: "/calendar", keywords: ["calendar", "emergence", "degree days", "gdd", "timing", "when"] },
  { title: "Shop", subtitle: "Hand-tied flies for Michigan water", href: "/shop", keywords: ["buy", "store", "order", "products"] },
  { title: "FAQ and glossary", subtitle: "Setups, rigging, water, bugs and fish", href: "/faq", keywords: ["questions", "help", "glossary", "terms", "rigging"] },
  { title: "About the data", subtitle: "Sources and how the calendar works", href: "/about-the-data", keywords: ["sources", "methodology", "evidence"] },
  { title: "Cart", subtitle: "Your order", href: "/cart", keywords: ["checkout", "bag", "basket"] },
];

/** Lowercase, strip accents and apostrophes, collapse punctuation to spaces. */
export function normalize(s: string): string {
  return s
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/['’]/g, "")
    .replace(/[^a-z0-9]+/g, " ")
    .trim();
}

/** Crude plural folding so "hendricksons" finds "Hendrickson" and "eggs" finds "Egg". */
function stem(word: string): string {
  if (word.length > 4 && word.endsWith("es") && !word.endsWith("ses")) return word.slice(0, -2);
  if (word.length > 3 && word.endsWith("s") && !word.endsWith("ss")) return word.slice(0, -1);
  return word;
}

function words(s: string): string[] {
  const n = normalize(s);
  return n ? n.split(" ").map(stem) : [];
}

function entry(
  base: SearchResult & { aliases?: string[]; keywords?: string[]; boost?: number },
): Entry {
  const aliases = base.aliases ?? [];
  const keywords = base.keywords ?? [];
  return {
    ...base,
    aliases,
    keywords,
    boost: base.boost ?? 0,
    titleWords: words(base.title),
    aliasWords: aliases.flatMap(words),
    keywordWords: keywords.flatMap(words),
  };
}

function buildIndex(): Entry[] {
  const out: Entry[] = [];

  for (const p of PAGES) out.push(entry({ kind: "page", ...p, boost: 1 }));

  for (const r of rivers) {
    out.push(
      entry({
        kind: "river",
        title: r.name,
        subtitle: `${r.locale} · ${REGION_LABELS[r.region]}`,
        href: `/rivers/${r.id}`,
        aliases: [r.system],
        keywords: [
          r.locale,
          REGION_LABELS[r.region],
          ...r.sections.map((s) => s.name),
          ...r.species.map((s) => speciesById.get(s.speciesId)?.name ?? ""),
          ...r.signatureHatches.map((id) => hatchById.get(id)?.commonName ?? ""),
        ],
      }),
    );
  }

  for (const h of hatches) {
    out.push(
      entry({
        kind: "hatch",
        title: h.commonName,
        subtitle: `${h.scientificName} · ${ORDER_LABELS[h.order]}, #${Math.min(...h.hookSizes)}–${Math.max(...h.hookSizes)}`,
        href: `/hatches/${h.id}`,
        aliases: [...h.aliases, h.scientificName],
        keywords: [ORDER_LABELS[h.order], ...h.keyStages, ...h.colors],
      }),
    );
  }

  for (const f of flies) {
    const sizes = f.hookSizes.length ? ` · #${Math.min(...f.hookSizes)}–${Math.max(...f.hookSizes)}` : "";
    out.push(
      entry({
        kind: "fly",
        title: f.name,
        subtitle: `${CATEGORY_LABELS[f.category]}${sizes}`,
        href: `/flies/${f.id}`,
        aliases: f.colors,
        keywords: [
          CATEGORY_LABELS[f.category],
          ...f.hatchIds.flatMap((id) => {
            const h = hatchById.get(id);
            return h ? [h.commonName, ...h.aliases] : [];
          }),
          ...f.forageIds.map((id) => forageById.get(id)?.name ?? ""),
          ...f.eggSourceIds.map((id) => eggSourceById.get(id)?.name ?? ""),
          ...f.species.map((id) => speciesById.get(id)?.name ?? ""),
          ...f.techniques.map((t) => TECHNIQUE_LABELS[t]),
          f.origin ?? "",
        ],
        boost: f.priority,
      }),
    );
  }

  for (const s of species) {
    out.push(
      entry({
        kind: "species",
        title: s.name,
        subtitle: s.scientificName,
        href: `/species/${s.id}`,
        aliases: [s.scientificName],
        keywords: ["fish", s.feedingModel, ...(s.spawn?.eggColors ?? [])],
        boost: 2,
      }),
    );
  }

  for (const c of collections) {
    out.push(
      entry({
        kind: "collection",
        title: c.title,
        subtitle: `${c.flies.length} patterns${c.status === "coming-soon" ? " · coming soon" : ""}`,
        href: `/collections/${c.id}`,
        keywords: ["box", "shop", "collection", c.riverId ? (rivers.find((r) => r.id === c.riverId)?.name ?? "") : ""],
        boost: 2,
      }),
    );
  }

  return out;
}

let index: Entry[] | null = null;
function getIndex(): Entry[] {
  index ??= buildIndex();
  return index;
}

/** Best score for one query token against a list of words: full word beats prefix. */
function hit(token: string, list: string[], full: number, prefix: number): number {
  let best = 0;
  for (const w of list) {
    if (w === token) return full;
    if (prefix > best && w.startsWith(token)) best = prefix;
  }
  return best;
}

function score(e: Entry, tokens: string[], phrase: string): number {
  let total = 0;
  for (const t of tokens) {
    const s = Math.max(hit(t, e.titleWords, 30, 20), hit(t, e.aliasWords, 18, 12), hit(t, e.keywordWords, 6, 4));
    // Every word in the query has to land somewhere, or the entry is out.
    if (s === 0) return 0;
    total += s;
  }
  const title = normalize(e.title);
  if (title === phrase) total += 100;
  else if (title.startsWith(phrase)) total += 40;
  else if (e.aliases.some((a) => normalize(a) === phrase)) total += 60;
  return total + e.boost;
}

/** Ranked matches across the local dataset. An empty or one-character query returns nothing. */
export function searchSite(query: string, limit = 40): SearchResult[] {
  const phrase = normalize(query);
  if (phrase.length < 2) return [];
  const tokens = [...new Set(phrase.split(" ").map(stem))];
  return getIndex()
    .map((e) => ({ e, s: score(e, tokens, phrase) }))
    .filter((x) => x.s > 0)
    .sort((a, b) => b.s - a.s || a.e.title.localeCompare(b.e.title))
    .slice(0, limit)
    .map(({ e }) => ({ kind: e.kind, title: e.title, subtitle: e.subtitle, href: e.href }));
}
