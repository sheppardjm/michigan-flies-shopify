import { z } from "zod";
import { TyingSheetList, type TyingSheet } from "./schema";

/**
 * Tying sheets: how a pattern is built, from the tier who published it.
 *
 * To add one: append an object below with the fly's id, transcribe the
 * materials and steps faithfully (keep the tier's wording, fix only obvious
 * typos), put the tier's own remarks in `comments`, cite the sheet in
 * `source` with its author, and set `license` to how we may reproduce it.
 * `pnpm validate-data` checks that the fly exists. The fly page renders the
 * sheet under "How it's tied" automatically.
 */
const raw: z.input<typeof TyingSheetList> = [
  {
    flyId: "shrew",
    title: "The Shrew",
    summary: "A sculpin pattern for steelhead and large trout.",
    materials: [
      { part: "Hook", material: "Trailing hook, typically a drop-shot hook such as an Owner Mosquito", note: "Most common sizes are 4 to 1. Added before fishing, on a 40 to 55 mm shank." },
      { part: "Shank", material: "40 to 55 mm shank" },
      { part: "Connection", material: "40 lb Power Pro or other braided fishing line", note: "About 6 in, folded and knotted, laid along the shank as the hook loop." },
      { part: "Eyes", material: "Shiny gold or pale yellow plastic bead chain" },
      { part: "Tail", material: "Olive, black, or brown pine squirrel" },
      { part: "Body", material: "2 hen hackles and 2 olive or tan grizzly marabou feathers", note: "Alternated up the shank to build a sculpin-shaped head with less bulk." },
      { part: "Pectoral fins", material: "2 small strips of pine squirrel" },
      { part: "Flash", material: "Cranberry holographic Flashabou", note: "5 or 6 strands over the body." },
      { part: "Rubber legs", material: "Black and red spinnerbait skirt fibers", optional: true },
      { part: "Head", material: "Pine squirrel wound up the shank behind the eyes", note: "In front of the eyes, a pinch of tan or peacock Ice Dub; Hare's Wiggle Dub works well here." },
    ],
    steps: [
      "Put a shank in the vise, between 40 and 55 mm in length.",
      "Cut a piece of Power Pro about 6 inches long. Fold it over and tie an overhand knot with the two ends.",
      "Cover the shank with thread. Lay the Power Pro over the shank and thread the knot through the eye. Cover the Power Pro with thread, using the overhand knot as a stopper.",
      "Tie in a piece of pine squirrel for the tail. It should reach only to the end of the Power Pro loop.",
      "On top of the tail, tie in a cream, yellow, or brown hen hackle. Wind the thread a little way up the shank and tie in a grizzly marabou feather above the hen hackle. Move forward a little and tie in another hen hackle, then repeat once more with a grizzly marabou feather. This builds a sculpin-shaped head with less bulk than other methods.",
      "Tie in a small piece of pine squirrel on either side as pectoral fins. Rubber legs can be added to each side in this step.",
      "Cover the fly with 5 or 6 strands of cranberry holographic Flashabou.",
      "Tie in a piece of pine squirrel and wind it over much of the remaining shank.",
      "Tie in the plastic eyes, leaving a little space at the head. They can also go on at the start if you prefer.",
      "At the front of the fly, add a pinch of dubbing in the colour of your choice. Hare's Wiggle Dub works well here.",
      "Finish the fly.",
      "Before fishing, add the Owner Mosquito or another suitable hook to the loop.",
    ],
    comments: [
      "This is a great pattern that can be swung in the traditional way or bounced and swung along the bottom.",
      "Typically tied olive in the winter, black in the spring, and mottled tan the rest of the year.",
      "The layered feathers give the fly a lot of action in the water.",
      "The hook should end up where the tail ends, so the hook itself functions as the tail.",
    ],
    source: {
      title: "Fly Pattern Sheet: The Shrew (PDF)",
      url: "https://feenstraoutdoors.com/wordpress/wp-content/uploads/2015/03/Shrew.pdf",
      author: "Feenstra Guide Service",
      year: 2015,
    },
    license: "published-sheet",
    transcriptionNote: "Transcribed from the guide service's pattern sheet; the shank and braid are listed as separate parts here, and steps are lightly edited for clarity.",
    evidence: "A",
  },
];

export const tyingSheets: TyingSheet[] = TyingSheetList.parse(raw);
export const tyingByFlyId = new Map(tyingSheets.map((t) => [t.flyId, t]));
