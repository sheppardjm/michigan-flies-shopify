import { z } from "zod";
import { EggSourceList, type EggSource } from "./schema";

/**
 * Egg availability calendar for Michigan rivers.
 *
 * Eggs drift roughly ten months a year: pink and Chinook from late August,
 * coho into November, brown, brook and lake trout in fall, Atlantic salmon in
 * late October (St. Marys), steelhead March to May, walleye in April, and
 * suckers and redhorse from late April into June. Most of what drifts is
 * non-viable, and unfertilized eggs go milky with patches of color (USGS),
 * which is the basis for veiled Nuke Eggs and cream "dead egg" yarns.
 *
 * `months` = when eggs are actually drifting and available to fish, so fall
 * salmon eggs run past the spawn as aging eggs wash out of redds.
 * Evidence: S = agency or peer-reviewed timing/size; A = angler/vendor;
 * I = inferred (typically the consumer list for a minor source).
 */

const SRC = {
  usgsEggColor: {
    title: "USGS FAQ: Why do salmon eggs come in different colors?",
    url: "https://www.usgs.gov/faqs/why-do-salmon-eggs-come-different-colors",
  },
  manny2010: {
    title: "Manny et al.: Walleye and white sucker spawning in the Detroit River (J. Great Lakes Res. 36:490)",
    url: "https://jamieschmale.ca/walleye/2010_Manny.pdf",
    year: 2010,
  },
  seaGrantSuckers: {
    title: "Michigan Sea Grant: Spring brings spawning fish into West Michigan streams",
    url: "https://www.michiganseagrant.org/blog/2025/03/20/spring-brings-spawning-fish-into-west-michigan-streams-and-you-can-help-to-monitor-spawning-runs-in-local-creeks/",
    year: 2025,
  },
  msuSuckersMirror: {
    title: "MSU Extension: Spring brings spawning fish into West Michigan streams (mirror)",
    url: "https://www.canr.msu.edu/news/spring-brings-spawning-fish-into-west-michigan-streams-and-you-can-help-to-monitor-spawning-runs-in-local-creeks-msg25-okeefe25",
    year: 2025,
  },
  mdnrSuckers: {
    title: "Michigan DNR: Carp and suckers",
    url: "https://www.michigan.gov/dnr/education/michigan-species/fish-species/carp-suckers",
  },
  hatchMagSuckerSpawn: {
    title: "Hatch Magazine: The sucker spawn (George Daniel)",
    url: "https://www.hatchmag.com/articles/sucker-spawn/7715199",
  },
  bettsSuckerSpawn: {
    title: "Betts Guide Service: Michigan trout guides, sucker spawn",
    url: "https://bettsguideservice.com/michigan-trout-guides-sucker-spawn/",
  },
  bettsMuskegon: {
    title: "Betts Guide Service: Best times to fish the Muskegon River",
    url: "https://bettsguideservice.com/best-times-fish-muskegon-river.html",
  },
  bettsPM: {
    title: "Betts Guide Service: Pere Marquette River salmon fishing report",
    url: "https://bettsguideservice.com/pere-marquette-river-salmon-fishing-report/",
  },
  adwWhiteSucker: {
    title: "Animal Diversity Web: Catostomus commersonii (white sucker)",
    url: "https://www.animaldiversity.org/accounts/Catostomus_commersonii/",
  },
  shortheadRedhorse: {
    title: "Wikipedia: Shorthead redhorse",
    url: "https://en.wikipedia.org/wiki/Shorthead_redhorse",
  },
  goldenRedhorse: {
    title: "Wikipedia: Golden redhorse",
    url: "https://en.wikipedia.org/wiki/Golden_redhorse",
  },
  krebs2018: {
    title: "Krebs et al.: Landlocked fall Chinook salmon egg size (Allied Academies)",
    url: "https://www.alliedacademies.org/articles/landlocked-fall-chinook-salmon-egg-size-is-positively-related-to-hatching-time-10971.html",
    year: 2018,
  },
  icesAtlanticEggs: {
    title: "ICES Journal of Marine Science 69:1678: Atlantic salmon egg size (Miramichi)",
    url: "https://academic.oup.com/icesjms/article/69/9/1678/639366",
    year: 2012,
  },
  stoneColdBeads: {
    title: "Stone Cold Beads: Bead fishing basics (roe size by species)",
    url: "https://stonecoldbeads.com/bead-fishing-basics/",
  },
  fishSite: {
    title: "The Fish Site: Cultured aquaculture species, rainbow trout",
    url: "https://thefishsite.com/articles/cultured-aquaculture-species-rainbow-trout",
  },
  mdbBrown: {
    title: "MDB fish fact sheet: Brown trout (egg size)",
    url: "https://www.mdb.fish/fish-fact-sheets/brown-trout",
  },
  biologyInsightsTroutEggs: {
    title: "Biology Insights: What do trout eggs look like (size, color)",
    url: "https://biologyinsights.com/what-do-trout-eggs-look-like-size-color-and-more/",
  },
  hokanson: {
    title: "Hokanson et al.: Thermal requirements for maturation, spawning and embryo survival of brook trout",
    url: "https://cdnsciencepub.com/doi/10.1139/f73-158",
    year: 1973,
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
  mdnrBrown: {
    title: "Michigan DNR: Brown trout",
    url: "https://www.michigan.gov/dnr/education/michigan-species/fish-species/brown-trout",
  },
  mdnrBrook: {
    title: "Michigan DNR: Brook trout",
    url: "https://www.michigan.gov/dnr/education/michigan-species/fish-species/brook-trout",
  },
  mdnrLakeTrout: {
    title: "Michigan DNR: Lake trout",
    url: "https://www.michigan.gov/dnr/education/michigan-species/fish-species/lake-trout",
  },
  mdnr2021Salmon: {
    title: "Michigan DNR release: Chinook and coho salmon runs begin as DNR gears up for egg takes",
    url: "https://www.michigan.gov/dnr/about/newsroom/releases/2021/09/30/chinook-and-coho-salmon-runs-begin-as-dnr-gears-up-for-egg-takes",
    year: 2021,
  },
  mdnr2026Steelhead: {
    title: "Michigan DNR release: Spring steelhead egg collection on Little Manistee River, April 14",
    url: "https://www.michigan.gov/dnr/about/newsroom/releases/2026/04/06/dnr-to-begin-spring-steelhead-egg-collection-on-little-manistee-river-april-14",
    year: 2026,
  },
  outdoorNews2025: {
    title: "Outdoor News: Michigan DNR collected more than 16 million trout and salmon eggs this season",
    url: "https://www.outdoornews.com/2025/12/16/michigan-dnr-fisheries-staff-collected-more-than-16-million-trout-and-salmon-eggs-this-season/",
    year: 2025,
  },
  littleManisteeWeir: {
    title: "Michigan DNR: Little Manistee River Weir",
    url: "https://www.michigan.gov/dnr/managing-resources/fisheries/hatcheries/little-manistee-river-weir",
  },
  cwEggPatterns: {
    title: "Current Works: Egg patterns, matching the hatch for steelhead",
    url: "https://www.current-works.com/fly-fishing-articles/egg-patterns-matching-hatch-steelhead/",
  },
  cwNukeEgg: {
    title: "Current Works: Nuke Egg fly pattern",
    url: "https://www.current-works.com/how-to-tie-fly/nuke-egg-fly-pattern/",
  },
  cwTop5: {
    title: "Current Works: Top 5 steelhead flies for Michigan",
    url: "https://www.current-works.com/fly-fishing-articles/top-5-steelhead-flies/",
  },
  midcurrentEggFlies: {
    title: "MidCurrent: How to tie egg flies for salmon and steelhead",
    url: "https://midcurrent.com/v2/how-to-tie-egg-flies-salmon-steelhead/",
  },
  trueNorthTrout: {
    title: "True North Trout: Egg flies, matching the hatch for steelhead (Ted Kraimer)",
    url: "https://truenorthtrout.com/2009/10/egg-flies-matching-the-hatch-for-steelhead/",
    year: 2009,
  },
  trailsToTrout: {
    title: "Trails to Trout: Salmon fishing tips",
    url: "https://www.trailstotrout.com/resources/salmon-fishing-tips/",
  },
  supinski: {
    title: "Fly Fisherman: Guide strategies for Great Lakes winter steelhead (Matthew Supinski)",
    url: "https://www.flyfisherman.com/editorial/guide-strategies-for-great-lakes-winter-steelhead/370579",
  },
  ottersEgg: {
    title: "Blue Quill Angler: Otter's Soft Milking Egg",
    url: "https://bluequillangler.com/products/otters-soft-milking-egg",
  },
  orvisSpring: {
    title: "Orvis: Top five flies for spring Great Lakes steelhead (Chuck Hawkins)",
    url: "https://news.orvis.com/fly-fishing/pro-tips-top-five-flies-for-spring-great-lakes-steelhead",
  },
  riversNorthSteelhead: {
    title: "Rivers North: Upper Peninsula steelhead",
    url: "https://riversnorth.net/steelhead.html",
  },
  riversNorthAtlantic: {
    title: "Rivers North: St. Marys River Atlantic salmon",
    url: "https://riversnorth.net/atlanticsalmon.html",
  },
  perfectFlyStMarys: {
    title: "Perfect Fly: Fly fishing the St. Marys River, Michigan",
    url: "https://perfectflystore.com/your-streams/fly-fishing-the-st-marys-river-michigan/",
  },
  flylordsSalmon: {
    title: "Flylords: Salmon of the Great Lakes",
    url: "https://flylordsmag.com/salmon-of-the-great-lakes/",
  },
  mnDnrPink: {
    title: "Minnesota DNR: Pink salmon (Lake Superior tributaries)",
    url: "https://www.dnr.state.mn.us/fishing/trout/pink-salmon.html",
  },
  yooperPink: {
    title: "Yooper Webcam: Pink salmon in Michigan",
    url: "https://yooperwebcam.com/fishing-database-mi/pink-salmon/",
  },
  glaStraw: {
    title: "Great Lakes Angler: Finding veins of silver, optimum conditions for steelhead (Matt Straw)",
    url: "https://www.glangler.com/blogs/articles/finding-veins-of-silver-optimum-conditions-for-steelhead-matt-straw",
  },
  indianaDnr: {
    title: "Indiana DNR: Lake Michigan fishing (Skamania and winter-run steelhead)",
    url: "https://www.in.gov/dnr/fish-and-wildlife/fishing/lake-michigan-fishing/",
  },
  caddisShack: {
    title: "Caddis Shack Guide Service: Steelhead fly fishing in the Upper Peninsula",
    url: "https://www.caddisshackguideservice.com/blog/steelhead-fly-fishing-in-the-upper-peninsula",
  },
  barothy: {
    title: "Barothy Lodge: Fishing the Pere Marquette",
    url: "https://barothylodge.com/fishing/",
  },
  feenstraGamefish: {
    title: "Feenstra Outdoors: Gamefish of the Muskegon",
    url: "https://feenstraoutdoors.com/wordpress/gamefish-2/",
  },
} as const;

const raw: z.input<typeof EggSourceList> = [
  /* ------------------------------------------------------------------ */
  /* Fall: Pacific salmon                                                */
  /* ------------------------------------------------------------------ */
  {
    id: "chinook-eggs",
    name: "Chinook salmon eggs",
    speciesId: "chinook",
    months: [8, 9, 10, 11, 12, 1, 2],
    peakMonths: [9, 10],
    waterTempF: [43, 59],
    eggDiameterMm: [6.36, 8.36],
    freshColors: ["Steelhead Orange", "Sockeye", "Salmon Egg", "Flame"],
    deadColors: ["Oregon Cheese", "Apricot Supreme", "Pink Lady", "Cream/Dead Egg"],
    hookSizes: [6, 8, 10],
    eatenBy: ["steelhead", "brown-trout", "rainbow-trout", "chinook", "coho"],
    regions: [],
    evidence: "S",
    notes:
      "The largest egg in the river and the most important fall food event. Kings are in catchable numbers by mid-August and ripe from late September through the first week of October (Little Manistee egg take September 29 to October 8, 2025; DNR Pacific salmon egg takes mid-September to late October). Entry is triggered by rivers and the nearshore lake cooling into the 60s F plus rain; the 43 to 59 F spawning range is from a non-primary aggregator. Fresh eggs are orange to red-orange, so fish realistic Steelhead Orange, Sockeye and Salmon Egg cores in September and October, then switch to veiled Nuke Eggs in Oregon Cheese and Apricot Supreme over Steelhead Orange as eggs age and wash out through November into February. Steelhead key on king eggs big time, holding in the pockets below active gravel; lake-run browns and resident trout do the same. Salmon themselves take eggs behind spawners, in smaller sizes 6 to 8. Mean diameter 7.22 mm is from a landlocked population.",
    sources: [SRC.mdnr2021Salmon, SRC.outdoorNews2025, SRC.littleManisteeWeir, SRC.mdnrChinook, SRC.krebs2018, SRC.usgsEggColor, SRC.bettsPM, SRC.cwEggPatterns, SRC.cwNukeEgg, SRC.trailsToTrout],
  },
  {
    id: "coho-eggs",
    name: "Coho salmon eggs",
    speciesId: "coho",
    months: [9, 10, 11, 12, 1, 2],
    peakMonths: [10, 11],
    eggDiameterMm: [6, 8],
    freshColors: ["Steelhead Orange", "Sockeye", "Salmon Egg", "Egg"],
    deadColors: ["Oregon Cheese", "Apricot Supreme", "Pink Lady", "Cream/Dead Egg"],
    hookSizes: [6, 8, 10, 12],
    eatenBy: ["steelhead", "brown-trout", "rainbow-trout", "coho"],
    regions: [],
    evidence: "S",
    notes:
      "Coho spawn from early September to November depending on the tributary, later than Chinook; the Platte weir egg take falls in the third week of October (October 16 to 28 in 2025) and the Manistee has a notable late-October fishery, with St. Joseph fish into December. Coho eggs extend the fresh-egg window past the Chinook peak and are the main source drifting in November before brown trout eggs take over. No spawning temperature was found in an agency source, and the 6 to 8 mm size is a bead-vendor figure rather than a Great Lakes measurement, so treat size as angler-grade.",
    sources: [SRC.mdnrCoho, SRC.mdnr2021Salmon, SRC.outdoorNews2025, SRC.stoneColdBeads, SRC.cwEggPatterns, SRC.usgsEggColor],
  },
  {
    id: "pink-salmon-eggs",
    name: "Pink salmon eggs",
    speciesId: "pink-salmon",
    months: [8, 9, 10],
    peakMonths: [9],
    eggDiameterMm: [6, 8],
    freshColors: ["Pink Lady", "Shrimp Pink", "Salmon Egg", "Steelhead Orange"],
    deadColors: ["Cream/Dead Egg", "Light Pink"],
    hookSizes: [10, 12, 14],
    eatenBy: ["steelhead", "rainbow-trout", "brown-trout", "brook-trout", "pink-salmon"],
    regions: ["upper-peninsula"],
    evidence: "S",
    notes:
      "The first eggs of the fall. Pinks spawn in late August and September, peaking in the latter part of September, in the St. Marys rapids, the Carp River (Mackinac County), the Chocolay and other Lake Superior and northern Lake Huron tributaries; fish hold in the St. Marys rapids until mid-October. Odd-year runs are largest, but even-year runs occur too. Upper Peninsula steelhead entering in October feed heavily on salmon eggs. Pinks themselves take small pink and chartreuse eggs and beadheads with flash. The 6 to 8 mm size is a bead-vendor figure and the fresh color names are inferred from the pink-and-orange fly palette used for them; no spawning temperature was found.",
    sources: [SRC.mdnrPink, SRC.yooperPink, SRC.perfectFlyStMarys, SRC.riversNorthSteelhead, SRC.stoneColdBeads, SRC.mnDnrPink],
  },

  /* ------------------------------------------------------------------ */
  /* Fall: trout and Atlantic salmon                                     */
  /* ------------------------------------------------------------------ */
  {
    id: "brown-trout-eggs",
    name: "Brown trout eggs (resident and lake-run)",
    speciesId: "brown-trout",
    months: [9, 10, 11, 12],
    peakMonths: [10, 11],
    waterTempF: [43, 48],
    eggDiameterMm: [4, 5],
    freshColors: ["Steelhead Orange", "Egg", "Oregon Cheese"],
    deadColors: ["Apricot Supreme", "Cream/Dead Egg", "Light Pink"],
    hookSizes: [10, 12, 14],
    eatenBy: ["steelhead", "brown-trout", "rainbow-trout", "brook-trout"],
    regions: [],
    evidence: "S",
    notes:
      "DNR: brown trout spawn in tributary streams in September and October, with secondary sources extending it into November and December. Lake-run browns follow steelhead and salmon up the Pere Marquette in late October and November. Brown eggs are bright orange when fresh and about 4 to 5 mm, roughly two-thirds the size of a king egg, so they bridge the November-to-February window between fresh salmon eggs and spring steelhead eggs at sizes 10 to 12. The 6 to 9 C (43 to 48 F) spawning temperature is from non-Michigan studies.",
    sources: [SRC.mdnrBrown, SRC.mdbBrown, SRC.midcurrentEggFlies, SRC.barothy, SRC.cwEggPatterns],
  },
  {
    id: "brook-trout-eggs",
    name: "Brook trout eggs",
    speciesId: "brook-trout",
    months: [10, 11, 12],
    peakMonths: [10, 11],
    eggDiameterMm: [4.1, 4.6],
    freshColors: ["Oregon Cheese", "Apricot", "Peach"],
    deadColors: ["Cream/Dead Egg"],
    hookSizes: [12, 14, 16],
    eatenBy: ["brook-trout", "brown-trout", "rainbow-trout"],
    regions: ["northern-lp", "tip-of-mitt", "upper-peninsula"],
    evidence: "S",
    notes:
      "DNR: spawning generally occurs in October and November on gravel in spring-fed streams and groundwater seepages. Lab work puts ovulation at 16 C (61 F) and below, but no field spawning temperature was found so none is given. This is a small-stream food source for resident trout on headwater and Upper Peninsula brook trout water, not a steelhead-river event; its importance to fly selection is inferred. The 4.1 to 4.6 mm size is from a secondary source and the color names are inferred from the general trout-egg palette.",
    sources: [SRC.mdnrBrook, SRC.hokanson, SRC.biologyInsightsTroutEggs, SRC.usgsEggColor],
  },
  {
    id: "lake-trout-eggs",
    name: "Lake trout eggs",
    months: [10, 11],
    peakMonths: [10, 11],
    waterTempF: [40, 55],
    freshColors: ["Oregon Cheese", "Pale Yellow", "Apricot"],
    deadColors: ["Cream/Dead Egg"],
    hookSizes: [10, 12],
    eatenBy: ["steelhead", "brown-trout"],
    regions: [],
    evidence: "I",
    notes:
      "DNR: lake trout spawn in the fall, usually on shoals and reefs, but some migrate upstream and create short-term fisheries in drowned river mouths and lower rivers where they are caught incidentally by steelhead anglers; the Boardman weir passes lake trout upstream and the St. Marys rapids were historic spawning grounds. Lake trout prefer 40 to 55 F. Because most spawning is on lake shoals, this is a minor river food source, relevant mainly in drowned river mouths (Manistee Lake, Pere Marquette Lake, Betsie, Boardman, St. Marys) in October and November. No documented lake trout egg diameter was found beyond vendor ranges, so none is given, and the color names are inferred.",
    sources: [SRC.mdnrLakeTrout, SRC.usgsEggColor],
  },
  {
    id: "atlantic-salmon-eggs",
    name: "Atlantic salmon eggs",
    speciesId: "atlantic-salmon",
    months: [10, 11, 12],
    peakMonths: [10, 11],
    eggDiameterMm: [5.6, 5.6],
    freshColors: ["Oregon Cheese", "Apricot", "Steelhead Orange"],
    deadColors: ["Cream/Dead Egg", "Apricot Supreme"],
    hookSizes: [8, 10, 12],
    eatenBy: ["rainbow-trout", "steelhead"],
    regions: ["upper-peninsula"],
    evidence: "I",
    notes:
      "DNR: the St. Marys Atlantic run continues until November when spawning commences; guides put spawning in the rapids in late October, with LSSU collecting eggs and milt there. Experimental fall returns also spawn (October to December) in the lower Au Sable and Thunder Bay River in small numbers. The spawn timing is agency-sourced, but the consumer list (rapids rainbows and fall steelhead, plus whitefish which are outside this dataset) is inferred, so the record is marked I. The 5.6 mm figure is a mean from Miramichi one-sea-winter fish with no range reported, and the color names are inferred.",
    sources: [SRC.mdnrAtlantic, SRC.riversNorthAtlantic, SRC.perfectFlyStMarys, SRC.icesAtlanticEggs],
  },

  /* ------------------------------------------------------------------ */
  /* Spring: steelhead, walleye, suckers                                 */
  /* ------------------------------------------------------------------ */
  {
    id: "steelhead-eggs",
    name: "Steelhead eggs",
    speciesId: "steelhead",
    months: [2, 3, 4, 5],
    peakMonths: [3, 4],
    waterTempF: [40, 43],
    eggDiameterMm: [4, 5],
    freshColors: ["Apricot", "Peach", "Pale Yellow", "Oregon Cheese", "Light Pink"],
    deadColors: ["Cream/Dead Egg", "Light Pink"],
    hookSizes: [10, 12, 14],
    eatenBy: ["steelhead", "rainbow-trout", "brown-trout"],
    regions: [],
    evidence: "S",
    notes:
      "DNR: fall-run steelhead spawn first, often in March, followed by spring-run fish in April; the Little Manistee weir is boarded in mid-March and eggs are taken in mid-April (April 14 to 22, 2026). Upper Peninsula fish spawn into early and mid May, and Skamania spawn February to mid-March on the St. Joseph, which is why February is included. Active spawning begins near 42 F (angler press; no agency temperature found). Eggs are translucent yellow to yellow-orange and about 4 to 5 mm (vendor figure), so spring boxes run to apricot, peach, light pink and pale yellow Nuke Eggs and Glo Bugs in sizes 10 to 14, with a dime-sized Clown egg pre-runoff, quarter-sized chartreuse, orange or bright yellow in runoff, and muted naturals post-runoff. Drop-back steelhead, resident browns and rainbows feed behind active redds; walleye and suckers eat them too.",
    sources: [SRC.mdnrSteelhead, SRC.mdnr2026Steelhead, SRC.littleManisteeWeir, SRC.glaStraw, SRC.indianaDnr, SRC.midcurrentEggFlies, SRC.orvisSpring, SRC.cwEggPatterns, SRC.fishSite],
  },
  {
    id: "walleye-eggs",
    name: "Walleye eggs",
    months: [3, 4],
    peakMonths: [4],
    waterTempF: [38, 48],
    eggDiameterMm: [2.0, 2.1],
    freshColors: ["Pale Yellow", "Cream", "Light Gold"],
    deadColors: ["Cream/Dead Egg", "White"],
    hookSizes: [12, 14, 16],
    eatenBy: ["steelhead", "brown-trout", "rainbow-trout"],
    regions: [],
    evidence: "S",
    notes:
      "Walleye spawn during a three-week rise in water temperature from 3.5 to 9 C (38 to 48 F), peaking the week of April 12 to 19 in the Detroit River as water rose from 6.5 to 9 C. Their eggs are the smallest in the calendar at 2.0 to 2.1 mm and are imitated by the same pale-yellow Sucker Spawn and small Glo Bugs used for sucker eggs; guides note walleye, resident rainbows, suckers and carp all use the rivers during the March-to-April steelhead spawn, creating abundant small pale eggs. Walleye eggs precede sucker eggs by about three weeks and overlap the steelhead spawn.",
    sources: [SRC.manny2010, SRC.trueNorthTrout, SRC.bettsMuskegon, SRC.cwEggPatterns],
  },
  {
    id: "sucker-eggs",
    name: "White and longnose sucker eggs",
    months: [3, 4, 5, 6],
    peakMonths: [5],
    waterTempF: [43, 50],
    eggDiameterMm: [3.0, 3.1],
    freshColors: ["Pale Yellow", "Cream", "Light Gold", "Peach"],
    deadColors: ["Cream/Dead Egg", "White"],
    hookSizes: [12, 14, 16],
    eatenBy: ["steelhead", "brown-trout", "rainbow-trout"],
    regions: [],
    evidence: "S",
    notes:
      "Sucker spawn is a spring pattern because suckers spawn on rising water near 43 to 50 F: Michigan Sea Grant reports white and longnose suckers responding to a 43.3 F cue to start their runs, the Detroit River study found white sucker spawning during a four-week rise from 6 to 10 C between April 26 and May 17 with a peak on May 10 (three weeks after peak walleye), and the DNR notes runs may begin in mid-March in southern Michigan or as late as early May in the north. The Upper Peninsula window runs into June. Eggs are 3.0 to 3.1 mm (general range 2 to 3 mm), sticky, laid in clusters on the same gravel trout use, and pale yellow to light gold, hence the pale-yellow Sucker Spawn, Crystal Meth, Y2K, cream or yellow Glo Bug, Otter's size 14 and Eggstacy size 16 'sweetcorn' box in sizes 12 to 16. Sucker eggs overlap the tail of the steelhead spawn, so drop-back steelhead and resident browns and rainbows feed behind sucker redds; pair the egg with a nymph or fry pattern.",
    sources: [SRC.manny2010, SRC.seaGrantSuckers, SRC.msuSuckersMirror, SRC.mdnrSuckers, SRC.adwWhiteSucker, SRC.hatchMagSuckerSpawn, SRC.bettsMuskegon, SRC.cwEggPatterns, SRC.supinski, SRC.ottersEgg],
  },
  {
    id: "redhorse-eggs",
    name: "Redhorse sucker eggs",
    months: [5, 6],
    peakMonths: [5, 6],
    waterTempF: [45, 61],
    freshColors: ["Pale Yellow", "Light Gold", "Cream"],
    deadColors: ["Cream/Dead Egg", "White"],
    hookSizes: [12, 14],
    eatenBy: ["steelhead", "brown-trout", "rainbow-trout"],
    regions: [],
    evidence: "A",
    notes:
      "Redhorse extend the sucker-egg window into late May and June: Muskegon guides report over 100,000 redhorse ascending the river in May and June with big trout and drop-back steelhead feeding behind the redds on eggs, nymphs and steelhead fry, and Michigan Sea Grant notes different redhorse species arrive at different times in West Michigan creeks with some still present in late May. Shorthead redhorse spawn at 7 to 16 C (45 to 61 F) and golden redhorse at 17 to 22 C, often at night (general biology, not Michigan-specific). No redhorse egg diameter was found; treat them as sucker-sized (2 to 3 mm) and fish the same pale-yellow Sucker Spawn and Y2K patterns. River redhorse is protected in Michigan.",
    sources: [SRC.bettsSuckerSpawn, SRC.seaGrantSuckers, SRC.shortheadRedhorse, SRC.goldenRedhorse, SRC.hatchMagSuckerSpawn],
  },
];

export const eggSources: EggSource[] = EggSourceList.parse(raw);
export const eggSourceById = new Map(eggSources.map((e) => [e.id, e]));
