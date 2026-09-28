import data from "@/data/fly-photos.json";

/**
 * Stopgap reference photos of fly patterns (other tiers' flies) from
 * Wikimedia Commons and Openverse, written by `scripts/fetch-fly-photos.ts`.
 * Shown only with a "reference photo, not our tie" label and never as a
 * product image. Server-only import.
 */

export interface FlyPhoto {
  /** "permission" = photographer granted us use directly (hosted locally under /photos/flies). */
  source: "wikimedia" | "openverse" | "permission";
  url: string;
  thumbUrl: string | null;
  width: number | null;
  height: number | null;
  title: string;
  author: string;
  license: string;
  licenseUrl: string | null;
  sourceUrl: string;
}

interface Snapshot {
  fetchedAt: string;
  flies: Record<string, { flyId: string; photos: FlyPhoto[] }>;
}

const snapshot = data as unknown as Snapshot;

/** Photo URLs to drop after review. */
export const EXCLUDED_FLY_PHOTO_URLS = new Set<string>([
  // Carries a third-party "NYMPH" logo watermark in frame.
  "/photos/flies/green-caddis-larva--nymph-head-caddis-larva-green.jpg",
  "https://upload.wikimedia.org/wikipedia/commons/e/e5/Well_Known_Trout_and_Bass_Flies_That_Should_Be_In_Every_Angler%27s_Book.jpg",
  "https://upload.wikimedia.org/wikipedia/commons/9/97/BowlkersArtofAnglingFrontpiece.JPG",
  "https://upload.wikimedia.org/wikipedia/commons/a/a9/Caddisfly_bait.png",
  "https://upload.wikimedia.org/wikipedia/commons/4/48/FMIB_47830_Chirotenetes_siccus_Walsh.jpeg",
  "https://upload.wikimedia.org/wikipedia/commons/d/d6/Eisenhower_d-day.jpg",
  "https://upload.wikimedia.org/wikipedia/commons/b/bd/Eisenhower_d-day_%28face_cropped%29.jpg",
  "https://upload.wikimedia.org/wikipedia/commons/2/26/Upper_Sacramento_fly_box.jpg",
  "https://live.staticflickr.com/5062/5622153382_6d1596e18c.jpg",
  "https://upload.wikimedia.org/wikipedia/commons/e/e1/Doradoblue.jpg",
  "https://upload.wikimedia.org/wikipedia/commons/9/99/PartridgeFeather.jpg",
]);

export function getFlyReferencePhotos(flyId: string): FlyPhoto[] {
  return (snapshot.flies[flyId]?.photos ?? []).filter((p) => !EXCLUDED_FLY_PHOTO_URLS.has(p.url));
}

export function getFlyReferenceHero(flyId: string): FlyPhoto | null {
  return getFlyReferencePhotos(flyId)[0] ?? null;
}

export function flyPhotoSrc(p: FlyPhoto, prefer: "thumb" | "full" = "thumb"): string {
  return prefer === "thumb" && p.thumbUrl ? p.thumbUrl : p.url;
}
