import { z } from "zod";
import { RegionOffsetList, type RegionOffset } from "./schema";

/**
 * Regional hatch-timing offsets in days relative to the northern Lower
 * Peninsula (Au Sable / Manistee) baseline used by every `Hatch.window`.
 *
 * Two independently printed chart rules agree: Trails to Trout (northern-LP
 * baseline) says mid-state rivers "subtract 1-2 weeks", Tip-of-the-Mitt rivers
 * "add 1-2 weeks" and Upper Peninsula rivers "add 2-4 weeks"; Superior Flies
 * (U.P. baseline) says "Tip-Of-The-Mitt subtract 1 week; Northern Rivers
 * subtract 2 weeks; Mid-State Rivers subtract 3 weeks". Converting the printed
 * week rules to days is an inference made while building this dataset.
 * Sources frame the offset as latitude plus water temperature, never
 * elevation; a river's thermal class (tailwater, groundwater, runoff) modifies
 * the regional number and is stored per river, not here.
 */

const TRAILS_TO_TROUT = {
  title: "Trails to Trout, Michigan Hatch Chart (regional adjustment rule)",
  url: "https://www.trailstotrout.com/resources/michigan-hatch-chart/",
};
const SUPERIOR_FLIES = {
  title: "Superior Flies, Upper Peninsula Hatch Chart (regional adjustment rule)",
  url: "https://www.superior-flies.com/hatch-chart/",
};
const FLYFISHFINDER_MI = {
  title: "FlyFishFinder, Michigan Fly Hatches (regional timing notes)",
  url: "https://flyfishfinder.com/pages/fly-hatches-michigan/",
  year: 2026,
};
const HEX_HUB = {
  title: "Michigan Fly Fishing Hub, Michigan Hex Hatch (river-by-river 2026 peaks)",
  url: "https://michiganflyfishinghub.com/michigan-hex-hatch.html",
  year: 2026,
};

const raw: z.input<typeof RegionOffsetList> = [
  {
    region: "southern-lp",
    label: "Southern Lower Peninsula",
    offsetDays: -14,
    offsetRangeDays: [-21, -7],
    notes:
      "Southern spring creeks and warm-water rivers such as the Rogue, Dowagiac, Huron, Grand and St. Joseph basins. No printed chart rule covers these rivers directly; the Trails to Trout rule for mid-state rivers (subtract 1-2 weeks) is the nearest published guidance, and Superior Flies places mid-state rivers 3 weeks ahead of the U.P., i.e. one week ahead of the northern baseline. The -14 day default and the -21 day floor extend that rule southward by latitude and are an inference made for this dataset, not a printed figure. These rivers warm earliest, so the late-season White Fly and Stenonema hatches are proportionally more important here and the Huron fishes from the last Saturday in April into late October.",
    sources: [
      TRAILS_TO_TROUT,
      SUPERIOR_FLIES,
      {
        title: "DIY Fly Fishing, Huron River Michigan",
        url: "https://diyflyfishing.com/huron-river-michigan/",
      },
      {
        title: "DIY Fly Fishing, Dowagiac River Michigan",
        url: "https://diyflyfishing.com/dowagiac-river-michigan/",
      },
    ],
  },
  {
    region: "mid-lp",
    label: "Mid-state Lower Peninsula",
    offsetDays: -10,
    offsetRangeDays: [-14, -7],
    notes:
      "Trails to Trout instructs users of its northern-river dates to subtract 1-2 weeks for mid-state rivers (Muskegon, Pere Marquette); Superior Flies puts mid-state rivers 3 weeks ahead of the U.P. and northern rivers 2 weeks ahead, which implies the same one-to-two-week lead. Worked example: 2026 Hex peaks were Muskegon June 8-20 and Pere Marquette June 10-25 against Au Sable June 20-28. The Muskegon tailwater below Croton Dam runs warmer than the northern rivers and is among the first to hatch, with midges and BWOs active all winter, so it sits at the early end of the range; the spring-fed upper Pere Marquette and White are closer to the middle. Aggregator tables that list Pere Marquette Hendricksons later than the Au Sable contradict this rule and are treated as artifacts.",
    sources: [
      TRAILS_TO_TROUT,
      SUPERIOR_FLIES,
      HEX_HUB,
      FLYFISHFINDER_MI,
      {
        title: "Gray Drake Lodge, Muskegon River Hatch Cycle Chart",
        url: "http://graydrakelodgeandoutfitters.blogspot.com/2013/05/new-muskegon-river-hatch-cycle-chart.html",
        year: 2013,
      },
    ],
  },
  {
    region: "northern-lp",
    label: "Northern Lower Peninsula (baseline)",
    offsetDays: 0,
    offsetRangeDays: [0, 0],
    notes:
      "The reference region. Trails to Trout calibrates its chart to the northern rivers (Au Sable, Manistee) and prints 'Use Emergence Dates' for them; every Hatch.window in this dataset is that baseline. The Boardman, Pine, Little Manistee, Platte and Rifle are treated as baseline rivers because no chart names them and they fit the Au Sable/Manistee latitude. Within the region, thermal class still matters: the Big Manistee below Tippy Dam is a tailwater with extended BWO and midge shoulders and a Hex peak about five days behind the Au Sable (June 25-July 5 versus June 20-28), while the South Branch Au Sable, Pine and Platte are strongly groundwater-buffered and run cold all summer.",
    sources: [
      TRAILS_TO_TROUT,
      HEX_HUB,
      {
        title: "Current Works, Fly Fishing the Lower Manistee River",
        url: "https://www.current-works.com/northern-michigan-rivers-hatches/fly-fishing-lower-manistee-river/",
      },
      {
        title: "Hawkins Outfitters, Pine River",
        url: "https://hawkinsoutfitters.com/pine-river/",
      },
    ],
  },
  {
    region: "tip-of-mitt",
    label: "Tip of the Mitt",
    offsetDays: 10,
    offsetRangeDays: [7, 14],
    notes:
      "Trails to Trout instructs users to add 1-2 weeks for Tip-of-the-Mitt rivers (Sturgeon, Pigeon, Black); Superior Flies places the same rivers one week behind the northern rivers (subtract 1 week from the U.P. versus 2 for northern rivers). FlyFishFinder also puts them about 1-2 weeks later. The Jordan, fed by springs and rarely above 60 F, runs Hex in July, 2-3 weeks behind the Au Sable, at the late end of the range; the Pigeon has small mayflies, caddis and mid-to-late-August Tricos but lacks the big drake and Hex hatches, and the Sturgeon carries stoneflies year-round. The Maple (Emmet County) is grouped here by geography with no chart of its own.",
    sources: [
      TRAILS_TO_TROUT,
      SUPERIOR_FLIES,
      FLYFISHFINDER_MI,
      HEX_HUB,
      {
        title: "DIY Fly Fishing, Jordan River Michigan",
        url: "https://diyflyfishing.com/jordan-river-michigan/",
      },
      {
        title: "DIY Fly Fishing, Pigeon River Michigan",
        url: "https://diyflyfishing.com/pigeon-river-michigan/",
      },
    ],
  },
  {
    region: "upper-peninsula",
    label: "Upper Peninsula",
    offsetDays: 21,
    offsetRangeDays: [14, 28],
    notes:
      "Trails to Trout instructs users to add 2-4 weeks for Upper Peninsula rivers (Fox, Carp, Ontonagon); Superior Flies, working from a U.P. baseline, says northern rivers subtract 2 weeks; FlyFishFinder says 2-3 weeks. The two charts' own rows show about a two-week lag (Hex peak July 5-21 versus June 21-July 7; Hendrickson peak May 14-21 versus May 1-14; Trico start August 3 versus July 20), and 2026 reports put Fox and Two Hearted Hex 2-3 weeks behind the Au Sable, so +14 to +21 fits the eastern U.P. and the full +28 is reserved for western U.P. and Lake Superior tributaries. The Escanaba runs Hex July-August, the St. Marys Hex peaks in mid-July, and the Chocolay lacks Brown Drakes and Hex altogether. Lake Superior keeps these rivers cold late into spring.",
    sources: [
      TRAILS_TO_TROUT,
      SUPERIOR_FLIES,
      FLYFISHFINDER_MI,
      HEX_HUB,
      {
        title: "Fly Shack, Escanaba River hatch chart",
        url: "https://www.flyshack.com/HatchChart.aspx?RiverID=1415",
      },
      {
        title: "DIY Fly Fishing, Chocolay River Michigan",
        url: "https://diyflyfishing.com/chocolay-river-michigan/",
      },
      {
        title: "Rivers North Guide Service, Atlantic Salmon (St. Marys Hex timing)",
        url: "https://riversnorth.net/atlanticsalmon.html",
      },
    ],
  },
];

export const regionOffsets: RegionOffset[] = RegionOffsetList.parse(raw);
export const regionOffsetByRegion = new Map(regionOffsets.map((r) => [r.region, r]));
