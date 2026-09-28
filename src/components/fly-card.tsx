import Image from "next/image";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { EvidenceBadge } from "@/components/evidence-badge";
import { FlyReferenceThumb } from "@/components/fly-reference-photo";
import { getFlyReferenceHero } from "@/lib/fly-photos";
import { CATEGORY_LABELS, TECHNIQUE_LABELS, type Fly } from "@/data";
import type { Product } from "@/lib/shopify/types";
import { formatMoney } from "@/lib/shopify/types";

export function hookSizeLabel(sizes: number[]): string {
  if (!sizes.length) return "";
  const sorted = [...sizes].sort((a, b) => a - b);
  return sorted.length === 1 ? `#${sorted[0]}` : `#${sorted[0]}–${sorted[sorted.length - 1]}`;
}

export function FlyCard({
  fly,
  reasons = [],
  score,
  product,
  tags,
}: {
  fly: Fly;
  reasons?: string[];
  score?: number;
  product?: Product | null;
  /** Extra labels, e.g. which of several target species this fly serves. */
  tags?: string[];
}) {
  const referencePhoto = product?.featuredImage ? null : getFlyReferenceHero(fly.id);
  return (
    <Card className="flex h-full flex-col overflow-hidden">
      {product?.featuredImage ? (
        <Link href={`/shop/${product.handle}`} className="relative block aspect-[4/3] bg-muted">
          <Image src={product.featuredImage.url} alt={product.featuredImage.altText ?? product.title} fill sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw" className="object-cover" />
        </Link>
      ) : referencePhoto ? (
        <Link href={`/flies/${fly.id}`} className="block">
          <FlyReferenceThumb photo={referencePhoto} alt={fly.name} />
        </Link>
      ) : null}
      <CardHeader className="gap-1">
        <div className="flex items-start justify-between gap-2">
          <CardTitle className="text-base leading-tight">
            <Link href={`/flies/${fly.id}`} className="hover:underline">
              {fly.name}
            </Link>
          </CardTitle>
          <div className="flex shrink-0 items-center gap-1">
            {score !== undefined ? (
              <span className="font-mono text-xs text-muted-foreground" title="Match score">
                {score}
              </span>
            ) : null}
            <EvidenceBadge evidence={fly.evidence} />
          </div>
        </div>
        <CardDescription className="flex flex-wrap gap-1.5">
          {tags?.map((t) => (
            <Badge key={t}>{t}</Badge>
          ))}
          <Badge variant="secondary">{CATEGORY_LABELS[fly.category]}</Badge>
          <Badge variant="outline" className="font-mono">
            {hookSizeLabel(fly.hookSizes)}
          </Badge>
          {fly.colors.slice(0, 3).map((c) => (
            <Badge key={c} variant="outline">
              {c}
            </Badge>
          ))}
          {fly.colors.length > 3 ? <Badge variant="outline">+{fly.colors.length - 3}</Badge> : null}
        </CardDescription>
      </CardHeader>
      <CardContent className="flex flex-1 flex-col gap-3 text-sm">
        {reasons.length ? (
          <ul className="list-disc space-y-0.5 pl-4 text-foreground">
            {reasons.slice(0, 3).map((r) => (
              <li key={r}>{r}</li>
            ))}
          </ul>
        ) : (
          <p className="text-muted-foreground">{fly.description}</p>
        )}
        <p className="text-xs text-muted-foreground">
          {fly.techniques.map((t) => TECHNIQUE_LABELS[t]).join(" · ")}
        </p>
        <div className="mt-auto flex items-center justify-between pt-1">
          {product ? (
            <Link href={`/shop/${product.handle}`} className="text-sm font-medium text-primary underline-offset-4 hover:underline">
              Buy from {formatMoney(product.priceRange.minVariantPrice)}
            </Link>
          ) : (
            <span className="text-xs text-muted-foreground">Not in the shop yet</span>
          )}
          <Link href={`/flies/${fly.id}`} className="text-xs text-muted-foreground underline-offset-4 hover:underline">
            Details
          </Link>
        </div>
      </CardContent>
    </Card>
  );
}
