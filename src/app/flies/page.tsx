import type { Metadata } from "next";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { FlyCard } from "@/components/fly-card";
import { CATEGORY_LABELS, FlyCategory, SpeciesId, Technique, TECHNIQUE_LABELS, flies, speciesById } from "@/data";
import { getProductsByHandles } from "@/lib/shopify/products";

export const metadata: Metadata = {
  title: "Fly patterns",
  description: "Every pattern we tie for Michigan rivers, with sizes, colors, seasons, and the hatch, egg, or forage it imitates.",
};

export default async function FliesPage({ searchParams }: PageProps<"/flies">) {
  const sp = await searchParams;
  const category = FlyCategory.safeParse(sp.category);
  const speciesId = SpeciesId.safeParse(sp.species);
  const technique = Technique.safeParse(sp.setup);
  const list = flies
    .filter((f) => !category.success || f.category === category.data)
    .filter((f) => !speciesId.success || f.species.includes(speciesId.data))
    .filter((f) => !technique.success || f.techniques.includes(technique.data))
    .sort((a, b) => b.priority - a.priority || a.name.localeCompare(b.name));
  const products = await getProductsByHandles(list.slice(0, 60).map((f) => f.shopifyHandle ?? f.id)).catch(() => new Map());

  const link = (patch: Record<string, string | undefined>) => {
    const p = new URLSearchParams();
    const merged = { category: category.success ? category.data : undefined, species: speciesId.success ? speciesId.data : undefined, setup: technique.success ? technique.data : undefined, ...patch };
    for (const [k, v] of Object.entries(merged)) if (v) p.set(k, v);
    const q = p.toString();
    return q ? `/flies?${q}` : "/flies";
  };

  return (
    <div className="mx-auto w-full max-w-6xl space-y-6 px-4 py-8 sm:py-12">
      <div className="space-y-2">
        <h1 className="text-3xl font-semibold tracking-tight">Fly patterns</h1>
        <p className="max-w-2xl text-muted-foreground">
          {flies.length} patterns, each linked to what it imitates so the fly finder can put it in season. Filter by type, fish, or setup.
        </p>
      </div>

      <div className="space-y-2">
        <div className="flex flex-wrap gap-1.5">
          <Button asChild size="xs" variant={!category.success ? "default" : "outline"}>
            <Link href={link({ category: undefined })}>All types</Link>
          </Button>
          {FlyCategory.options.map((c) => (
            <Button key={c} asChild size="xs" variant={category.success && category.data === c ? "default" : "outline"}>
              <Link href={link({ category: c })}>{CATEGORY_LABELS[c]}</Link>
            </Button>
          ))}
        </div>
        <div className="flex flex-wrap gap-1.5">
          <Button asChild size="xs" variant={!speciesId.success ? "default" : "outline"}>
            <Link href={link({ species: undefined })}>All fish</Link>
          </Button>
          {SpeciesId.options.map((s) => (
            <Button key={s} asChild size="xs" variant={speciesId.success && speciesId.data === s ? "default" : "outline"}>
              <Link href={link({ species: s })}>{speciesById.get(s)?.name ?? s}</Link>
            </Button>
          ))}
        </div>
        <div className="flex flex-wrap gap-1.5">
          <Button asChild size="xs" variant={!technique.success ? "default" : "outline"}>
            <Link href={link({ setup: undefined })}>Any setup</Link>
          </Button>
          {Technique.options.map((t) => (
            <Button key={t} asChild size="xs" variant={technique.success && technique.data === t ? "default" : "outline"}>
              <Link href={link({ setup: t })}>{TECHNIQUE_LABELS[t]}</Link>
            </Button>
          ))}
        </div>
      </div>

      <p className="text-sm text-muted-foreground">{list.length} patterns</p>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {list.map((f) => (
          <FlyCard key={f.id} fly={f} product={products.get(f.shopifyHandle ?? f.id) ?? null} />
        ))}
      </div>
    </div>
  );
}
