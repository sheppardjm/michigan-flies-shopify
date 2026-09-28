import { z } from "zod";
import { SpeciesList, type Species } from "./schema";

/**
 * Target species for Michigan rivers.
 *
 * Seeded from `reports/Michigan river flies and hatch timing.md` (sections 3-6)
 * and the research notes under `research_notes/Michigan river flies and hatch timing/`.
 *
 * Evidence classes on diet rows:
 *   S = Michigan DNR stomach studies (RR1855 North Branch Au Sable 1962-71,
 *       RR1759 Anna River 1968) or DNR species pages
 *   A = guide / shop observation (Feenstra, Betts, Current Works, Hawkins,
 *       Rivers North, Caddis Shack, Great Lakes Angler)
 *   I = inference made while building this dataset
 */

const ALL_YEAR = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12];

const SRC = {
  mdnrBrown: {
    title: "Michigan DNR: Brown trout",
    url: "https://www.michigan.gov/dnr/education/michigan-species/fish-species/brown-trout",
  },
  mdnrBrook: {
    title: "Michigan DNR: Brook trout",
    url: "https://www.michigan.gov/dnr/education/michigan-species/fish-species/brook-trout",
  },
  mdnrSteelhead: {
    title: "Michigan DNR: Steelhead",
    url: "https://www.michigan.gov/dnr/education/michigan-species/fish-species/steelhead",
  },
  mdnrChinook: {
    title: "Michigan DNR: Chinook salmon",
    url: "https://www.michigan.gov/dnr/education/michigan-species/fish-species/chinook-salmon",
  },
  mdnrCoho: {
    title: "Michigan DNR: Coho salmon",
    url: "https://www.michigan.gov/dnr/education/michigan-species/fish-species/coho-salmon",
  },
  mdnrPink: {
    title: "Michigan DNR: Pink salmon",
    url: "https://www.michigan.gov/dnr/education/michigan-species/fish-species/pink-salmon",
  },
  mdnrAtlantic: {
    title: "Michigan DNR: Atlantic salmon",
    url: "https://www.michigan.gov/dnr/education/michigan-species/fish-species/atlantic-salmon",
  },
  rr1855: {
    title: "MDNR Fisheries Research Report 1855: Diet of large brown trout, North Branch Au Sable (Alexander)",
    url: "https://www2.dnr.state.mi.us/publications/pdfs/DNRFishLibrary/ResearchReports/RR1801-RR1900/RR1855.pdf",
    year: 1977,
  },
  rr1759: {
    title: "MDNR Institute for Fisheries Research Report 1759: Food of brown trout, Anna River (Hannuksela)",
    url: "https://www.michigandnr.com/publications/pdfs/DNRFishLibrary/ResearchReports/RR1701-RR1800/RR1759.pdf",
    year: 1969,
  },
  rr1893: {
    title: "MDNR Fisheries Research Report 1893: Pink salmon distribution and abundance (Wagner & Stauffer)",
    url: "https://www.dnr.state.mi.us/publications/pdfs/DNRFishLibrary/ResearchReports/RR1801-RR1900/RR1893.pdf",
    year: 1982,
  },
  littleManisteeWeir: {
    title: "Michigan DNR: Little Manistee River Weir",
    url: "https://www.michigan.gov/dnr/managing-resources/fisheries/hatcheries/little-manistee-river-weir",
  },
  mdnr2026Steelhead: {
    title: "Michigan DNR release: Spring steelhead egg collection on Little Manistee River, April 14",
    url: "https://www.michigan.gov/dnr/about/newsroom/releases/2026/04/06/dnr-to-begin-spring-steelhead-egg-collection-on-little-manistee-river-april-14",
    year: 2026,
  },
  mdnr2021Salmon: {
    title: "Michigan DNR release: Chinook and coho salmon runs begin as DNR gears up for egg takes",
    url: "https://www.michigan.gov/dnr/about/newsroom/releases/2021/09/30/chinook-and-coho-salmon-runs-begin-as-dnr-gears-up-for-egg-takes",
    year: 2021,
  },
  outdoorNews2025: {
    title: "Outdoor News: Michigan DNR collected more than 16 million trout and salmon eggs this season",
    url: "https://www.outdoornews.com/2025/12/16/michigan-dnr-fisheries-staff-collected-more-than-16-million-trout-and-salmon-eggs-this-season/",
    year: 2025,
  },
  bridgeBagLimits: {
    title: "Bridge Michigan: Steelhead bag limits reduced on some Michigan waters amid fish declines",
    url: "https://bridgemi.com/michigan-environment-watch/steelhead-bag-limits-reduced-some-michigan-waters-amid-fish-declines/",
    year: 2022,
  },
  bridgeSteelheadStruggle: {
    title: "Bridge Michigan: Steelhead struggle in some Michigan waters",
    url: "https://bridgemi.com/michigan-environment-watch/steelhead-struggle-some-michigan-waters-will-catch-limit-help/",
  },
  indianaDnr: {
    title: "Indiana DNR: Lake Michigan fishing (Skamania and winter-run steelhead)",
    url: "https://www.in.gov/dnr/fish-and-wildlife/fishing/lake-michigan-fishing/",
  },
  glaSummerRun: {
    title: "Great Lakes Angler: Michigan's summer run (Robert Gwizdz)",
    url: "https://www.glangler.com/blogs/articles/michigan-s-summer-run-by-robert-gwizdz",
  },
  glaAuSableAtlantics: {
    title: "Great Lakes Angler: Au Sable Atlantics (Robert Gwizdz)",
    url: "https://www.glangler.com/blogs/articles/au-sable-atlantics-robert-gwizdz",
  },
  glaStraw: {
    title: "Great Lakes Angler: Finding veins of silver, optimum conditions for steelhead (Matt Straw)",
    url: "https://www.glangler.com/blogs/articles/finding-veins-of-silver-optimum-conditions-for-steelhead-matt-straw",
  },
  tsLakeSuperior: {
    title: "Trout and Steelhead: Lake Superior steelhead fishing",
    url: "https://troutandsteelhead.net/lake-superior-steelhead-fishing/",
  },
  workman2002: {
    title: "Workman, Hayes & Coon: Water temperature and steelhead movement, Pere Marquette and St. Joseph (TAFS 131:463)",
    url: "https://academic.oup.com/tafs/article/131/3/463/7891291",
    year: 2002,
  },
  snellCoon: {
    title: "Snell, Coon & Hayes (GLFC): Steelhead migration and temperature",
    url: "https://www.glfc.org/pubs/pdfs/research/reports/Snell_Coon.pdf",
  },
  seaGrantDiet: {
    title: "Michigan Sea Grant: Fish diet study reaches another milestone",
    url: "https://www.canr.msu.edu/news/fish-diet-study-reaches-another-milestone-msg19-okeefe19",
    year: 2019,
  },
  feenstraAnchored: {
    title: "Anchored Outdoors: Understanding baitfish seasons with Kevin Feenstra",
    url: "https://anchoredoutdoors.com/guaranteed-to-catch-more-fish-understanding-baitfish-seasons-with-kevin-feenstra/",
  },
  feenstraGamefish: {
    title: "Feenstra Outdoors: Gamefish of the Muskegon",
    url: "https://feenstraoutdoors.com/wordpress/gamefish-2/",
  },
  bettsSpring: {
    title: "Betts Guide Service: Muskegon River spring steelhead report",
    url: "https://bettsguideservice.com/muskegon-river-fishing-report-spring-steelhead/",
  },
  bettsSuckerSpawn: {
    title: "Betts Guide Service: Michigan trout guides, sucker spawn",
    url: "https://bettsguideservice.com/michigan-trout-guides-sucker-spawn/",
  },
  bettsPM: {
    title: "Betts Guide Service: Pere Marquette River salmon fishing report",
    url: "https://bettsguideservice.com/pere-marquette-river-salmon-fishing-report/",
  },
  bettsAtlantic: {
    title: "Betts Guide Service: Michigan Atlantic salmon",
    url: "https://bettsguideservice.com/michigan-atlantic-salmon.html",
  },
  perfectFlyStMarys: {
    title: "Perfect Fly: Fly fishing the St. Marys River, Michigan",
    url: "https://perfectflystore.com/your-streams/fly-fishing-the-st-marys-river-michigan/",
  },
  fishbio: {
    title: "FISHBIO: The bite's on (why spawning salmon strike)",
    url: "https://fishbio.com/the-bites-on/",
  },
  riversNorthAtlantic: {
    title: "Rivers North: St. Marys River Atlantic salmon",
    url: "https://riversnorth.net/atlanticsalmon.html",
  },
  riversNorthSteelhead: {
    title: "Rivers North: Upper Peninsula steelhead",
    url: "https://riversnorth.net/steelhead.html",
  },
  fishSens: {
    title: "FishSens: St. Marys River Atlantic salmon among the hardest fighting fish in the Great Lakes",
    url: "https://www.fishsens.com/st-marys-rivers-atlantic-salmon-among-the-hardest-fighting-fish-in-the-great-lakes/",
  },
  flylordsSalmon: {
    title: "Flylords: Salmon of the Great Lakes",
    url: "https://flylordsmag.com/salmon-of-the-great-lakes/",
  },
  flylordsPink: {
    title: "Flylords: Catching humpbacks on a fly rod, get to know the pink salmon",
    url: "https://flylordsmag.com/catching-humpbacks-on-a-fly-rod-get-to-know-the-pink-salmon/",
  },
  mnDnrPink: {
    title: "Minnesota DNR: Pink salmon (Lake Superior tributaries)",
    url: "https://www.dnr.state.mn.us/fishing/trout/pink-salmon.html",
  },
  cwTerrestrials: {
    title: "Current Works: Terrestrial fishing, grasshoppers and more",
    url: "https://www.current-works.com/fly-fishing-articles/terrestrial-fishing-grasshopper/",
  },
  cwSeasons: {
    title: "Current Works: Trout fishing seasons, Traverse City and northern Michigan",
    url: "https://www.current-works.com/fly-fishing-seasons/trout-traverse-city-northern-michigan/",
  },
  cwEggPatterns: {
    title: "Current Works: Egg patterns, matching the hatch for steelhead",
    url: "https://www.current-works.com/fly-fishing-articles/egg-patterns-matching-hatch-steelhead/",
  },
  cwTop5: {
    title: "Current Works: Top 5 steelhead flies for Michigan",
    url: "https://www.current-works.com/fly-fishing-articles/top-5-steelhead-flies/",
  },
  cwSalmon: {
    title: "Current Works: Salmon fishing, Betsie and Manistee",
    url: "https://www.current-works.com/fly-fishing-seasons/salmon-betsie-manistee-northern-michigan/",
  },
  mangledNight: {
    title: "Mangled Fly: Night fishing and mousing",
    url: "https://mangledfly.com/night-fishing/",
  },
  sippingMayflies: {
    title: "Sipping Mayflies: Mousing for brown trout",
    url: "https://sippingmayflies.com/mousing-for-brown-trout/",
  },
  hawkinsManistee: {
    title: "Hawkins Outfitters: Manistee River steelhead fishing",
    url: "https://hawkinsoutfitters.com/manistee-river-steelhead-fishing/",
  },
  orvisSpring: {
    title: "Orvis: Top five flies for spring Great Lakes steelhead (Chuck Hawkins)",
    url: "https://news.orvis.com/fly-fishing/pro-tips-top-five-flies-for-spring-great-lakes-steelhead",
  },
  orvisTop10: {
    title: "Orvis: Chuck Hawkins's top 10 Michigan flies",
    url: "https://news.orvis.com/fly-fishing/tuesday-tip-chuck-hawkinss-top-10-michigan-flies",
  },
  wetFlySwingGalloup: {
    title: "Wet Fly Swing: Kelly Galloup on the best streamer strategies for giant trout",
    url: "https://www.wetflyswing.com/kelly-galloup-on-the-best-streamer-strategies-for-giant-trout/",
  },
  caddisShack: {
    title: "Caddis Shack Guide Service: Steelhead fly fishing in the Upper Peninsula",
    url: "https://www.caddisshackguideservice.com/blog/steelhead-fly-fishing-in-the-upper-peninsula",
  },
  midcurrentWinter: {
    title: "MidCurrent: What do winter steelhead eat? A guide to fly selection",
    url: "https://midcurrent.com/v2/what-do-winter-steelhead-eat-a-guide-to-fly-selection/",
  },
  tafsBrookTerrestrials: {
    title: "Sweka & Hartman: Terrestrial invertebrates in brook trout diet, West Virginia (TAFS 137:224)",
    url: "https://academic.oup.com/tafs/article/137/1/224/7888240",
    year: 2008,
  },
  miningJournalCoasters: {
    title: "The Mining Journal: Coaster brook trout restoration areas created",
    url: "https://www.miningjournal.net/news/front-page-news/2015/04/coaster-brook-trout-restoration-areas-created/",
    year: 2015,
  },
  hokanson: {
    title: "Hokanson et al.: Thermal requirements for maturation, spawning and embryo survival of brook trout",
    url: "https://cdnsciencepub.com/doi/10.1139/f73-158",
    year: 1973,
  },
  outfishAuSable: {
    title: "Outfish: Au Sable River fishing guide",
    url: "https://www.outfish.in/au_sable/fishing-guide",
  },
  krebs2018: {
    title: "Krebs et al.: Landlocked fall Chinook salmon egg size (Allied Academies)",
    url: "https://www.alliedacademies.org/articles/landlocked-fall-chinook-salmon-egg-size-is-positively-related-to-hatching-time-10971.html",
    year: 2018,
  },
  stoneColdBeads: {
    title: "Stone Cold Beads: Bead fishing basics (roe size by species)",
    url: "https://stonecoldbeads.com/bead-fishing-basics/",
  },
  fishSite: {
    title: "The Fish Site: Cultured aquaculture species, rainbow trout",
    url: "https://thefishsite.com/articles/cultured-aquaculture-species-rainbow-trout",
  },
  icesAtlanticEggs: {
    title: "ICES Journal of Marine Science 69:1678: Atlantic salmon egg size (Miramichi)",
    url: "https://academic.oup.com/icesjms/article/69/9/1678/639366",
    year: 2012,
  },
  mdbBrown: {
    title: "MDB fish fact sheet: Brown trout (egg size)",
    url: "https://www.mdb.fish/fish-fact-sheets/brown-trout",
  },
  midcurrentEggFlies: {
    title: "MidCurrent: How to tie egg flies for salmon and steelhead",
    url: "https://midcurrent.com/v2/how-to-tie-egg-flies-salmon-steelhead/",
  },
  digest2026: {
    title: "2026 Michigan Fishing Regulations digest",
    url: "https://www.michigan.gov/dnr/-/media/Project/Websites/dnr/Documents/LED/digests/2026-Michigan-Fishing-Regulations_web_accessible.pdf",
    year: 2026,
  },
  yooperPink: {
    title: "Yooper Webcam: Pink salmon in Michigan",
    url: "https://yooperwebcam.com/fishing-database-mi/pink-salmon/",
  },
  jerryDennisPink: {
    title: "Jerry Dennis: Saga of the pink salmon",
    url: "https://jerrydennis.net/1/post/2017/09/saga-of-the-pink-salmon.html",
    year: 2017,
  },
  streamsideAtlantic: {
    title: "Streamside (Au Sable guides): Atlantic salmon in Michigan",
    url: "https://michigan-streamside.com/atlantic-salmon-in-michigan/",
  },
  lssuAtlantic: {
    title: "LSSU: 40 years of Atlantic salmon release on the St. Marys River",
    url: "https://www.lssu.edu/celebrate-40-years-of-lssus-atlantic-salmon-release-on-the-st-marys-river/",
    year: 2026,
  },
  seaGrantFastFacts: {
    title: "Michigan Sea Grant: Fast facts on Lake Michigan salmon and trout",
    url: "https://www.canr.msu.edu/news/fast_facts_on_lake_michigan_salmon_and_trout_msg16_okeefe16",
    year: 2016,
  },
  michiganFishingGuideCoho: {
    title: "Michigan Fishing Guide: Coho salmon",
    url: "https://www.michiganfishing.guide/species/coho-salmon/",
  },
  riverReportsGL: {
    title: "RiverReports: Great Lakes steelhead fishing",
    url: "https://www.riverreports.com/river-intel/topics/great-lakes-steelhead-fishing",
  },
  tsSummer: {
    title: "Trout and Steelhead: Summer steelhead fishing in Michigan",
    url: "https://troutandsteelhead.net/summer-steelhead-fishing-michigan/",
  },
  tafsBrookThermal: {
    title: "TAFS 154:7: Brook trout thermal thresholds in fragmented Michigan streams",
    url: "https://academic.oup.com/tafs/article/154/1/7/8081929",
    year: 2025,
  },
} as const;

const raw: z.input<typeof SpeciesList> = [
  /* ------------------------------------------------------------------ */
  /* Brown trout                                                         */
  /* ------------------------------------------------------------------ */
  {
    id: "brown-trout",
    name: "Brown trout",
    scientificName: "Salmo trutta",
    feedingModel: "piscivore",
    secondaryFeedingModel: "hatch-matcher",
    dietSummary:
      "The only Michigan stomach science is unambiguous: large North Branch Au Sable browns were 70 to 80 percent fish (mostly small brook trout plus coarse fish), and Anna River browns over about 12 inches ate mostly fish (stocked coho smolts in May, slimy sculpin June to October) while smaller fish fed mainly on caddis. Treat browns over 12 inches as piscivores that also rise to Hex, terrestrials and mice, and browns under 12 inches as hatch-matchers.",
    diet: [
      {
        months: ALL_YEAR,
        items: [
          "small brook trout",
          "small brown trout",
          "slimy and mottled sculpin",
          "coarse fish (dace, shiners, darters)",
        ],
        evidence: "S",
      },
      {
        months: [5, 6],
        items: ["stocked coho smolts (3.6 to 5.7 in)", "salmon and steelhead fry", "sucker fry"],
        evidence: "S",
      },
      {
        months: [5, 6, 7, 8, 9, 10],
        items: ["caddis larvae and pupae (dominant for browns under 12 in)", "mayfly and stonefly nymphs"],
        evidence: "S",
      },
      {
        months: [6, 7],
        items: ["Hexagenia nymphs, duns and spinners after dark", "Isonychia", "Brown Drake"],
        evidence: "A",
      },
      {
        months: [5, 6, 7, 8, 9, 10],
        items: ["grasshoppers", "ants and flying ants", "beetles", "crickets after rain", "inchworms"],
        evidence: "A",
      },
      {
        months: [7, 8, 9],
        items: ["mice and voles at night", "frogs"],
        evidence: "A",
      },
      {
        months: [6, 7, 8, 9],
        items: ["crayfish"],
        evidence: "A",
      },
      {
        months: [9, 10, 11],
        items: ["drifting Chinook and coho eggs (resident and lake-run browns behind salmon)"],
        evidence: "A",
      },
    ],
    spawn: {
      months: [9, 10, 11],
      waterTempF: [43, 48],
      eggDiameterMm: [4, 5],
      eggColors: ["Steelhead Orange", "Egg", "Oregon Cheese"],
      evidence: "S",
      notes:
        "DNR: browns spawn in tributary streams in September and October; secondary sources extend spawning into November and December. The 6 to 9 C (43 to 48 F) spawning temperature comes from non-Michigan studies. Fresh eggs are bright orange; aging eggs wash out toward Oregon Cheese and cream.",
    },
    runs: [
      {
        type: "resident",
        months: ALL_YEAR,
        peakMonths: [4, 5, 10, 11],
        notes:
          "Year-round residents of the Au Sable, Manistee, Pere Marquette, Boardman, Muskegon below Croton, Rogue, Rifle and UP rivers such as the Escanaba. Streamer fishing is hardest April to May and late September to November (pre-spawn); the Manistee and Boardman extended-season water fishes streamers all winter.",
        evidence: "A",
      },
      {
        type: "fall",
        months: [9, 10, 11],
        peakMonths: [10, 11],
        notes:
          "Lake-run browns (average 8 lb per DNR) stage at stream mouths from late summer and follow salmon up the Pere Marquette, Manistee, Betsie and Boardman in late October and November to spawn and eat eggs. Uncommon and declining on Lake Michigan tributaries.",
        evidence: "A",
      },
      {
        type: "winter",
        months: [12, 1, 2, 3],
        peakMonths: [],
        notes:
          "Lake-run browns are most abundant on the Muskegon from late September through March; they are meat eaters that take sculpin and baitfish streamers.",
        evidence: "A",
      },
    ],
    regulationsNote:
      "Only three reaches are both flies-only and no-kill year-round: the Au Sable Holy Water (Burton's Landing to Wakeley Bridge), the South Branch from Chase Bridge to Lower High Banks, and the Pere Marquette from M-37 to Gleason's Landing. Other flies-only reaches allow two-fish harvest, and scented material is illegal on all flies-only gear-restricted streams. Type 1 and 2 streams close September 30 (2026 digest).",
    description:
      "Introduced to Michigan in 1883, the brown trout is the fish the Au Sable, Pere Marquette and Manistee are famous for, and it is the reason the modern articulated-streamer movement started here. Michigan DNR stomach studies show that browns over roughly 12 inches are true predators, eating small brook trout, sculpins and juvenile salmon rather than insects, while smaller fish feed largely on caddis and other aquatic insects. Big browns are nocturnal, which is why Hex nights and July-to-September mousing produce the largest fish of the year. Browns tolerate warmer water than other trout and spawn in tributaries in September and October, when pre-spawn aggression makes streamers deadly. A smaller lake-run component follows salmon into Lake Michigan tributaries in October and November.",
    sources: [SRC.rr1855, SRC.rr1759, SRC.mdnrBrown, SRC.cwSeasons, SRC.mangledNight, SRC.wetFlySwingGalloup, SRC.feenstraGamefish],
  },

  /* ------------------------------------------------------------------ */
  /* Brook trout                                                         */
  /* ------------------------------------------------------------------ */
  {
    id: "brook-trout",
    name: "Brook trout",
    scientificName: "Salvelinus fontinalis",
    feedingModel: "hatch-matcher",
    dietSummary:
      "Michigan DNR describes brook trout as voracious feeders on seasonally available mayflies, stoneflies and other aquatic insects plus terrestrials, that will also take whatever is most readily available including zooplankton, crustaceans, worms and fish. No Michigan study quantifies terrestrial share, but West Virginia stream brook trout drew 38 to 47 percent of yearly biomass and 51 to 63 percent of energy from terrestrials, which supports an ant-beetle-hopper emphasis from midsummer on.",
    diet: [
      {
        months: [4, 5, 6, 7, 8, 9],
        items: ["mayfly nymphs, duns and spinners", "stonefly nymphs", "caddis larvae, pupae and adults", "midges"],
        evidence: "S",
      },
      {
        months: [5, 6, 7, 8, 9, 10],
        items: ["ants and flying ants", "beetles", "grasshoppers", "crickets", "inchworms"],
        evidence: "A",
      },
      {
        months: ALL_YEAR,
        items: ["zooplankton", "scuds and other crustaceans", "worms", "small fish (sculpin, dace, fry)"],
        evidence: "S",
      },
      {
        months: [10, 11],
        items: ["brook and brown trout eggs on small spawning streams"],
        evidence: "I",
      },
    ],
    spawn: {
      months: [10, 11],
      eggDiameterMm: [4.1, 4.6],
      eggColors: ["Oregon Cheese", "Apricot", "Peach"],
      evidence: "S",
      notes:
        "DNR: spawning generally occurs in October and November on gravel in spring-fed streams or groundwater seepages; up to 5,000 eggs per female. Lab work (Hokanson 1973) puts ovulation at 16 C (61 F) and below with a mid-November peak in the study population. Egg diameter of 4.1 to 4.6 mm is from a secondary source and unverified; egg color names are inferred from the general trout-egg palette, not measured.",
    },
    runs: [
      {
        type: "resident",
        months: ALL_YEAR,
        peakMonths: [5, 6, 7, 8, 9],
        notes:
          "Widespread across the northern Lower Peninsula and especially the Upper Peninsula, where any stream that runs clear and cold is likely to hold brook trout. Fish move to headwaters and groundwater seeps in summer (movement threshold about 18 C). UP brook trout fish best August to September on rivers like the Fox; the traditional trout season runs from the last Saturday in April to September 30.",
        evidence: "S",
      },
      {
        type: "summer",
        months: [7, 8, 9, 10, 11],
        peakMonths: [9, 10],
        notes:
          "Coaster (lake-run) brook trout begin spawning migrations into Lake Superior streams in mid-July and spawn in October and November. The Salmon Trout River in the Huron Mountains is the only south-shore stream with a significant population; restoration areas exist on the Iron, Big and Little Huron, Big Garlic, Pilgrim, Silver, Slate and Ravine rivers. Numbers are very low.",
        evidence: "A",
      },
    ],
    regulationsNote:
      "Coaster regulations: 18-inch minimum and one fish on the Salmon Trout River; 20-inch minimum and one fish in the 2015 coaster restoration areas (Marquette, Houghton and Baraga county streams). Elsewhere the general inland trout season and stream type rules apply; Type 1 and 2 streams close September 30.",
    description:
      "Michigan's native state fish, the brook trout is the headwater and Upper Peninsula trout, found in any stream that runs clear and cold and in the Black River system of the northeast Lower Peninsula. It is an opportunistic insect feeder, taking mayflies, stoneflies and caddis in season and turning heavily to ants, beetles and hoppers from midsummer through early fall. Stream fish run 7 to 9 inches, while the remnant coaster form of Lake Superior can reach 25 inches and 10 pounds. Brook trout spawn in October and November on groundwater gravel, and small brook trout are themselves the main prey of large Au Sable brown trout. Warming water is the species' main threat, with a movement threshold near 18 C and a lethal limit near 25 C documented in Michigan streams.",
    sources: [SRC.mdnrBrook, SRC.rr1855, SRC.tafsBrookTerrestrials, SRC.miningJournalCoasters, SRC.hokanson, SRC.tafsBrookThermal, SRC.cwTerrestrials],
  },

  /* ------------------------------------------------------------------ */
  /* Rainbow trout (resident stream rainbows)                            */
  /* ------------------------------------------------------------------ */
  {
    id: "rainbow-trout",
    name: "Rainbow trout (resident)",
    scientificName: "Oncorhynchus mykiss",
    feedingModel: "hatch-matcher",
    dietSummary:
      "No Michigan river diet study for resident rainbows was located; the Muskegon juvenile-steelhead paper (Godby et al. 2007) exists but its percentages are paywalled. Guides describe Muskegon resident rainbows eating fry of all kinds, stoneflies, caddis, Sulphurs, Gray Drakes and Isonychia, feeding behind sucker redds on eggs, nymphs and steelhead fry in May and June, and Pine River rainbows taking Pteronarcys nymphs and sculpins. Model them as hatch-matchers with a strong fry and egg emphasis in spring.",
    diet: [
      {
        months: [3, 4, 5, 6],
        items: ["Chinook and steelhead fry", "sucker fry", "black stonefly and golden stonefly nymphs"],
        evidence: "A",
      },
      {
        months: [4, 5, 6],
        items: ["sucker and redhorse eggs behind redds", "drifting steelhead eggs", "walleye eggs"],
        evidence: "A",
      },
      {
        months: [5, 6, 7, 8],
        items: ["caddis", "Sulphurs", "Gray Drakes", "Isonychia", "Hex where present"],
        evidence: "A",
      },
      {
        months: ALL_YEAR,
        items: ["sculpins", "Pteronarcys nymphs (Pine River)", "small nymphs and streamers in winter"],
        evidence: "A",
      },
      {
        months: [9, 10, 11],
        items: ["drifting Chinook and coho eggs"],
        evidence: "A",
      },
    ],
    spawn: {
      months: [3, 4, 5],
      eggDiameterMm: [3, 7],
      eggColors: ["Apricot", "Peach", "Pale Yellow"],
      evidence: "I",
      notes:
        "Resident rainbows are the same species as steelhead and spawn in spring; the month window is inferred from the DNR steelhead calendar (March and April in the Lower Peninsula, into May in the north). The 3 to 7 mm egg range is an aquaculture figure for rainbow trout, not a Great Lakes measurement.",
    },
    runs: [
      {
        type: "resident",
        months: ALL_YEAR,
        peakMonths: [5, 6],
        notes:
          "Resident rainbows are year-round fish on the Muskegon below Croton, the Rogue, Pine, Manistee, Pere Marquette and the St. Marys rapids, and wild rainbows hold in Paint Creek. Muskegon surface feeding begins when water reaches 50 to 60 F in May and June.",
        evidence: "A",
      },
    ],
    regulationsNote:
      "General inland trout season and stream type rules apply; extended-season reaches (for example the Manistee and Boardman gear-restricted water) stay open all year. Rainbows in the Great Lakes tributaries are counted with steelhead for bag limits, so the one-fish spring limit (March 15 to May 15) applies on the listed rivers regardless of a fish's life history.",
    description:
      "Resident stream rainbows are the non-migratory form of the same species as steelhead, holding year-round in tailwaters such as the Muskegon below Croton and in cold tributaries like the Rogue, Pine and Paint Creek. They are the most surface-oriented of Michigan's river trout once water passes 50 F, feeding on Sulphurs, Gray Drakes, Isonychia and caddis in May and June. In spring they gorge on Chinook fry and on sucker, walleye and steelhead eggs behind active redds, which makes fry patterns and pale-yellow sucker spawn as productive as dries. No Michigan diet study exists for resident rainbows, so the seasonal picture here rests on guide observation. Spawning is in spring, on the same March-to-May gravel schedule as steelhead.",
    sources: [SRC.feenstraGamefish, SRC.bettsSuckerSpawn, SRC.bettsSpring, SRC.mdnrSteelhead, SRC.fishSite, SRC.cwEggPatterns],
  },

  /* ------------------------------------------------------------------ */
  /* Steelhead                                                           */
  /* ------------------------------------------------------------------ */
  {
    id: "steelhead",
    name: "Steelhead",
    scientificName: "Oncorhynchus mykiss (lake-run)",
    feedingModel: "egg-nymph-feeder",
    secondaryFeedingModel: "piscivore",
    dietSummary:
      "Lake diet is more than 90 percent alewife (Michigan Sea Grant), but steelhead demonstrably feed in rivers: guides describe fall fish switching from alewife to river shiners and keying on Chinook eggs, winter fish on sculpins, gobies, darters and stonefly nymphs, and spring fish gorging on Chinook fry, black stoneflies, Hex nymphs, green caddis larvae and steelhead, sucker and walleye eggs. No Michigan adult-steelhead stomach study was found; the widely quoted 90-percent-empty winter figure is uncited.",
    diet: [
      {
        months: [9, 10, 11],
        items: ["fresh Chinook and coho eggs behind spawning salmon", "emerald and spottail shiners", "sculpins"],
        evidence: "A",
      },
      {
        months: [12, 1, 2],
        items: ["sculpins", "round gobies", "darters", "stonefly nymphs", "aging salmon and brown trout eggs", "Hex nymphs"],
        evidence: "A",
      },
      {
        months: [3, 4, 5],
        items: [
          "early black stonefly nymphs",
          "Hexagenia nymphs",
          "green caddis larvae",
          "Chinook fry and alevin",
          "sucker fry",
          "steelhead, sucker and walleye eggs",
          "sculpins, gobies and chubs (drop-backs)",
        ],
        evidence: "A",
      },
      {
        months: [5, 6],
        items: ["Hex nymphs, caddis and stonefly nymphs, fish roe (St. Marys rapids run)"],
        evidence: "A",
      },
      {
        months: [6, 7, 8, 9],
        items: ["same forage as fall and spring fish; Skamania summer-runs seek cold tributaries above about 67 F"],
        evidence: "I",
      },
    ],
    spawn: {
      months: [3, 4, 5],
      waterTempF: [40, 43],
      eggDiameterMm: [4, 5],
      eggColors: ["Apricot", "Peach", "Pale Yellow", "Oregon Cheese", "Light Pink"],
      evidence: "S",
      notes:
        "DNR: fall-run fish spawn first, often in March, followed by spring-run fish in April; the Little Manistee weir is boarded in mid-March with egg takes scheduled April 14 to 22, 2026. Upper Peninsula fish spawn into early and mid May; Skamania spawn February to mid-March on the St. Joseph. The 40 to 43 F spawning temperature is from angler press, not an agency source. Eggs are translucent yellow to yellow-orange; the 4 to 5 mm size is a vendor figure.",
    },
    runs: [
      {
        type: "fall",
        months: [10, 11, 12],
        peakMonths: [11],
        notes:
          "Entry from late October (as early as late September on the Muskegon and Manistee), conditional on rain and cooling; warm dry Octobers push meaningful entry into November. Lake Superior tributaries compress the fall window to October and November. Fish key on salmon eggs and shiners.",
        evidence: "S",
      },
      {
        type: "winter",
        months: [12, 1, 2],
        peakMonths: [],
        notes:
          "Fall fish overwinter in the rivers; slow indicator or chuck-and-duck presentations with eggs, small stones and Hex nymphs, or a slow swing with olive, tan or Grapefruit leeches. Strikes in 30 F water are subtle.",
        evidence: "S",
      },
      {
        type: "spring",
        months: [3, 4, 5],
        peakMonths: [3, 4],
        notes:
          "Spawn March to April in the Lower Peninsula (fall fish first) and April to early or mid May in the Upper Peninsula (Two Hearted peaks mid-May). Movement probability rises above about 3 C water, peak activity above 7 C and ladder passage above 9 C on steady or rising temperature (Pere Marquette and St. Joseph telemetry). Drop-backs feed hard on fry and sucker eggs into late May.",
        evidence: "S",
      },
      {
        type: "summer",
        months: [6, 7, 8, 9],
        peakMonths: [7, 8],
        notes:
          "Skamania summer-run fish are an agency program only on the St. Joseph (returns from mid to late June, spawning February to mid-March); the Big Manistee below Tippy is called the most dependable summer-run fishery in the state on Indiana-sourced stock. Reports of summer fish in the Grand, Muskegon, Pere Marquette and Rogue rest on angler media. Pushes follow rain and cooler September weather.",
        evidence: "A",
      },
    ],
    regulationsNote:
      "Effective January 9, 2022, the daily steelhead limit is one fish from March 15 to May 15 on Bear Creek, the Manistee, Pere Marquette, Muskegon, Manistique and Carp rivers. On all streams from August 1 to May 31 single hooks over a half-inch gap and lures over one ounce are illegal; a bead is a lure, legal when pegged within 4 inches of a half-inch single hook but never on flies-only water (2026 digest).",
    description:
      "Steelhead are lake-run rainbow trout that enter Michigan rivers from late October to early May, overwinter, and spawn in spring, with fall-run fish spawning first in March and spring-run fish in April. The Little Manistee weir, an unstocked and mostly wild run, is the state's only steelhead egg source and its mid-March-to-mid-April schedule is the best public anchor for the spring peak. Unlike Pacific salmon, steelhead feed in the river: on Chinook eggs and shiners in fall, sculpins and nymphs in winter, and fry, stoneflies, Hex nymphs and sucker eggs in spring, which is why one fly in a Michigan tandem rig is almost always an egg. The population is fragile, with Little Manistee counts falling from about 6,000 in 2002 to under 2,000 in 2020 and an April 2026 weir power failure killing more than 1,700 adults. Summer-run Skamania fish extend the season on the St. Joseph and Big Manistee from June to September.",
    sources: [
      SRC.mdnrSteelhead,
      SRC.mdnr2026Steelhead,
      SRC.littleManisteeWeir,
      SRC.workman2002,
      SRC.snellCoon,
      SRC.bridgeBagLimits,
      SRC.bridgeSteelheadStruggle,
      SRC.indianaDnr,
      SRC.glaSummerRun,
      SRC.tsLakeSuperior,
      SRC.seaGrantDiet,
      SRC.feenstraAnchored,
      SRC.bettsSpring,
      SRC.perfectFlyStMarys,
      SRC.cwTop5,
      SRC.midcurrentWinter,
      SRC.glaStraw,
    ],
  },

  /* ------------------------------------------------------------------ */
  /* Chinook salmon                                                      */
  /* ------------------------------------------------------------------ */
  {
    id: "chinook",
    name: "Chinook salmon",
    scientificName: "Oncorhynchus tshawytscha",
    feedingModel: "aggression-striker",
    dietSummary:
      "Lake diet is alewife (99 percent by one DNR account) with smelt and bloater. On the spawning run the DNR states salmon do not feed but will often strike out of aggression, and fisheries biologists attribute strikes to redd defense. Anglers nonetheless take Chinook on eggs and beads presented behind spawners, and on large dark or bright flies that trigger territorial strikes. Do not match diet; match triggers.",
    diet: [
      {
        months: [8, 9, 10, 11],
        items: ["does not feed in the river; strikes from aggression and redd defense"],
        evidence: "S",
      },
      {
        months: [9, 10],
        items: ["eggs and beads taken behind spawning fish", "Egg-Sucking Leeches, dark Woolly Buggers, Intruders in chartreuse, red, orange, black and blue"],
        evidence: "A",
      },
    ],
    spawn: {
      months: [8, 9, 10],
      waterTempF: [43, 59],
      eggDiameterMm: [6.36, 8.36],
      eggColors: ["Steelhead Orange", "Sockeye", "Salmon Egg", "Flame"],
      evidence: "S",
      notes:
        "DNR Pacific salmon egg takes run mid-September to late October; the Little Manistee Chinook take typically falls in the first week of October (September 29 to October 8 in 2025), which marks the ripe-fish peak. Entry is triggered by rivers and nearshore lake cooling into the 60s F plus rain. The 43 to 59 F spawning range is from a non-primary aggregator; egg diameter is from a landlocked population (mean 7.22 mm). Fresh eggs are orange to red-orange.",
    },
    runs: [
      {
        type: "fall",
        months: [8, 9, 10, 11],
        peakMonths: [9, 10],
        notes:
          "Catchable numbers by mid-August (earliest on the Betsie), peak mid-September to early October, spawned-out fish into early November. Lake Michigan Chinook were 72 percent wild in 2024; rivers with significant natural reproduction are the Muskegon, White, Pere Marquette, Little Manistee, Manistee and Betsie. Lake Huron weirs (Swan River) take eggs in the first two weeks of October.",
        evidence: "S",
      },
    ],
    regulationsNote:
      "On the listed salmon rivers (Betsie, Bear Creek, Manistee below Tippy, Big Sable, Pere Marquette, Little Manistee, White, Muskegon below Croton, Pentwater branches) terminal gear from August 1 to November 15 is limited to single hooks or jigs of half-inch gap or less; snagging is illegal statewide. A 2027 stocking cut is planned but will not change river presence through at least 2028.",
    description:
      "Chinook, or king salmon, are the largest fish in Michigan rivers, averaging 12 to 13 pounds on the Muskegon and arriving in catchable numbers by mid-August as rivers and the nearshore lake cool into the 60s. The run peaks from mid-September through the first week of October, when the Little Manistee weir takes its eggs, and the Manistee, Pere Marquette and St. Joseph are the DNR's named best stream fisheries. Kings stop feeding once they enter the river and strike out of aggression, so fresh chrome fish near the mouth take swung or stripped streamers on 9- and 10-weights while staged fish in October take dead-drifted eggs and Egg-Sucking Leeches. The Lake Michigan population is now majority wild, driven largely by Michigan tributaries. Their drifting eggs are the single most important food event of the year for steelhead and resident trout.",
    sources: [SRC.mdnrChinook, SRC.mdnr2021Salmon, SRC.outdoorNews2025, SRC.littleManisteeWeir, SRC.mdnrAtlantic, SRC.fishbio, SRC.flylordsSalmon, SRC.cwSalmon, SRC.seaGrantFastFacts, SRC.krebs2018, SRC.digest2026],
  },

  /* ------------------------------------------------------------------ */
  /* Coho salmon                                                         */
  /* ------------------------------------------------------------------ */
  {
    id: "coho",
    name: "Coho salmon",
    scientificName: "Oncorhynchus kisutch",
    feedingModel: "aggression-striker",
    dietSummary:
      "Larger coho feed primarily on smelt and alewife in the lake and are opportunistic feeders there, but on the spawning run they do not feed and strike from aggression. Coho respond especially well to flash: flash flies, chartreuse-and-white or pink Clousers, and Egg-Sucking Leeches swung through runs and tailouts, plus eggs and beads behind spawning fish.",
    diet: [
      {
        months: [9, 10, 11, 12],
        items: ["does not feed in the river; strikes from aggression"],
        evidence: "S",
      },
      {
        months: [10, 11],
        items: ["eggs and beads behind spawning fish", "flash flies and Clousers (chartreuse/white, pink)", "Egg-Sucking Leeches with chartreuse, orange, red or pink heads"],
        evidence: "A",
      },
    ],
    spawn: {
      months: [9, 10, 11],
      eggDiameterMm: [6, 8],
      eggColors: ["Steelhead Orange", "Sockeye", "Salmon Egg", "Oregon Cheese"],
      evidence: "S",
      notes:
        "DNR: coho spawning runs occur from early September to November depending on the tributary; the Platte weir egg take typically falls in the third week of October (October 16 to 28 in 2025, nearly 6 million eggs). No spawning temperature was found in an agency source. The 6 to 8 mm egg size is a bead-vendor figure, not a Great Lakes measurement.",
    },
    runs: [
      {
        type: "fall",
        months: [9, 10, 11, 12],
        peakMonths: [10],
        notes:
          "Platte and Betsie September to October (Platte peak mid to late October), Manistee late October to November, Grand, Muskegon, Kalamazoo, Boardman and Big Sable October to November, St. Joseph into late December. Largely stocking-sustained (about 1.5 million per year, half in the Platte); the Anna River is the best Upper Peninsula coho water in September and October.",
        evidence: "S",
      },
    ],
    regulationsNote:
      "Same August 1 to November 15 single-hook terminal-gear rules as Chinook on the listed salmon rivers; the DNR passes 20,000 coho above the Platte weir under a consent decree and harvests the remainder.",
    description:
      "Coho migrate later than Chinook and travel farther, with tributary runs from early September to November and St. Joseph fish caught as late as Christmas. The Platte River, home of the state coho hatchery and about half of Michigan's plants, peaks at its mid-to-late October egg take, and the Manistee has a notable late-October fishery. Like kings they stop feeding in the river, but coho are famously responsive to flash and bright color, so swung flash flies, pink or chartreuse Clousers and Egg-Sucking Leeches on 7- and 8-weights are the standard approach. Their eggs are a secondary drift source behind Chinook through October and November. The fishery is largely stocking-sustained at roughly 1.5 million fish per year.",
    sources: [SRC.mdnrCoho, SRC.mdnr2021Salmon, SRC.outdoorNews2025, SRC.mdnrAtlantic, SRC.flylordsSalmon, SRC.michiganFishingGuideCoho, SRC.stoneColdBeads],
  },

  /* ------------------------------------------------------------------ */
  /* Pink salmon                                                         */
  /* ------------------------------------------------------------------ */
  {
    id: "pink-salmon",
    name: "Pink salmon",
    scientificName: "Oncorhynchus gorbuscha",
    feedingModel: "aggression-striker",
    dietSummary:
      "In the lake, Great Lakes pinks eat a variety of fish and other aquatic animals. On the run they behave like the other Pacific salmon and are taken on small bright flies rather than imitations: size 8 beadhead Woolly Buggers in black, olive or pink, size 12 to 20 nymphs (Frenchies, Pheasant Tails, Copper Johns, scuds, zebra midges) in clear water, and small pink or chartreuse eggs and beadheads with flash. Streamers and nymphs account for most of the pinks taken in the St. Marys rapids.",
    diet: [
      {
        months: [8, 9, 10],
        items: ["does not feed in the river; strikes at small bright flies"],
        evidence: "S",
      },
      {
        months: [8, 9, 10],
        items: ["small pink and chartreuse eggs and beadheads", "size 8 Woolly Buggers (black, olive, pink)", "size 12 to 20 nymphs and scuds in clear water"],
        evidence: "A",
      },
    ],
    spawn: {
      months: [8, 9],
      eggDiameterMm: [6, 8],
      eggColors: ["Pink Lady", "Shrimp Pink", "Salmon Egg"],
      evidence: "S",
      notes:
        "DNR: pink salmon spawning runs begin in the summer; spawning runs late August to September and peaks in the latter part of September; eggs hatch late December to late February and fry leave the gravel in late April to early May. No spawning temperature was found. The 6 to 8 mm size is a bead-vendor figure and the fresh egg color names are inferred from the pink-and-orange fly palette guides use for them.",
    },
    runs: [
      {
        type: "fall",
        months: [8, 9, 10],
        peakMonths: [9],
        notes:
          "Late August through September, fish remaining in the St. Marys rapids until mid-October. The St. Marys is the most outstanding pink fishery this side of Alaska; the Carp River (Mackinac County), Chocolay and other Lake Superior and northern Lake Huron tributaries also see runs. Odd-year runs are largest, but even-year runs have existed since 1976 and both now occur. Adults are 2 to 3 lb.",
        evidence: "S",
      },
    ],
    regulationsNote:
      "No pink-specific regulations; general Great Lakes tributary rules apply. The one-ounce lure limit on streams from August 1 to May 31 does not apply on the St. Marys River.",
    description:
      "Pink salmon reached the Great Lakes by accident in 1955 when about 20,000 fingerlings were released into a Lake Superior tributary near Thunder Bay, Ontario, and within a decade they were spawning in the St. Marys rapids. They now run Lake Superior and northern Lake Huron and Lake Michigan tributaries from late August through September, with the St. Marys, the Carp River and the Chocolay the best Michigan water. Runs are largest in odd-numbered years, though even-year fish have been present since the late 1970s and local reports conflict about which year is stronger. Adults are small at 2 to 3 pounds, so everything scales down: size 8 buggers, size 10 to 14 pink or chartreuse eggs and size 12 to 20 nymphs. Their eggs are a short-lived early-fall food source for steelhead and resident trout in Upper Peninsula rivers.",
    sources: [SRC.mdnrPink, SRC.rr1893, SRC.jerryDennisPink, SRC.yooperPink, SRC.perfectFlyStMarys, SRC.mnDnrPink, SRC.flylordsPink, SRC.digest2026],
  },

  /* ------------------------------------------------------------------ */
  /* Atlantic salmon                                                     */
  /* ------------------------------------------------------------------ */
  {
    id: "atlantic-salmon",
    name: "Atlantic salmon",
    scientificName: "Salmo salar",
    feedingModel: "in-river-feeder",
    dietSummary:
      "Atlantics are the exception among Michigan salmon: St. Marys guides describe fish arriving in late June on smelt and juvenile salmonids (stripped baitfish patterns on sink tips), switching to insects when the Hexagenia hatch starts in mid-July (Hex nymphs, caddis, midges under indicators), taking swung wets and eggs in the fall, and a DNR biologist reports Au Sable Atlantics caught January through April on streamers and nymphs. No stomach study exists, and the DNR's general statement that salmon do not feed on the run is contradicted for this species by guide experience.",
    diet: [
      {
        months: [6, 7],
        items: ["rainbow smelt", "juvenile salmon and steelhead", "large white or silver baitfish streamers 3 to 5 in on sink tips"],
        evidence: "A",
      },
      {
        months: [7, 8],
        items: ["Hexagenia nymphs", "caddis larvae and pupae", "midges"],
        evidence: "A",
      },
      {
        months: [9, 10, 11],
        items: ["drifting eggs", "swung wet flies and speys"],
        evidence: "A",
      },
      {
        months: [1, 2, 3, 4],
        items: ["streamers and nymphs below Foote Dam on the Au Sable"],
        evidence: "A",
      },
    ],
    spawn: {
      months: [10, 11],
      eggDiameterMm: [5.6, 5.6],
      eggColors: ["Oregon Cheese", "Apricot", "Steelhead Orange"],
      evidence: "S",
      notes:
        "DNR: the St. Marys run begins in mid-summer and runs until November when spawning commences; late October marks the spawning period in the rapids, and eggs and milt are collected at Lake Superior State University. Adults may survive and spawn in multiple years. The 5.6 mm figure is a mean from Miramichi one-sea-winter fish (no range reported); egg color names are inferred, not measured.",
    },
    runs: [
      {
        type: "summer",
        months: [6, 7, 8],
        peakMonths: [7, 8],
        notes:
          "St. Marys River: 2- to 5-year-old fish (2 to 8 lb average) arrive from Lake Huron in late June and stage below the Cloverland (formerly Edison Sault) hydro plant tailrace through August. LSSU rears and releases about 30,000 to 40,000 per year, 735,600 since 1987; the run is entirely stocked.",
        evidence: "A",
      },
      {
        type: "fall",
        months: [10, 11, 12],
        peakMonths: [10, 11],
        notes:
          "Spawning in the St. Marys rapids from late October into November. Experimental fall returns (primarily October to December) to the Au Sable below Foote Dam (40,000-plus juveniles released in 2023), the Thunder Bay River at Alpena and Lexington Harbor; a stocked population also holds in Torch Lake.",
        evidence: "S",
      },
      {
        type: "winter",
        months: [1, 2, 3, 4],
        peakMonths: [],
        notes:
          "Au Sable fish overwinter below Foote Dam and are caught January through April on streamers, nymphs and spawn; St. Marys post-spawn fish rest in the river and drop back to the lake in May and June.",
        evidence: "A",
      },
    ],
    regulationsNote:
      "The St. Marys River is a Great Lakes connecting water with its own rules, including exemption from the one-ounce stream lure limit; a guide source cites a three-fish daily Atlantic harvest limit there. Confirm current St. Marys and Au Sable Atlantic limits in the DNR digest before publishing a limit.",
    description:
      "Michigan's only established Atlantic salmon river fishery is the St. Marys at Sault Ste. Marie, where Lake Superior State University has reared and released fish inside the hydro plant since 1987. Adults of 2 to 8 pounds arrive from Lake Huron in late June, hold in the tailrace through August, and spawn in the rapids from late October into November. Unlike Pacific salmon they feed actively in the river, eating smelt and juvenile salmonids early, then switching to Hex nymphs, caddis and midges once the mid-July Hex hatch begins, which makes them a true match-the-food target on streamers, nymphs and swung wets. Experimental stocking has produced fall returns to the lower Au Sable, Thunder Bay River and Lexington Harbor, where fish regarded as among the hardest-fighting in the Great Lakes are caught below Foote Dam all winter.",
    sources: [SRC.mdnrAtlantic, SRC.riversNorthAtlantic, SRC.fishSens, SRC.bettsAtlantic, SRC.perfectFlyStMarys, SRC.glaAuSableAtlantics, SRC.streamsideAtlantic, SRC.lssuAtlantic, SRC.icesAtlanticEggs],
  },
];

export const species: Species[] = SpeciesList.parse(raw);
export const speciesById = new Map(species.map((s) => [s.id, s]));
