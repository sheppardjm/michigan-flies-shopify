import { z } from "zod";
import { RegionOffsetList, type RegionOffset } from "./schema";

/**
 * Default hatch-timing offsets by Michigan DNR weekly fishing-report region
 * (Southeast, Southwest, Northeast, Northwest Lower Peninsula; Upper
 * Peninsula), in days relative to the Au Sable / Manistee baseline used by
 * every `Hatch.window`. Each river carries its own `offsetDays`, which takes
 * precedence; the region default drives the region views of the calendar and
 * the home board.
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
    region: "southeast-lp",
    label: "Southeast Lower Peninsula",
    offsetDays: -14,
    offsetRangeDays: [-21, -7],
    notes:
      "The DNR's Southeast region: Huron and Clinton, the Lake Erie, Lake St. Clair and Saginaw Bay tributaries. No printed chart rule covers these rivers directly; the Trails to Trout rule for mid-state rivers (subtract 1-2 weeks) is the nearest published guidance, and Superior Flies places mid-state rivers 3 weeks ahead of the U.P., i.e. one week ahead of the northern baseline. The -14 day default and the -21 day floor extend that rule southward by latitude and are an inference made for this dataset, not a printed figure. These are the warmest, earliest rivers in the state, so the late-season White Fly and Stenonema hatches are proportionally more important and the Huron fishes from the last Saturday in April into late October.",
    sources: [
      TRAILS_TO_TROUT,
      SUPERIOR_FLIES,
      {
        title: "DIY Fly Fishing, Huron River Michigan",
        url: "https://diyflyfishing.com/huron-river-michigan/",
      },
    ],
  },
  {
    region: "southwest-lp",
    label: "Southwest Lower Peninsula",
    offsetDays: -10,
    offsetRangeDays: [-14, -7],
    notes:
      "The DNR's Southwest region: Muskegon, White, Rogue, Grand, Kalamazoo, St. Joseph and Dowagiac (the report groups Muskegon, Grand Haven, South Haven and St. Joseph here; Ludington and north are Northwest). Trails to Trout instructs users of its northern-river dates to subtract 1-2 weeks for mid-state rivers; Superior Flies puts mid-state rivers 3 weeks ahead of the U.P. and northern rivers 2 weeks ahead, which implies the same one-to-two-week lead. Worked example: the 2026 Muskegon Hex peak was June 8-20 against Au Sable June 20-28. The Muskegon tailwater below Croton Dam runs warmer than the northern rivers and is among the first to hatch, with midges and BWOs active all winter; the southern spring creeks (Rogue, Dowagiac) and the warm-water St. Joseph and Kalamazoo sit at the early end of the range.",
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
      {
        title: "DIY Fly Fishing, Dowagiac River Michigan",
        url: "https://diyflyfishing.com/dowagiac-river-michigan/",
      },
    ],
  },
  {
    region: "northeast-lp",
    label: "Northeast Lower Peninsula (baseline)",
    offsetDays: 0,
    offsetRangeDays: [0, 14],
    notes:
      "The DNR's Northeast region, from Tawas and Oscoda to Alpena and Cheboygan: the Au Sable system, the Rifle, and the Cheboygan-area Pigeon, Sturgeon and Black. The Au Sable is the reference river; Trails to Trout calibrates its chart to it and prints 'Use Emergence Dates', and every Hatch.window in this dataset is that baseline. The Rifle fits the same latitude and is treated as baseline. The Tip of the Mitt rivers run behind: Trails to Trout says add 1-2 weeks for the Sturgeon, Pigeon and Black, Superior Flies places them one week behind the northern rivers, and FlyFishFinder about 1-2 weeks later; the Pigeon carries small mayflies, caddis and August Tricos but lacks the big drake and Hex hatches, and the Sturgeon has stoneflies year-round. Those rivers carry their lag in their own offsetDays.",
    sources: [
      TRAILS_TO_TROUT,
      SUPERIOR_FLIES,
      FLYFISHFINDER_MI,
      HEX_HUB,
      {
        title: "DIY Fly Fishing, Pigeon River Michigan",
        url: "https://diyflyfishing.com/pigeon-river-michigan/",
      },
    ],
  },
  {
    region: "northwest-lp",
    label: "Northwest Lower Peninsula",
    offsetDays: 0,
    offsetRangeDays: [-7, 14],
    notes:
      "The DNR's Northwest region, from Ludington north through Manistee, Frankfort and Traverse City to Charlevoix and Petoskey: the Manistee system, Little Manistee, Pine, Boardman, Platte, Betsie, Pere Marquette, Big Sable and Jordan. The Manistee shares the Au Sable baseline in every chart, and the Boardman, Pine, Little Manistee, Platte and Betsie are treated as baseline rivers because no chart names them and they fit that latitude. The region spans a real spread: the Pere Marquette and the Ludington rivers run about a week ahead (2026 Hex peak June 10-25 against Au Sable June 20-28), the Big Manistee tailwater below Tippy about five days behind (June 25-July 5), and the spring-fed Jordan, rarely above 60 F, runs Hex in July, two to three weeks behind. Each river carries its own offsetDays; the region default is the baseline.",
    sources: [
      TRAILS_TO_TROUT,
      SUPERIOR_FLIES,
      HEX_HUB,
      FLYFISHFINDER_MI,
      {
        title: "Current Works, Fly Fishing the Lower Manistee River",
        url: "https://www.current-works.com/northern-michigan-rivers-hatches/fly-fishing-lower-manistee-river/",
      },
      {
        title: "Hawkins Outfitters, Pine River",
        url: "https://hawkinsoutfitters.com/pine-river/",
      },
      {
        title: "DIY Fly Fishing, Jordan River Michigan",
        url: "https://diyflyfishing.com/jordan-river-michigan/",
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
