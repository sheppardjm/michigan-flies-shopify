/**
 * Generate a Shopify product-import CSV from the fly data.
 *
 *   pnpm exec tsx scripts/export-shopify-products.ts [--all] [--out path]
 *
 * By default exports priority-3 flies (the staples every Michigan shop lists);
 * `--all` exports every pattern. Handle = fly id, which is the convention the
 * site uses to look products up. Variants are Size × Color. Prices come from
 * the table below and are placeholders until real pricing is set.
 *
 * Import in Shopify admin: Products → Import → upload the CSV.
 */
import { writeFileSync } from "node:fs";
import { CATEGORY_LABELS, flies, hatchById, speciesById, type Fly } from "../src/data";

const PRICE_BY_CATEGORY: Record<Fly["category"], number> = {
  dry: 3.0,
  emerger: 3.0,
  nymph: 2.75,
  larva: 2.75,
  wet: 2.75,
  egg: 2.25,
  worm: 2.25,
  terrestrial: 3.5,
  attractor: 3.5,
  streamer: 6.5,
  mouse: 8.0,
};

/** Articulated or oversized streamers cost more to tie. */
const BIG_STREAMER = /dungeon|circus peanut|drunk|butt monkey|boogie|intruder|articulated|zoo cougar/i;

const COLUMNS = [
  "Handle",
  "Title",
  "Body (HTML)",
  "Vendor",
  "Product Category",
  "Type",
  "Tags",
  "Published",
  "Option1 Name",
  "Option1 Value",
  "Option2 Name",
  "Option2 Value",
  "Variant SKU",
  "Variant Grams",
  "Variant Inventory Tracker",
  "Variant Inventory Qty",
  "Variant Inventory Policy",
  "Variant Fulfillment Service",
  "Variant Price",
  "Variant Requires Shipping",
  "Variant Taxable",
  "SEO Title",
  "SEO Description",
  "Status",
] as const;

function csv(v: string | number | boolean): string {
  const s = String(v);
  return /[",\n]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s;
}

function bodyHtml(fly: Fly): string {
  const hatches = fly.hatchIds.map((id) => hatchById.get(id)?.commonName).filter(Boolean);
  const fish = fly.species.map((id) => speciesById.get(id)?.name).filter(Boolean);
  const parts = [`<p>${fly.description}</p>`];
  if (hatches.length) parts.push(`<p><strong>Imitates:</strong> ${hatches.join(", ")}</p>`);
  if (fish.length) parts.push(`<p><strong>Fish it for:</strong> ${fish.join(", ")}</p>`);
  if (fly.origin) parts.push(`<p><em>${fly.origin}</em></p>`);
  parts.push(`<p>Hand-tied in Michigan for Michigan rivers. See when and where to fish it at michiganflies.com/flies/${fly.id}.</p>`);
  return parts.join("");
}

function priceFor(fly: Fly): number {
  let p = PRICE_BY_CATEGORY[fly.category];
  if (fly.category === "streamer" && BIG_STREAMER.test(fly.name)) p = 9.5;
  return p;
}

function rowsFor(fly: Fly): string[] {
  const sizes = [...fly.hookSizes].sort((a, b) => a - b).map((s) => `#${s}`);
  const colors = fly.colors.length ? fly.colors : ["Standard"];
  const tags = [
    CATEGORY_LABELS[fly.category],
    ...fly.species.map((s) => speciesById.get(s)?.name ?? s),
    ...fly.techniques,
    ...fly.hatchIds,
    ...fly.eggSourceIds,
    ...fly.forageIds,
    `evidence-${fly.evidence}`,
  ];
  const price = priceFor(fly).toFixed(2);
  const rows: string[] = [];
  let first = true;
  for (const size of sizes) {
    for (const color of colors) {
      const sku = `${fly.id}-${size.replace("#", "s")}-${color.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "")}`.slice(0, 64);
      const row: Record<(typeof COLUMNS)[number], string | number | boolean> = {
        Handle: fly.id,
        Title: first ? fly.name : "",
        "Body (HTML)": first ? bodyHtml(fly) : "",
        Vendor: first ? "Michigan Flies" : "",
        "Product Category": first ? "Sporting Goods > Outdoor Recreation > Fishing > Fishing Tackle > Fishing Baits & Lures" : "",
        Type: first ? CATEGORY_LABELS[fly.category] : "",
        Tags: first ? tags.join(", ") : "",
        Published: first ? "TRUE" : "",
        "Option1 Name": first ? "Size" : "",
        "Option1 Value": size,
        "Option2 Name": first ? "Color" : "",
        "Option2 Value": color,
        "Variant SKU": sku,
        "Variant Grams": 2,
        "Variant Inventory Tracker": "shopify",
        "Variant Inventory Qty": 0,
        "Variant Inventory Policy": "continue",
        "Variant Fulfillment Service": "manual",
        "Variant Price": price,
        "Variant Requires Shipping": "TRUE",
        "Variant Taxable": "TRUE",
        "SEO Title": first ? `${fly.name} · hand-tied for Michigan rivers` : "",
        "SEO Description": first ? fly.description.slice(0, 300) : "",
        Status: first ? "draft" : "",
      };
      rows.push(COLUMNS.map((c) => csv(row[c])).join(","));
      first = false;
    }
  }
  return rows;
}

const args = process.argv.slice(2);
const all = args.includes("--all");
const outIdx = args.indexOf("--out");
const out = outIdx >= 0 ? args[outIdx + 1] : all ? "shopify-products-all.csv" : "shopify-products-staples.csv";

const selected = flies.filter((f) => all || f.priority === 3).sort((a, b) => a.category.localeCompare(b.category) || a.name.localeCompare(b.name));
const lines = [COLUMNS.join(","), ...selected.flatMap(rowsFor)];
writeFileSync(out, lines.join("\n") + "\n");
console.log(`${selected.length} products, ${lines.length - 1} variant rows → ${out}`);
console.log("Prices are placeholders from PRICE_BY_CATEGORY; products import as drafts with inventory 0 and policy 'continue' (tie to order).");
