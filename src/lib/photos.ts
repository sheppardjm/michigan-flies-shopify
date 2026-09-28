import photos from "@/data/hatch-photos.json";

/**
 * Insect photos sourced from iNaturalist by `scripts/fetch-inat-photos.ts`.
 * Only CC0, CC BY and CC BY-SA photos are kept because the site is commercial;
 * CC BY and CC BY-SA require the attribution rendered by <PhotoCredit>.
 */

export type PhotoLicense = "cc0" | "cc-by" | "cc-by-sa";

export interface InatPhoto {
  /** iNaturalist photo id. */
  photoId: number;
  observationId: number;
  observationUrl: string;
  /** Base URL without size suffix; append `medium.jpg`, `large.jpg`, or `original.jpg`. */
  baseUrl: string;
  /** Extension iNaturalist reports for this photo ("jpg" or "jpeg" or "png"). */
  ext: string;
  license: PhotoLicense;
  /** Attribution string as iNaturalist renders it, e.g. "(c) Jane Doe, some rights reserved (CC BY)". */
  attribution: string;
  observer: string;
  observedOn: string | null;
  place: string | null;
  /** Taxon the observation was identified as, which may be more specific than the hatch. */
  taxonName: string;
  /** Life stage annotation if the community added one. */
  lifeStage: "adult" | "subimago" | "nymph" | "larva" | "pupa" | "teneral" | "egg" | "juvenile" | null;
  /** Which search tier found it: 1 = Michigan research grade, 2 = Michigan any, 3 = anywhere research grade, 4 = anywhere. */
  tier: 1 | 2 | 3 | 4;
  width: number | null;
  height: number | null;
}

export interface HatchPhotos {
  hatchId: string;
  taxonQuery: string;
  taxonId: number | null;
  taxonName: string | null;
  photos: InatPhoto[];
}

interface Snapshot {
  fetchedAt: string;
  hatches: Record<string, HatchPhotos>;
}

const data = photos as unknown as Snapshot;

export const PHOTOS_FETCHED_AT = data.fetchedAt;

/**
 * Hand curation on top of the automated pull. Excluded photo ids are dropped
 * everywhere; a pinned photo id becomes the hero for that hatch. Re-running the
 * fetch script does not touch these lists.
 */
export const EXCLUDED_PHOTO_IDS = new Set<number>([]);
export const PINNED_HERO: Record<string, number> = {};

export function getHatchPhotos(hatchId: string): InatPhoto[] {
  const list = (data.hatches[hatchId]?.photos ?? []).filter((p) => !EXCLUDED_PHOTO_IDS.has(p.photoId));
  const pinned = PINNED_HERO[hatchId];
  if (pinned) {
    const idx = list.findIndex((p) => p.photoId === pinned);
    if (idx > 0) return [list[idx], ...list.slice(0, idx), ...list.slice(idx + 1)];
  }
  return list;
}

export function getHatchHero(hatchId: string): InatPhoto | null {
  const list = getHatchPhotos(hatchId);
  if (PINNED_HERO[hatchId] && list[0]?.photoId === PINNED_HERO[hatchId]) return list[0];
  // Prefer an adult or subimago for the hero; fall back to whatever is first.
  return list.find((p) => p.lifeStage === "adult" || p.lifeStage === "subimago") ?? list[0] ?? null;
}

export function photoUrl(p: InatPhoto, size: "square" | "small" | "medium" | "large" | "original" = "medium"): string {
  return `${p.baseUrl}${size}.${p.ext}`;
}

export const LICENSE_LABELS: Record<PhotoLicense, { label: string; url: string }> = {
  cc0: { label: "CC0", url: "https://creativecommons.org/publicdomain/zero/1.0/" },
  "cc-by": { label: "CC BY", url: "https://creativecommons.org/licenses/by/4.0/" },
  "cc-by-sa": { label: "CC BY-SA", url: "https://creativecommons.org/licenses/by-sa/4.0/" },
};
