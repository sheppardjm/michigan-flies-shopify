import { z } from "zod";
import { ForageList, type Forage } from "./schema";

/**
 * Non-insect, non-egg forage in Michigan rivers (plus terrestrial insects,
 * which are not hatches and so live here rather than in the hatch table).
 *
 * `months` = when the forage is most relevant to the fly angler, not when the
 * organism exists. Sculpins are present all year; coho smolts matter in May;
 * terrestrials run mid-May to October and peak July to August; mice are a
 * July-to-September night game.
 *
 * Evidence: S = Michigan DNR stomach studies (RR1855 North Branch Au Sable,
 * RR1759 Anna River) or DNR species pages; A = guide observation (Feenstra,
 * Betts, Current Works, Hawkins, Mangled Fly, Rivers North, Caddis Shack);
 * I = reasonable extension made while building this dataset.
 */

const ALL_YEAR = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12];

const SRC = {
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
  fr017: {
    title: "MDNR Fisheries Report 17: Review of Atlantic salmon attributes (Torch Lake prey base)",
    url: "https://www.michigandnr.com/publications/pdfs/DNRFishLibrary/FisheriesReports/FR017.pdf",
  },
  seaGrantDiet: {
    title: "Michigan Sea Grant: Fish diet study reaches another milestone",
    url: "https://www.canr.msu.edu/news/fish-diet-study-reaches-another-milestone-msg19-okeefe19",
    year: 2019,
  },
  glfcErieDiet: {
    title: "GLFC: Lake Erie steelhead diet project final report (2004)",
    url: "https://www.glfc.org/pubs/lake_committees/erie/CWTG_docs/other_reports_and_docs/fin_rep_2004_steelhead_diet_project.pdf",
    year: 2004,
  },
  gvsuSculpin: {
    title: "GVSU thesis: Mottled sculpin and brown trout movement in Stegman Creek (CORE record)",
    url: "https://core.ac.uk/outputs/130170630/",
  },
  tafsBrookTerrestrials: {
    title: "Sweka & Hartman: Terrestrial invertebrates in brook trout diet, West Virginia (TAFS 137:224)",
    url: "https://academic.oup.com/tafs/article/137/1/224/7888240",
    year: 2008,
  },
  feenstraAnchored: {
    title: "Anchored Outdoors: Understanding baitfish seasons with Kevin Feenstra",
    url: "https://anchoredoutdoors.com/guaranteed-to-catch-more-fish-understanding-baitfish-seasons-with-kevin-feenstra/",
  },
  feenstraGamefish: {
    title: "Feenstra Outdoors: Gamefish of the Muskegon",
    url: "https://feenstraoutdoors.com/wordpress/gamefish-2/",
  },
  feenstraGallery: {
    title: "Feenstra Guide Service: Fly gallery",
    url: "https://www.feenstraguideservice.com/flygallery.html",
  },
  tridentAquaNuisance: {
    title: "Trident Fly Fishing: Feenstra's Aqua Nuisance",
    url: "https://www.tridentflyfishing.com/products/feenstras-aqua-nuisance-fly",
  },
  bettsSpring: {
    title: "Betts Guide Service: Muskegon River spring steelhead report",
    url: "https://bettsguideservice.com/muskegon-river-fishing-report-spring-steelhead/",
  },
  bettsSuckerSpawn: {
    title: "Betts Guide Service: Michigan trout guides, sucker spawn",
    url: "https://bettsguideservice.com/michigan-trout-guides-sucker-spawn/",
  },
  bettsAtlantic: {
    title: "Betts Guide Service: Michigan Atlantic salmon",
    url: "https://bettsguideservice.com/michigan-atlantic-salmon.html",
  },
  orvisSpring: {
    title: "Orvis: Top five flies for spring Great Lakes steelhead (Chuck Hawkins)",
    url: "https://news.orvis.com/fly-fishing/pro-tips-top-five-flies-for-spring-great-lakes-steelhead",
  },
  orvisTop10: {
    title: "Orvis: Chuck Hawkins's top 10 Michigan flies",
    url: "https://news.orvis.com/fly-fishing/tuesday-tip-chuck-hawkinss-top-10-michigan-flies",
  },
  orvisDD: {
    title: "Orvis: Tommy Lynch's Drunk & Disorderly streamer",
    url: "https://news.orvis.com/fly-fishing/big-and-meaty-tommy-lynchs-drunk-disorderly-streamer",
  },
  wetFlySwingGalloup: {
    title: "Wet Fly Swing: Kelly Galloup on the best streamer strategies for giant trout",
    url: "https://www.wetflyswing.com/kelly-galloup-on-the-best-streamer-strategies-for-giant-trout/",
  },
  riverKeeperZoo: {
    title: "RiverKeeper Flies: Galloup's Zoo Cougar",
    url: "https://www.johnkreft.com/galloups-zoo-cougar/",
  },
  fliesGuidesDungeon: {
    title: "Flies and Guides: Galloup's Sex Dungeon (olive)",
    url: "https://flysandguides.com/product/galloups-sex-dungeon-olive/",
  },
  murraysDungeon: {
    title: "Murray's Fly Shop: Galloup's Dungeon (Crawdad Orange)",
    url: "https://www.murraysflyshop.com/products/galloups-dungeon-fly",
  },
  streamsideCircusPeanut: {
    title: "Streamside: Maddin's Circus Peanut, Root Beer",
    url: "https://michigan-streamside.com/product/maddins-circus-peanut-root-beer/",
  },
  outfishAuSable: {
    title: "Outfish: Au Sable River fishing guide",
    url: "https://www.outfish.in/au_sable/fishing-guide",
  },
  miSportsmanSteelheadFacts: {
    title: "Michigan Sportsman forum: Steelhead facts (stomach contents, anecdotal)",
    url: "https://www.michigan-sportsman.com/threads/steelhead-facts.80757/",
  },
  cwTerrestrials: {
    title: "Current Works: Terrestrial fishing, grasshoppers and more",
    url: "https://www.current-works.com/fly-fishing-articles/terrestrial-fishing-grasshopper/",
  },
  cwSeasons: {
    title: "Current Works: Trout fishing seasons, Traverse City and northern Michigan",
    url: "https://www.current-works.com/fly-fishing-seasons/trout-traverse-city-northern-michigan/",
  },
  cwAfterHex: {
    title: "Current Works: Fishing after the Hex hatch",
    url: "https://www.current-works.com/fly-fishing-articles/fishing-after-the-hex-hatch/",
  },
  cwTop5: {
    title: "Current Works: Top 5 steelhead flies for Michigan",
    url: "https://www.current-works.com/fly-fishing-articles/top-5-steelhead-flies/",
  },
  cwSalmon: {
    title: "Current Works: Salmon fishing, Betsie and Manistee",
    url: "https://www.current-works.com/fly-fishing-seasons/salmon-betsie-manistee-northern-michigan/",
  },
  riverReportsAuSable: {
    title: "RiverReports: Au Sable River fly fishing",
    url: "https://www.riverreports.com/river-intel/rivers/au-sable-river-michigan-fly-fishing",
  },
  hawkinsNight: {
    title: "Hawkins Outfitters: Night fishing for trout",
    url: "https://hawkinsoutfitters.com/species/trout/night_fishing_for_trout/",
  },
  mangledNight: {
    title: "Mangled Fly: Night fishing and mousing",
    url: "https://mangledfly.com/night-fishing/",
  },
  mangledBrown: {
    title: "Mangled Fly: Brown trout posts (spring lamprey streamers, fall sizing)",
    url: "https://mangledfly.com/category/brown-trout/",
  },
  sippingMayflies: {
    title: "Sipping Mayflies: Mousing for brown trout",
    url: "https://sippingmayflies.com/mousing-for-brown-trout/",
  },
  mntuMousing: {
    title: "Minnesota Trout Unlimited: Mousing at night for fall browns",
    url: "https://mntu.org/2026/08/mousing-at-night-for-fall-browns/",
    year: 2026,
  },
  tridentMouse: {
    title: "Trident Fly Fishing: Mouse flies (Morrish Mouse sizes)",
    url: "https://www.tridentflyfishing.com/fly-fishing-flies/mouse-flies.html",
  },
  michiganTU: {
    title: "Michigan Trout Unlimited, Fall 2021: Streamer fishing, how to decide what flies to fish",
    url: "https://issuu.com/www.michigantu.org/docs/michigan_trout_fall_2021-web/s/14447231",
    year: 2021,
  },
  caddisShack: {
    title: "Caddis Shack Guide Service: Steelhead fly fishing in the Upper Peninsula",
    url: "https://www.caddisshackguideservice.com/blog/steelhead-fly-fishing-in-the-upper-peninsula",
  },
  midcurrentWinter: {
    title: "MidCurrent: What do winter steelhead eat? A guide to fly selection",
    url: "https://midcurrent.com/v2/what-do-winter-steelhead-eat-a-guide-to-fly-selection/",
  },
  midcurrentESL: {
    title: "MidCurrent: Egg-Sucking Leech for steelhead, colors, sizes and how to fish it",
    url: "https://midcurrent.com/v2/egg-sucking-leech-for-steelhead-colors-sizes-and-how-to-fish-it-in-spring/",
  },
  nomadHalloween: {
    title: "Nomad Anglers: Tying Kevin Feenstra's Halloween Leech",
    url: "https://nomadanglers.com/blogs/fly-tying-patterns/tying-kevin-feenstras-halloween-leech",
  },
  supinski: {
    title: "Fly Fisherman: Guide strategies for Great Lakes winter steelhead (Matthew Supinski)",
    url: "https://www.flyfisherman.com/editorial/guide-strategies-for-great-lakes-winter-steelhead/370579",
  },
  mnDnrPink: {
    title: "Minnesota DNR: Pink salmon (Lake Superior tributaries)",
    url: "https://www.dnr.state.mn.us/fishing/trout/pink-salmon.html",
  },
  riversNorthAtlantic: {
    title: "Rivers North: St. Marys River Atlantic salmon",
    url: "https://riversnorth.net/atlanticsalmon.html",
  },
  fishSens: {
    title: "FishSens: St. Marys River Atlantic salmon among the hardest fighting fish in the Great Lakes",
    url: "https://www.fishsens.com/st-marys-rivers-atlantic-salmon-among-the-hardest-fighting-fish-in-the-great-lakes/",
  },
  flylordsSalmon: {
    title: "Flylords: Salmon of the Great Lakes",
    url: "https://flylordsmag.com/salmon-of-the-great-lakes/",
  },
  meatEater: {
    title: "MeatEater: How to pick the best streamer for big fall trout",
    url: "https://www.themeateater.com/fish/freshwater/how-to-pick-the-best-streamer-for-big-fall-trout",
  },
} as const;

const raw: z.input<typeof ForageList> = [
  /* ------------------------------------------------------------------ */
  /* Baitfish                                                            */
  /* ------------------------------------------------------------------ */
  {
    id: "sculpin",
    name: "Sculpin (slimy and mottled)",
    kind: "baitfish",
    months: ALL_YEAR,
    eatenBy: ["brown-trout", "steelhead", "rainbow-trout", "brook-trout"],
    description:
      "The always-available baitfish of Michigan trout rivers. In the Anna River slimy sculpins were about 90 percent of available prey and the fish most often eaten by large brown trout from June to October, although browns selected salmonids over sculpins when both were present; mottled sculpin co-occur with brown trout in west Michigan streams. Sculpins have no swim bladder, so they dart a short distance and sink back to the bottom, which is why Feenstra names them the winter forage for steelhead and lake-run browns in olive and tan. Imitated by the Muddler, Zoo Cougar in olive, tan, yellow, white and black (sizes 2 to 6), Woolly Sculpin, Sex Dungeon natural or olive, Feenstra's Aqua Nuisance and Psycho Sculpin, and the Shrew for drop-back steelhead. Brook trout use is a reasonable extension of the DNR note that they eat fish.",
    evidence: "S",
    sources: [SRC.rr1759, SRC.gvsuSculpin, SRC.feenstraAnchored, SRC.feenstraGamefish, SRC.riverKeeperZoo, SRC.tridentAquaNuisance, SRC.orvisSpring],
  },
  {
    id: "darter",
    name: "Darter",
    kind: "baitfish",
    months: [11, 12, 1, 2, 3, 4],
    eatenBy: ["steelhead", "brown-trout", "rainbow-trout"],
    description:
      "Small, thin, quick bottom fish that Feenstra lists with sculpins and gobies as the winter forage of Muskegon steelhead, when migratory fish settle into slower water and feed on bottom-hugging prey in earth tones. Darters fall within the coarse fish that large Au Sable browns eat year-round, and Michigan TU lists them among the baitfish to imitate by reach. Fish slim olive-and-tan sculpin-style patterns slowly near the bottom from November through the spring drop-back period.",
    evidence: "A",
    sources: [SRC.feenstraAnchored, SRC.rr1855, SRC.michiganTU],
  },
  {
    id: "dace",
    name: "Dace and other coarse minnows",
    kind: "baitfish",
    months: ALL_YEAR,
    eatenBy: ["brown-trout", "brook-trout", "rainbow-trout", "steelhead"],
    description:
      "The generic small minnow of Michigan trout water. Alexander's Au Sable study credits large browns with beneficial predation on coarse fish populations, and guides list dace and chubs among the things migratory and resident fish eat. Cyprinids were rare in the small Upper Peninsula Anna River, so dace matter more on larger, warmer or sandier reaches. Any sparse natural minnow streamer, a small Woolly Bugger or a downsized Zoo Cougar covers them; use them as the default when no specific baitfish is evident.",
    evidence: "A",
    sources: [SRC.rr1855, SRC.rr1759, SRC.feenstraAnchored, SRC.mdnrBrook],
  },
  {
    id: "chub",
    name: "Chub (creek chub and hornyhead)",
    kind: "baitfish",
    months: ALL_YEAR,
    eatenBy: ["brown-trout", "steelhead", "rainbow-trout"],
    description:
      "Chub minnows are the larger coarse fish of Michigan trout rivers. Galloup's natural Sex Dungeon is described as mimicking everything from sculpins to juvenile trout and chub minnows, Feenstra's Shrew is tied to match gobies, sculpins and chubs for post-runoff drop-back steelhead, and Alexander's Au Sable work documents large browns eating coarse fish. Fish a 3-to-5-inch natural or tan streamer with a broad head profile.",
    evidence: "A",
    sources: [SRC.fliesGuidesDungeon, SRC.orvisSpring, SRC.rr1855],
  },
  {
    id: "emerald-shiner",
    name: "Emerald shiner",
    kind: "baitfish",
    months: [9, 10, 11],
    eatenBy: ["steelhead", "brown-trout", "rainbow-trout"],
    description:
      "Feenstra's first baitfish of fall: when steelhead and lake-run browns leave the alewife-rich lake and enter West Michigan rivers they switch to river shiners, small silvery fish that school in three to six feet of water, so flashy patterns like the Emulator, Reflector and Grease Stain excel from September through November. Emerald shiners were in 82 to 91 percent of Lake Erie steelhead stomachs in a 2004 lake study (regional, not Michigan river data). Also imitated by white Zonkers, the White Death, Flashtail Clousers and the Double Deceiver in clear water.",
    evidence: "A",
    sources: [SRC.feenstraAnchored, SRC.feenstraGallery, SRC.glfcErieDiet, SRC.caddisShack, SRC.cwSalmon, SRC.meatEater],
  },
  {
    id: "spottail-shiner",
    name: "Spottail shiner",
    kind: "baitfish",
    months: [9, 10, 11],
    eatenBy: ["steelhead", "brown-trout", "rainbow-trout"],
    description:
      "The second common river shiner in the Great Lakes drainage, grouped with emerald shiners in guide accounts of the fall baitfish switch that migratory fish make on entering the river. A silver-bodied, flash-heavy streamer fished on a swing covers both shiners; Feenstra's flash-bodied patterns and a chartreuse-and-white or all-white Clouser are the standard imitations. Timing follows the fall steelhead and lake-run brown entry.",
    evidence: "A",
    sources: [SRC.feenstraAnchored, SRC.feenstraGallery, SRC.cwSalmon],
  },
  {
    id: "alewife",
    name: "Alewife",
    kind: "baitfish",
    months: [8, 9, 10, 11],
    eatenBy: ["steelhead", "chinook", "coho", "atlantic-salmon", "brown-trout"],
    description:
      "The dominant lake prey: Lake Michigan steelhead diets were more than 90 percent alewife in 2017 to 2019, Chinook diets about 99 percent, and coho and Atlantics feed on alewife and smelt in the lake. Alewife are a lake fish rather than a river resident, so their relevance to the river angler is at the mouths and lower reaches where fresh-run salmon and steelhead have just left the alewife schools; Feenstra describes migratory fish switching from lake alewife to river shiners once inside. A 4-to-6-inch white or silver baitfish streamer stripped on a sink tip for fresh chrome fish near the mouth is the application. The month window is an inference from the fall run calendar.",
    evidence: "I",
    sources: [SRC.seaGrantDiet, SRC.mdnrSteelhead, SRC.mdnrChinook, SRC.mdnrCoho, SRC.feenstraAnchored, SRC.cwSalmon],
  },
  {
    id: "smelt",
    name: "Rainbow smelt",
    kind: "baitfish",
    months: [4, 5, 6, 7],
    eatenBy: ["atlantic-salmon", "brown-trout", "steelhead"],
    description:
      "Smelt are a lake staple for steelhead, Chinook, coho and Atlantic salmon, and they are the first thing St. Marys Atlantics encounter when they arrive in late June, when stripping large baitfish patterns on sink tips produces exciting strikes until the baitfish schools leave and the mid-July Hex hatch turns the fish to insects. Michigan TU also recommends casting an alevin or smelt pattern in spring on rivers that had a fall salmon run, and Torch Lake Atlantics grow on a smelt and cisco prey base. Imitate with 3-to-5-inch white and silver Clousers or Deceivers; no Michigan-specific smelt pattern was sourced.",
    evidence: "A",
    sources: [SRC.riversNorthAtlantic, SRC.fishSens, SRC.bettsAtlantic, SRC.michiganTU, SRC.fr017, SRC.mdnrSteelhead],
  },
  {
    id: "round-goby",
    name: "Round goby",
    kind: "baitfish",
    months: [11, 12, 1, 2, 3, 4],
    eatenBy: ["steelhead", "brown-trout", "rainbow-trout"],
    description:
      "An invasive bottom fish that has become winter and early-spring forage on the larger Lake Michigan tributaries. Feenstra groups gobies with sculpins and darters as the winter baitfish of Muskegon steelhead, noting gobies sit more visibly on rocks than sculpins, and Hawkins fishes Feenstra's Shrew post-runoff for drop-back steelhead specifically to match gobies, sculpins and chubs. Round gobies were an important East Basin prey for Lake Erie steelhead in the 2004 lake study. Fish olive, tan or brown sculpin-style patterns dead slow on the bottom.",
    evidence: "A",
    sources: [SRC.feenstraAnchored, SRC.orvisSpring, SRC.glfcErieDiet, SRC.michiganTU],
  },
  {
    id: "salmon-fry",
    name: "Salmon and steelhead fry and alevin",
    kind: "baitfish",
    months: [3, 4, 5, 6],
    eatenBy: ["steelhead", "brown-trout", "rainbow-trout", "atlantic-salmon"],
    description:
      "Chinook fry hatch in spring and quickly become a significant part of the food chain: Muskegon guides report both larger trout and steelhead feeding heavily on Chinook fry along the shoreline from late March through April, and by May and June salmon parr, steelhead fry and sucker fry make up the bulk of the resident trout diet. Pink fry leave the gravel in late April and early May in Upper Peninsula rivers (DNR). Ed's Salmon Alevin is a top-five spring steelhead fly that is also taken as a caddis larva, Parr None works on any river with a salmon migration, and Michigan TU recommends alevin patterns in spring on rivers that had a fall run. Atlantics eat juvenile salmon and steelhead on arrival in the St. Marys.",
    evidence: "A",
    sources: [SRC.bettsSpring, SRC.bettsSuckerSpawn, SRC.feenstraAnchored, SRC.orvisSpring, SRC.orvisTop10, SRC.michiganTU, SRC.mdnrPink, SRC.fishSens],
  },
  {
    id: "sucker-fry",
    name: "Sucker fry",
    kind: "baitfish",
    months: [5, 6, 7],
    eatenBy: ["steelhead", "brown-trout", "rainbow-trout"],
    description:
      "Suckers spawn in late April and May, and their fry follow the salmon fry into the trout diet by late May and June. Feenstra notes sucker fry carry a purplish hue, so lavender and pink tones work in fry patterns, and Betts reports salmon parr, steelhead fry and sucker fry as the bulk of the Muskegon trout diet during and after the sucker spawn. Fish a small (1-to-2-inch) sparse fry pattern behind sucker redds, often as a dropper below a pale-yellow sucker spawn egg.",
    evidence: "A",
    sources: [SRC.feenstraAnchored, SRC.bettsSuckerSpawn],
  },
  {
    id: "salmonid-parr",
    name: "Juvenile trout and salmon parr",
    kind: "baitfish",
    months: ALL_YEAR,
    eatenBy: ["brown-trout", "steelhead", "atlantic-salmon", "rainbow-trout"],
    description:
      "Small trout and salmon parr are the top prey of big Michigan browns. On the North Branch Au Sable small brook trout were 30 to 37 percent of the diet of large browns in general-regulation water and 42 to 61 percent in the flies-only water, in both summer and winter, and in the Anna River browns selected salmonids over sculpins even though sculpins were nine times more abundant. Galloup's streamer epiphany came from watching a brown with a five- or six-inch rainbow halfway down its throat. Parr-marked patterns (Parr None) and 4-to-7-inch articulated streamers such as the Drunk & Disorderly, Circus Peanut and Sex Dungeon imitate them; Atlantics eat juvenile salmon and steelhead in the St. Marys in late June. Resident rainbow use is an extension.",
    evidence: "S",
    sources: [SRC.rr1855, SRC.rr1759, SRC.wetFlySwingGalloup, SRC.orvisTop10, SRC.orvisDD, SRC.fishSens],
  },
  {
    id: "coho-smolt",
    name: "Coho smolt",
    kind: "baitfish",
    months: [4, 5, 6],
    eatenBy: ["brown-trout"],
    description:
      "The one Michigan prey item with a documented month: in the Anna River, stocked coho smolts of 3.6 to 5.7 inches were the fish most frequently eaten by large brown trout in May, before slimy sculpins took over from June to October. Coho and steelhead smolts leave Michigan rivers in spring, so a 3-to-5-inch silver-and-olive smolt streamer is a high-value pattern for big browns on any river with a salmon or steelhead plant from late April into early June.",
    evidence: "S",
    sources: [SRC.rr1759, SRC.mdnrCoho],
  },
  {
    id: "lamprey",
    name: "Lamprey (native brook and sea lamprey ammocoetes)",
    kind: "baitfish",
    months: [3, 4, 5],
    eatenBy: ["brown-trout", "steelhead"],
    description:
      "Long, thin and undulating, lampreys are a spring streamer subject on the Pere Marquette and Manistee. Ed McCoy fishes 4-to-7-inch lamprey patterns with a long, leechy appearance and lots of movement for spring brown trout, and Michigan TU lists lamprey among the reach-specific baitfish to imitate. Black, brown or olive rabbit-strip and marabou leech-style flies swung or stripped slowly cover them; the same silhouette overlaps with steelhead leech patterns.",
    evidence: "A",
    sources: [SRC.mangledBrown, SRC.michiganTU],
  },

  /* ------------------------------------------------------------------ */
  /* Crustaceans and annelids                                            */
  /* ------------------------------------------------------------------ */
  {
    id: "crayfish",
    name: "Crayfish",
    kind: "crustacean",
    months: [6, 7, 8, 9],
    eatenBy: ["brown-trout", "brook-trout", "steelhead", "rainbow-trout"],
    description:
      "The DNR lists crustaceans in the diets of both brown and brook trout, an Au Sable guide calls crayfish one of the main staples of a brown trout's diet, and anglers report crayfish in Michigan steelhead stomachs. No Michigan study quantifies the share. Crayfish are most active and most often eaten in the warm months, which is when rust and brown Woolly Buggers, the Circus Peanut in Root Beer and Galloup's Dungeon in Crawdad Orange (a stained-water favorite) earn their place. Fish them crawled or hopped along the bottom.",
    evidence: "A",
    sources: [SRC.mdnrBrown, SRC.mdnrBrook, SRC.outfishAuSable, SRC.miSportsmanSteelheadFacts, SRC.murraysDungeon, SRC.streamsideCircusPeanut],
  },
  {
    id: "leech",
    name: "Leech",
    kind: "annelid",
    months: ALL_YEAR,
    eatenBy: ["steelhead", "brown-trout", "chinook", "coho"],
    description:
      "Leech-profile flies are a Michigan steelhead staple even though no Michigan study documents leeches in the diet; the black String Leech, Silvey's Tail Light, Miles Davis and Larimer's Reverse Marabou are the high-dirty-water picks, the Egg-Sucking Leech is among the most effective flies on Great Lakes tributaries, and Feenstra's Halloween Leech (fall) and Grapefruit Leech (winter cold water) are the standard swung patterns on the Muskegon. Salmon take dark Egg-Sucking Leeches and bunny leeches from aggression. Treat the leech as a silhouette-and-motion trigger available all year rather than a hatch to match.",
    evidence: "A",
    sources: [SRC.cwTop5, SRC.midcurrentESL, SRC.nomadHalloween, SRC.midcurrentWinter, SRC.flylordsSalmon],
  },
  {
    id: "scud",
    name: "Scud (freshwater shrimp)",
    kind: "crustacean",
    months: ALL_YEAR,
    eatenBy: ["brook-trout", "brown-trout", "rainbow-trout", "steelhead", "pink-salmon"],
    description:
      "Scuds are the crustaceans the DNR has in mind when it says brook trout feed on crustaceans, and they are abundant in Michigan's weedy, groundwater-fed trout streams year-round. Supinski lists scuds with Hex nymphs, caddis and stones as winter steelhead nymphs on the Pere Marquette, Muskegon, Au Sable and Platte, and Minnesota's Lake Superior pink salmon guidance includes scuds in the size 12 to 20 nymph box. No Michigan-specific scud pattern guidance was located; olive, tan and orange scuds in sizes 12 to 18 are a generic recommendation.",
    evidence: "A",
    sources: [SRC.mdnrBrook, SRC.supinski, SRC.mnDnrPink],
  },
  {
    id: "sowbug",
    name: "Sowbug (aquatic isopod)",
    kind: "crustacean",
    months: ALL_YEAR,
    eatenBy: ["brook-trout", "brown-trout", "rainbow-trout"],
    description:
      "Sowbugs share the weed beds and gravel of spring creeks with scuds and are covered by the same DNR statement that trout eat crustaceans, but no Michigan source names them specifically; this record is an extension so the fly table can link gray sowbug and Ray Charles patterns. Fish gray or tan flattened patterns in sizes 14 to 18 dead-drifted in groundwater reaches all year, with the most value in winter and early spring when insect hatches are sparse.",
    evidence: "I",
    sources: [SRC.mdnrBrook, SRC.mdnrBrown],
  },
  {
    id: "aquatic-worm",
    name: "Aquatic worm",
    kind: "annelid",
    months: ALL_YEAR,
    eatenBy: ["brook-trout", "brown-trout", "rainbow-trout", "steelhead"],
    description:
      "The DNR lists worms among the foods brook trout take when they are readily available, and aquatic oligochaetes live in the silt of every Michigan trout and steelhead river, but no Michigan source gives San Juan Worm or Squirmy Wormy guidance, so the pattern link and the steelhead entry are an extension. Worm patterns are most useful when rising or stained water dislodges silt-dwelling worms, and they fit the same red, pink and wine color slots that egg flies occupy in a steelhead tandem rig.",
    evidence: "I",
    sources: [SRC.mdnrBrook],
  },
  {
    id: "earthworm",
    name: "Earthworm (washed in after rain)",
    kind: "annelid",
    months: [4, 5, 6, 7, 8, 9],
    eatenBy: ["brown-trout", "brook-trout", "rainbow-trout"],
    description:
      "Worms washed into the river after rain are guide-attested opportunistic food, in the same way Current Works notes crickets get washed in after a good rainfall. The DNR includes worms in the brook trout diet. Fish a worm pattern in rising, off-color water in the warm months when banks are soft; otherwise treat it as a low-priority attractor. No Michigan-specific worm pattern recommendation was sourced.",
    evidence: "A",
    sources: [SRC.mdnrBrook, SRC.cwTerrestrials],
  },

  /* ------------------------------------------------------------------ */
  /* Mammals and amphibians                                              */
  /* ------------------------------------------------------------------ */
  {
    id: "mouse",
    name: "Mouse and vole",
    kind: "mammal",
    months: [7, 8, 9],
    eatenBy: ["brown-trout", "brook-trout"],
    description:
      "The DNR lists small rodents in the adult brown trout diet, and Michigan's mousing tradition is built on nocturnal browns hunting the shallow flats in summer. Mangled Fly puts peak mousing from July to September, when limited food makes hungry trout hunt at night, on the Au Sable, Pere Marquette and Upper Manistee; Current Works puts night fishing from June through mid-September; and late August into September is prime. It has to be dark, which in midsummer Michigan means after about 10:30 pm, with water in the 52-to-68 F range. Patterns: McCoy's Mouse, Morrish Mouse in sizes 4 to 6, Master Splinter, Amphibious Assault and gurglers, fished on a slow wake and swung toward the bank. Large Upper Peninsula brook trout taking mice is an inference.",
    evidence: "A",
    sources: [SRC.mdnrBrown, SRC.mangledNight, SRC.cwSeasons, SRC.sippingMayflies, SRC.hawkinsNight, SRC.tridentMouse, SRC.mntuMousing],
  },
  {
    id: "frog",
    name: "Frog",
    kind: "amphibian",
    months: [7, 8, 9],
    eatenBy: ["brown-trout"],
    description:
      "The DNR lists amphibians in the adult brown trout diet, and Michigan night-fishing guides carry frog patterns alongside mice, waking flies and gurglers for the July-to-September season on the Au Sable, Pere Marquette and Upper Manistee. Frogs matter most on slow, weedy, bank-side flats at night and in the late-summer window when young-of-year frogs are abundant. Fish a deer-hair or foam frog with popping strips tight to the bank in the dark.",
    evidence: "A",
    sources: [SRC.mdnrBrown, SRC.mangledNight],
  },

  /* ------------------------------------------------------------------ */
  /* Terrestrial insects                                                 */
  /* ------------------------------------------------------------------ */
  {
    id: "ant",
    name: "Ant (including flying ants)",
    kind: "terrestrial-insect",
    months: [5, 6, 7, 8, 9, 10],
    eatenBy: ["brown-trout", "brook-trout", "rainbow-trout"],
    description:
      "Ants are the bread-and-butter terrestrial from late May on, with black and cinnamon flying ants producing late-summer mating flights in August and September that bring up fish on the Au Sable. Current Works fishes ants, including sunken ants, from mid-May with a July-to-August peak in the midday hours as air warms and the dew burns off; Galloup's Ant Acid and the Wet Skunk are the Michigan patterns, plus generic parachute ants in sizes 14 to 20. West Virginia data put terrestrials at 38 to 47 percent of stream brook trout biomass consumed, which is the best available indication of how much ants and beetles matter to small-stream fish.",
    evidence: "A",
    sources: [SRC.cwTerrestrials, SRC.riverReportsAuSable, SRC.orvisTop10, SRC.tafsBrookTerrestrials, SRC.cwAfterHex],
  },
  {
    id: "beetle",
    name: "Beetle",
    kind: "terrestrial-insect",
    months: [5, 6, 7, 8, 9, 10],
    eatenBy: ["brown-trout", "brook-trout", "rainbow-trout"],
    description:
      "Black beetles fall from overhanging trees, log jams and undercut banks all summer, and terrestrial Coleoptera consistently prove important prey for brook trout in warm seasons. Current Works fishes beetles mid-May through October (peak July to August), often as a dropper behind a more visible pattern; the XO Beetle and small foam beetles in sizes 12 to 18 plopped tight to grassy banks, tag alders and cedar limbs are the standard. Beetles are the terrestrial to try on bright, still afternoons when nothing is hatching.",
    evidence: "A",
    sources: [SRC.cwTerrestrials, SRC.riverReportsAuSable, SRC.tafsBrookTerrestrials],
  },
  {
    id: "grasshopper",
    name: "Grasshopper",
    kind: "terrestrial-insect",
    months: [7, 8, 9, 10],
    eatenBy: ["brown-trout", "brook-trout", "rainbow-trout"],
    description:
      "August is prime terrestrial season on the Au Sable, and hoppers are its signature: Hawkins pairs great hopper and ant action with the post-Hex July-to-August period, Current Works brings hopper patterns out of the box in July and August and fishes them into September and October, and RiverReports names the Fat Albert, Parachute Hopper, Charlie Boy and Moorish Hopper for grassy banks. The Sweetgrass Hopper, Chernobyl Ant, Club Sandwich and Fuzzy Wuzzy round out the Michigan list in sizes 8 to 12. Hit the bank, plop, twitch and dead-drift, with a beetle or ant dropper.",
    evidence: "A",
    sources: [SRC.cwTerrestrials, SRC.cwSeasons, SRC.riverReportsAuSable, SRC.hawkinsNight],
  },
  {
    id: "cricket",
    name: "Cricket",
    kind: "terrestrial-insect",
    months: [7, 8, 9, 10],
    eatenBy: ["brown-trout", "brook-trout", "rainbow-trout"],
    description:
      "Crickets are the rain terrestrial: Current Works notes they often get washed into the river after a good rainfall, making a black cricket or dark hopper pattern the choice for the first rising water after a late-summer storm. They share the July-to-October hopper season and the same bank-side presentation. Sizes 10 to 14 in black or dark brown foam or deer hair.",
    evidence: "A",
    sources: [SRC.cwTerrestrials],
  },
  {
    id: "inchworm",
    name: "Inchworm",
    kind: "terrestrial-insect",
    months: [5, 6, 7],
    eatenBy: ["brown-trout", "brook-trout", "rainbow-trout"],
    description:
      "Inchworms drop from streamside hardwoods on silk threads in late spring and early summer, and they appear in the angler-attested forage list for small browns and brook trout alongside ants, beetles and hoppers. No Michigan source gives specific timing, so the May-to-July window is an extension based on when the caterpillars are on the leaves. A chartreuse or bright green chenille or foam worm in sizes 12 to 16, fished dead-drift or sunk under overhanging trees, is the standard imitation.",
    evidence: "I",
    sources: [SRC.cwTerrestrials, SRC.tafsBrookTerrestrials],
  },
  {
    id: "cicada",
    name: "Cicada",
    kind: "terrestrial-insect",
    months: [6, 7, 8],
    eatenBy: ["brown-trout", "brook-trout", "rainbow-trout"],
    description:
      "Current Works lists cicadas among the terrestrials that carry the mid-May-to-October season, but Michigan cicada activity is sporadic and no Michigan periodical-brood emergence data was found in this research, so treat cicadas as an opportunistic summer pattern rather than a scheduled event. Annual dog-day cicadas sing from late June through August; a large dark foam pattern with orange or rubber legs in sizes 6 to 10 doubles as a hopper and a mouse-lite for daylight fishing.",
    evidence: "I",
    sources: [SRC.cwTerrestrials],
  },
  {
    id: "japanese-beetle",
    name: "Japanese beetle",
    kind: "terrestrial-insect",
    months: [7, 8],
    eatenBy: ["brown-trout", "brook-trout", "rainbow-trout"],
    description:
      "Japanese beetles are the midsummer beetle of Lower Peninsula river corridors, swarming streamside vegetation in July and August and falling in numbers on windy afternoons. They are named in the terrestrial forage list for small browns and brook trout but no Michigan source discusses them separately from beetles in general, so the July-to-August window is an extension. Fish a metallic green-and-copper foam beetle in sizes 12 to 14 tight to the bank, or a generic black beetle, in the same midday slot as ants and hoppers.",
    evidence: "I",
    sources: [SRC.cwTerrestrials, SRC.riverReportsAuSable],
  },
];

export const forage: Forage[] = ForageList.parse(raw);
export const forageById = new Map(forage.map((f) => [f.id, f]));
