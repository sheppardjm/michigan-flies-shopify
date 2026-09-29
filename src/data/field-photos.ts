import { z } from "zod";
import { SpeciesId } from "./schema";

/**
 * The owner's own field photographs, taken on the water. These are the only
 * photographs on the site that are ours: every fish in them took a fly we
 * tied. Files live in public/photos/field/<river>/ as stripped JPEGs with a
 * credit comment; originals stay in the untracked design/photos folder.
 *
 * `peopleVisible` marks photographs in which a person other than the owner
 * may be recognizable; publish those only with that person's say-so.
 */
export const FieldPhoto = z.object({
  id: z.string(),
  file: z.string(),
  width: z.number().int().positive(),
  height: z.number().int().positive(),
  /** ISO date the photograph was taken (from the camera). */
  takenOn: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  riverId: z.string(),
  speciesIds: z.array(SpeciesId).default([]),
  /** Short caption in the field-guide voice; no claims the photo does not show. */
  caption: z.string(),
  alt: z.string(),
  credit: z.string().default("Jamison Sheppard"),
  peopleVisible: z.boolean().default(false),
  /** Where the print is used. */
  roles: z.array(z.enum(["river-hero", "collection-hero", "home", "river", "species", "texture"])).default([]),
  /** CSS object-position for cropped uses (banners). */
  focus: z.string().default("50% 50%"),
});
export type FieldPhoto = z.infer<typeof FieldPhoto>;

const raw: z.input<typeof FieldPhoto>[] = [
  {
    id: "river-valley-2025-05-14",
    file: "/photos/field/two-hearted/river-valley-2025-05-14.jpg",
    width: 1200,
    height: 1600,
    takenOn: "2025-05-14",
    riverId: "two-hearted",
    caption: "The valley from the access stairs, May 14, 2025.",
    alt: "The Two Hearted River winding through a sand and pine valley under a cloudy sky, seen from the top of a wooden stairway",
    roles: ["river-hero", "collection-hero", "river"],
    focus: "50% 62%",
  },
  {
    id: "tannin-bank-2025-05-09",
    file: "/photos/field/two-hearted/tannin-bank-2025-05-09.jpg",
    width: 1200,
    height: 1600,
    takenOn: "2025-05-09",
    riverId: "two-hearted",
    caption: "Tannin water over sand at the bank, May 9, 2025.",
    alt: "Dark tea-colored river water running past a sandy bank with bare alder branches",
    roles: ["texture", "river"],
    focus: "50% 70%",
  },
  {
    id: "hummock-2025-05-09",
    file: "/photos/field/two-hearted/hummock-2025-05-09.jpg",
    width: 1200,
    height: 1600,
    takenOn: "2025-05-09",
    riverId: "two-hearted",
    caption: "Grass hummocks at the edge of the current, May 9, 2025.",
    alt: "A grass hummock in shallow amber water with the dark main current beyond",
    roles: ["river"],
  },
  {
    id: "casting-2025-05-17",
    file: "/photos/field/two-hearted/casting-2025-05-17.jpg",
    width: 1200,
    height: 1600,
    takenOn: "2025-05-17",
    riverId: "two-hearted",
    caption: "Swinging a run below camp, May 17, 2025.",
    alt: "An angler in waders, seen from behind, casting across a wide dark run lined with spruce",
    roles: ["home", "river"],
    peopleVisible: true,
  },
  {
    id: "wading-2025-05-14",
    file: "/photos/field/two-hearted/wading-2025-05-14.jpg",
    width: 1200,
    height: 1600,
    takenOn: "2025-05-14",
    riverId: "two-hearted",
    caption: "Working the far bank, May 14, 2025.",
    alt: "A distant angler wading a wide river bend with a low spring sky",
    roles: ["river"],
    peopleVisible: true,
  },
  {
    id: "steelhead-net-2025-05-09",
    file: "/photos/field/two-hearted/steelhead-net-2025-05-09.jpg",
    width: 1200,
    height: 1600,
    takenOn: "2025-05-09",
    riverId: "two-hearted",
    speciesIds: ["steelhead"],
    caption: "Spring steelhead in the net, May 9, 2025.",
    alt: "A dark spring steelhead lying in a rubber landing net on the bank grass, held by the tail",
    roles: ["home", "species", "river"],
  },
  {
    id: "steelhead-2025-05-14",
    file: "/photos/field/two-hearted/steelhead-2025-05-14.jpg",
    width: 1200,
    height: 1600,
    takenOn: "2025-05-14",
    riverId: "two-hearted",
    speciesIds: ["steelhead"],
    caption: "A bright hen on a swung fly, May 14, 2025.",
    alt: "An angler kneeling in the river holding a bright steelhead with a pink lateral band",
    roles: ["home", "river"],
    peopleVisible: true,
  },
  {
    id: "steelhead-2026-05-12",
    file: "/photos/field/two-hearted/steelhead-2026-05-12.jpg",
    width: 1200,
    height: 1600,
    takenOn: "2026-05-12",
    riverId: "two-hearted",
    speciesIds: ["steelhead"],
    caption: "Kyped buck steelhead, May 12, 2026.",
    alt: "An angler in a wool hat holding a large male steelhead with a hooked jaw over the water",
    roles: ["species", "river"],
    peopleVisible: true,
  },
  {
    id: "chinook-2025-09-25",
    file: "/photos/field/two-hearted/chinook-2025-09-25.jpg",
    width: 1200,
    height: 1600,
    takenOn: "2025-09-25",
    riverId: "two-hearted",
    speciesIds: ["chinook"],
    caption: "Fall Chinook from the lower river, September 25, 2025.",
    alt: "An angler crouched among streamside brush holding a dark fall Chinook salmon",
    roles: ["home", "species", "river"],
    peopleVisible: true,
  },
  {
    id: "chinook-2024-09-27",
    file: "/photos/field/two-hearted/chinook-2024-09-27.jpg",
    width: 1200,
    height: 1600,
    takenOn: "2024-09-27",
    riverId: "two-hearted",
    speciesIds: ["chinook"],
    caption: "Chinook, late September 2024.",
    alt: "An angler in a brimmed hat standing in the river holding a Chinook salmon",
    roles: ["river"],
    peopleVisible: true,
  },
  {
    id: "on-the-reel-2025-09-28",
    file: "/photos/field/two-hearted/on-the-reel-2025-09-28.jpg",
    width: 1200,
    height: 1600,
    takenOn: "2025-09-28",
    riverId: "two-hearted",
    caption: "Landed and lifted for the photograph, September 28, 2025.",
    alt: "A small bright fish hanging beside a fly reel over dark moving water",
    roles: ["home", "river"],
  },
  {
    id: "camp-2025-05-09",
    file: "/photos/field/two-hearted/camp-2025-05-09.jpg",
    width: 1200,
    height: 1600,
    takenOn: "2025-05-09",
    riverId: "two-hearted",
    caption: "Camp in the pines, opening week, May 9, 2025.",
    alt: "Tents and a shelter pitched under red pines on a sandy campsite with blue sky",
    roles: ["river"],
  },
];

export const fieldPhotos: FieldPhoto[] = z.array(FieldPhoto).parse(raw);
export const fieldPhotoById = new Map(fieldPhotos.map((p) => [p.id, p]));

export function fieldPhotosFor(opts: { riverId?: string; speciesId?: SpeciesId; role?: FieldPhoto["roles"][number] }): FieldPhoto[] {
  return fieldPhotos.filter(
    (p) =>
      (!opts.riverId || p.riverId === opts.riverId) &&
      (!opts.speciesId || p.speciesIds.includes(opts.speciesId)) &&
      (!opts.role || p.roles.includes(opts.role)),
  );
}

export function formatTakenOn(iso: string): string {
  const [y, m, d] = iso.split("-").map(Number);
  return new Date(Date.UTC(y, m - 1, d)).toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric", timeZone: "UTC" });
}
