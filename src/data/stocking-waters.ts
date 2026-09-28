/**
 * Maps each river record to the Michigan DNR Fish Stocking Database water
 * bodies (`waters_id`) that feed it. The DNR table stores one row per county
 * segment of a water body sharing the same waters_id; `counties` narrows a
 * long river to the reach the record describes. Empty counties = all.
 *
 * Source: DNR Fish Stocking Database dashboard (michigandnr.com/fishstock),
 * backed by the FishStockReport table, events January 1979 to present.
 */

export interface DnrWater {
  watersId: number;
  name: string;
  counties?: string[];
  /** Keep only plants whose DNR site name contains one of these (case-insensitive). */
  siteIncludes?: string[];
  /** Drop plants whose DNR site name contains any of these (case-insensitive). */
  siteExcludes?: string[];
}

export const STOCKING_WATERS: Record<string, DnrWater[]> = {
  "au-sable-holy-waters": [{ watersId: 6892, name: "Au Sable River", counties: ["Crawford"] }],
  "au-sable-north-branch": [{ watersId: 8320, name: "North Branch Au Sable River" }],
  "au-sable-south-branch": [{ watersId: 9247, name: "South Branch Au Sable River" }],
  "au-sable-below-mio": [
    { watersId: 10728, name: "Au Sable River - Mio to Alcona reach" },
    { watersId: 6892, name: "Au Sable River", counties: ["Oscoda", "Alcona"] },
  ],
  "au-sable-below-foote-dam": [{ watersId: 6892, name: "Au Sable River", counties: ["Iosco"] }],
  "manistee-upper": [{ watersId: 8005, name: "Manistee River", counties: ["Crawford", "Kalkaska", "Missaukee", "Wexford"] }],
  "manistee-below-tippy": [{ watersId: 8005, name: "Manistee River", counties: ["Manistee"] }],
  "little-manistee": [{ watersId: 9266, name: "Little Manistee River" }],
  pine: [{ watersId: 8511, name: "Pine River", counties: ["Wexford"] }],
  boardman: [
    { watersId: 9521, name: "Boardman River" },
    { watersId: 8321, name: "North Branch Boardman River" },
  ],
  jordan: [{ watersId: 6457, name: "Jordan River" }],
  pigeon: [{ watersId: 8476, name: "Pigeon River", counties: ["Otsego"] }],
  "sturgeon-lp": [
    { watersId: 9121, name: "Sturgeon River", counties: ["Cheboygan", "Otsego"] },
    { watersId: 9122, name: "West Branch Sturgeon River" },
  ],
  "black-lp": [{ watersId: 9123, name: "Black River", counties: ["Cheboygan"] }],
  platte: [
    { watersId: 8516, name: "Platte River" },
    { watersId: 9470, name: "North Branch Platte River" },
  ],
  betsie: [{ watersId: 9473, name: "Betsie River" }],
  rifle: [
    { watersId: 10710, name: "Rifle River" },
    { watersId: 10712, name: "West Branch Rifle River" },
  ],
  "big-sable-above-hamlin": [{ watersId: 7002, name: "Big Sable River", siteExcludes: ["STATE PARK"] }],
  "big-sable-below-hamlin": [{ watersId: 7002, name: "Big Sable River", siteIncludes: ["STATE PARK"] }],
  "pere-marquette": [
    { watersId: 8450, name: "Pere Marquette River" },
    { watersId: 9925, name: "Middle Branch Pere Marquette River" },
    { watersId: 9180, name: "Little South Branch Pere Marquette River" },
    { watersId: 10638, name: "Big South Branch Pere Marquette River" },
  ],
  "muskegon-below-croton": [{ watersId: 8298, name: "Muskegon River", counties: ["Newaygo", "Muskegon"] }],
  white: [
    { watersId: 8949, name: "White River", counties: ["Muskegon"] },
    { watersId: 40757, name: "White River", counties: ["Newaygo", "Oceana"] },
  ],
  rogue: [{ watersId: 9826, name: "Rogue River" }],
  "grand-sixth-street": [{ watersId: 9820, name: "Grand River", counties: ["Kent", "Ottawa"] }],
  "st-joseph-berrien-springs": [
    { watersId: 8412, name: "Saint Joseph River", counties: ["Berrien"] },
    { watersId: 687866295, name: "Saint Joseph River (Benton Harbor)" },
  ],
  kalamazoo: [
    { watersId: 6334, name: "Kalamazoo River", counties: ["Allegan"] },
    { watersId: 9024, name: "Kalamazoo River (Saugatuck)" },
  ],
  dowagiac: [{ watersId: 9043, name: "Dowagiac River" }],
  "huron-se": [{ watersId: 6537, name: "Huron River", counties: ["Wayne", "Oakland", "Livingston"] }],
  clinton: [
    { watersId: 10539, name: "Clinton River" },
    { watersId: 10536, name: "North Branch Clinton River" },
  ],
  "two-hearted": [
    { watersId: 10366, name: "Two Hearted River" },
    { watersId: 10368, name: "Little Two Hearted River" },
  ],
  "blind-sucker": [{ watersId: 10488, name: "Blind Sucker Flooding" }],
  fox: [{ watersId: 10759, name: "Fox River" }],
  escanaba: [
    { watersId: 7405, name: "Escanaba River" },
    { watersId: 10602, name: "East Branch Escanaba River" },
    { watersId: 10604, name: "Middle Branch Escanaba River" },
  ],
  ontonagon: [
    { watersId: 10717, name: "Ontonagon River" },
    { watersId: 7369, name: "East Branch Ontonagon River" },
    { watersId: 8025, name: "Middle Branch Ontonagon River" },
  ],
  "carp-mackinac": [
    { watersId: 10454, name: "Carp River", counties: ["Mackinac"] },
    { watersId: 10456, name: "South Branch Carp River" },
  ],
  chocolay: [{ watersId: 10618, name: "Chocolay River" }],
  "big-huron-up": [
    { watersId: 11141, name: "Huron River", counties: ["Baraga"] },
    { watersId: 11142, name: "East Branch Huron River" },
    { watersId: 11143, name: "West Branch Huron River" },
  ],
  "yellow-dog": [{ watersId: 10620, name: "Yellow Dog River" }],
  "presque-isle": [{ watersId: 9478, name: "Presque Isle River" }],
  "sturgeon-up": [
    { watersId: 8800, name: "Sturgeon River", counties: ["Baraga", "Houghton"] },
    { watersId: 8930, name: "West Branch Sturgeon River", counties: ["Houghton"] },
  ],
  "st-marys-rapids": [
    { watersId: 9161, name: "St. Marys River" },
    { watersId: 10278, name: "St. Marys River - Little Rapids" },
  ],
  tahquamenon: [{ watersId: 10363, name: "Tahquamenon River" }],
  anna: [{ watersId: 6136, name: "Anna River" }],
  // The Marquette County Salmon Trout (Big Bay) has no DNR stocking record; the Houghton County river of the same name is a different stream.
  "salmon-trout": [],
};
