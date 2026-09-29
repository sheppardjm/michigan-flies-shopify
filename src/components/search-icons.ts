import { Bug, Feather, FileText, Fish, Package, ShoppingBag, Waves, type LucideIcon } from "lucide-react";
import type { SearchKind } from "@/lib/search-types";

/** One icon per result type, shared by the header dialog and the /search page. */
export const KIND_ICONS: Record<SearchKind, LucideIcon> = {
  river: Waves,
  hatch: Bug,
  fly: Feather,
  species: Fish,
  product: ShoppingBag,
  collection: Package,
  page: FileText,
};
