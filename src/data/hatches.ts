import { z } from "zod";
import { HatchList, type Hatch } from "./schema";

/**
 * Hatch seed data. Every `window` is the NORTHERN LOWER PENINSULA baseline
 * (Au Sable / Manistee), taken from the Trails to Trout chart unless the
 * description says otherwise. Superior Flies figures quoted in descriptions
 * are the Upper Peninsula calibration and are NOT the baseline.
 *
 * Evidence: "S" only where the timing or trigger rests on a peer-reviewed,
 * agency or university source; "A" where it rests on shop, guide or
 * angling-entomology sources.
 */

/* Shared source records ------------------------------------------------- */

const TRAILS_TO_TROUT = {
  title: "Trails to Trout, Michigan Hatch Chart (northern-LP baseline)",
  url: "https://www.trailstotrout.com/resources/michigan-hatch-chart/",
};
const SUPERIOR_FLIES = {
  title: "Superior Flies, Upper Peninsula Hatch Chart",
  url: "https://www.superior-flies.com/hatch-chart/",
};
const MOTOR_CITY = {
  title: "Motor City Anglers, Michigan Hatch Chart",
  url: "https://mca.fish/pages/michigan-hatch-chart",
};
const GRAY_DRAKE_LODGE = {
  title: "Gray Drake Lodge, Muskegon River Hatch Cycle Chart",
  url: "http://graydrakelodgeandoutfitters.blogspot.com/2013/05/new-muskegon-river-hatch-cycle-chart.html",
  year: 2013,
};
const OLD_AU_SABLE = {
  title: "Old Au Sable Fly Shop, The Hatches",
  url: "https://www.oldausable.com/the-hatches",
};
const CURRENT_WORKS_MANISTEE = {
  title: "Current Works, Fly Fishing the Upper Manistee River",
  url: "https://www.current-works.com/northern-michigan-rivers-hatches/fly-fishing-manistee-river-trout/",
};
const FLYFISHFINDER_MI = {
  title: "FlyFishFinder, Michigan Fly Hatches",
  url: "https://flyfishfinder.com/pages/fly-hatches-michigan/",
  year: 2026,
};
const HOUGHTON_2015 = {
  title: "Houghton 2015, Environ. Entomol.: caddisfly flight periodicity on a northern Lower Michigan stream",
  url: "https://pubmed.ncbi.nlm.nih.gov/26339996/",
  year: 2015,
};
const HOUGHTON_2013 = {
  title: "Houghton 2013, J. Freshwater Ecology: nocturnal flight periodicity of caddisflies in a large Michigan river",
  url: "https://www.tandfonline.com/doi/full/10.1080/02705060.2013.780187",
  year: 2013,
};
const UMMZ_EPHEMEROPTERA = {
  title: "Aquatic Insects of Michigan (UMMZ), Ephemeroptera species list",
  url: "https://www.aquaticinsects.org/sp/Ephemeroptera/sp_eom.html",
};
const UMMZ_TRICHOPTERA = {
  title: "Aquatic Insects of Michigan (UMMZ), Trichoptera species list",
  url: "https://www.aquaticinsects.org/sp/Trichoptera/sp_tom.html",
};
const UMMZ_PLECOPTERA = {
  title: "Aquatic Insects of Michigan (UMMZ), Plecoptera species list",
  url: "https://www.aquaticinsects.org/sp/Plecoptera/sp_pom.html",
};

const CADDIS_DATE_NOTE =
  "Houghton (2015) tracked 27 caddis species weekly for five years on a northern Lower Michigan stream and found calendar date predicted flight timing better than water temperature, so a fixed calendar window is the better predictor for Michigan caddis.";

/* Records ---------------------------------------------------------------- */

const raw: z.input<typeof HatchList> = [
  /* ---------------------------------------------------------------- */
  /* Mayflies                                                          */
  /* ---------------------------------------------------------------- */
  {
    id: "hendrickson",
    commonName: "Hendrickson",
    aliases: ["Dark Hendrickson", "Light Hendrickson", "Red Quill"],
    scientificName: "Ephemerella subvaria",
    order: "mayfly",
    hookSizes: [12, 14],
    colors: [
      "reddish-brown body (male, Red Quill)",
      "creamy tan to pinkish body (female, Light Hendrickson)",
      "slate gray wing",
      "rusty brown spinner",
    ],
    window: { start: "04-20", peakStart: "05-01", peakEnd: "05-14", end: "05-20" },
    timeOfDay: ["midday", "afternoon", "dusk"],
    keyStages: ["nymph", "emerger", "dun", "spinner"],
    trigger: {
      waterTempF: [50, 55],
      notes:
        "Sporadic emergence begins when water reaches the mid-40s F; prolific emergence needs 50-55 F held for several days. Univoltine, so the hatch lasts 5-7 days on a given reach and 2-3 weeks across a region. Angling-entomology rule of thumb, not a controlled study.",
    },
    evidence: "A",
    regions: [],
    description:
      "The first of the Au Sable's Big Five, starting the last week of April and peaking the first two weeks of May on the northern rivers. Duns emerge mid-afternoon (roughly 2-5 pm on the Au Sable) for one to two hours, and spinners return to the riffles late afternoon to dusk, often compressed into a half hour; cool evenings push the spinner fall to the next morning. Fish a Pheasant Tail or dark-wingcase nymph before the hatch, then an emerger or Regan's Hendrickson Parachute (#14) during it, and a rusty spinner at dusk. The male dun is the darker Red Quill, tied a size smaller.",
    sources: [
      TRAILS_TO_TROUT,
      OLD_AU_SABLE,
      {
        title: "Troutnut, Ephemerella subvaria (Hendrickson)",
        url: "https://www.troutnut.com/hatch/7/Mayfly-Ephemerella-subvaria-Hendrickson/",
      },
      {
        title: "Troutnut forum, When does a Hatch happen?",
        url: "https://www.troutnut.com/topic/694/When-does-a-Hatch-happen",
      },
      {
        title: "Streamside Au Sable Guides, Hendrickson Hatch: Dark, Light, Rising Trout",
        url: "https://michigan-streamside.com/hendrickson-hatch-dark-light-rising-trout/",
        year: 2024,
      },
      {
        title: "Perfect Fly, Fly Fishing the Au Sable River in Michigan",
        url: "https://perfectflystore.com/your-streams/fly-fishing-on-the-ausable-river-in-michigan/",
      },
      MOTOR_CITY,
    ],
  },
  {
    id: "sulphur-invaria",
    commonName: "Sulphur",
    aliases: ["Sulphur Dun", "Big Sulphur", "Pale Evening Dun (older usage)", "Ephemerella rotunda"],
    scientificName: "Ephemerella invaria (= E. rotunda)",
    order: "mayfly",
    hookSizes: [12, 14, 16],
    colors: [
      "pale yellow to yellow-orange body",
      "yellowish-olive body (some populations)",
      "pale gray wing",
      "rusty brown spinner",
    ],
    window: { start: "05-15", peakStart: "06-07", peakEnd: "06-30", end: "07-08" },
    timeOfDay: ["midday", "afternoon", "dusk"],
    keyStages: ["nymph", "emerger", "dun", "spinner"],
    trigger: {
      waterTempF: [52, 60],
      notes:
        "Emergence at 52-60 F water (Troutnut, angling entomology). Emergence is slow through the film in mid or late afternoon or evening; duns molt within a day and spinners fall at dusk over riffles.",
    },
    evidence: "A",
    regions: [],
    description:
      "The second of the Au Sable's Big Five and the bread-and-butter afternoon hatch of late May and June on the northern rivers, with dense hatches on the Pere Marquette that create selective risers in slow glides and tail-outs. Emergence is sporadic through the day with an afternoon-to-evening peak, and spinners drop at sunset. Trout routinely refuse duns during this hatch, so emergers and rusty spinners outfish dun patterns; carry pale yellow, orange and olive shades because body color varies. On the Muskegon and Pere Marquette the hatch runs a size smaller and continues through July.",
    sources: [
      TRAILS_TO_TROUT,
      {
        title: "Troutnut, Ephemerella invaria (Sulphur Dun)",
        url: "https://www.troutnut.com/hatch/11/Mayfly-Ephemerella-invaria-Sulphur-Dun",
      },
      {
        title: "Hallowed Waters, The Ultimate Sulphur Primer",
        url: "https://hallowedwaters.com/2021/05/the-ultimate-sulphur-primer/",
        year: 2021,
      },
      OLD_AU_SABLE,
      GRAY_DRAKE_LODGE,
      {
        title: "FlyFishFinder, Pere Marquette River hatches",
        url: "https://flyfishfinder.com/pages/hatches/pere-marquette-river/",
        year: 2026,
      },
      MOTOR_CITY,
    ],
  },
  {
    id: "sulphur-dorothea",
    commonName: "Little Sulphur",
    aliases: ["Pale Evening Dun", "Little Yellow Sulphur", "Dorothea"],
    scientificName: "Ephemerella dorothea dorothea",
    order: "mayfly",
    hookSizes: [16, 18, 20],
    colors: ["creamy yellow body", "pale yellow-orange body", "pale gray wing", "rusty spinner"],
    window: { start: "05-15", end: "07-15" },
    timeOfDay: ["evening", "dusk", "night"],
    keyStages: ["emerger", "dun", "spinner"],
    trigger: {
      notes:
        "No independent temperature threshold in any Michigan source; dorothea follows or overlaps invaria later in the season and about one hook size smaller. The Trails to Trout chart lists a Little Sulphur (5/15-6/7) and a Pale Evening Dun (6/1-7/15, 8 pm to midnight); both are treated here as the dorothea window.",
    },
    evidence: "A",
    regions: [],
    description:
      "The smaller, later sulphur, called the Pale Evening Dun on Michigan charts because it emerges from about 8 pm into darkness in June and early July. It follows or overlaps the larger E. invaria on the same riffles, so when trout start refusing your #14 sulphur in late June, drop to a #18 in the same pale yellow. On the Muskegon it runs #18-20; the Au Sable shops describe it as a miniature eastern sulphur with creamy yellow bodies shading to olive or orange. Fish a low-riding emerger or a CDC dun at dusk and a rusty spinner as it gets dark.",
    sources: [
      TRAILS_TO_TROUT,
      {
        title: "Troutnut, Ephemerella dorothea (Sulphur)",
        url: "https://www.troutnut.com/hatch/458/mayfly-ephemerella-dorothea-sulphur",
      },
      OLD_AU_SABLE,
      GRAY_DRAKE_LODGE,
      SUPERIOR_FLIES,
    ],
  },
  {
    id: "blue-winged-olive",
    commonName: "Blue-Winged Olive",
    aliases: ["BWO", "Baetis", "Little Olive"],
    scientificName: "Baetis tricaudatus and other Baetidae",
    order: "mayfly",
    hookSizes: [16, 18, 20, 22],
    colors: ["olive to olive-brown body", "slate gray wing", "olive-brown nymph", "rusty olive spinner"],
    window: { start: "04-15", peakStart: "05-01", peakEnd: "05-07", end: "10-24" },
    timeOfDay: ["midday", "afternoon"],
    keyStages: ["nymph", "emerger", "dun", "spinner"],
    trigger: {
      waterTempF: [45, 50],
      notes:
        "Angler threshold: hatching begins when water rises into the mid-40s F. Baetis tricaudatus produces three broods with distinct peaks (spring is largest, then late June, then September); the chart's second peak is 6/7-6/21. Photoperiod and water temperature jointly set brood timing and summer diapause (Scientific Reports 2016, non-Michigan).",
    },
    evidence: "A",
    regions: [],
    description:
      "The longest-running mayfly on the Michigan calendar, from mid-April through late October, with the biggest brood the first week of May, a second in mid-June and a third in September. Duns come off midday to mid-afternoon and are best on gray, drizzly days; the tailwaters below Croton and Tippy dams keep BWOs going through the winter. Fish a #18-20 CDC or Sparkle Dun for risers, a Pheasant Tail or olive nymph before and between hatches, and a rusty olive spinner in the evening. Sizes shrink through the season, so carry #16 in spring and #20-22 in fall.",
    sources: [
      TRAILS_TO_TROUT,
      MOTOR_CITY,
      {
        title: "Troutnut, Baetis tricaudatus (Blue-Winged Olive)",
        url: "https://www.troutnut.com/hatch/240/mayfly-baetis-tricaudatus-blue-winged-olive",
      },
      {
        title: "Gunnison Insects, Baetis tricaudatus (mid-40s F threshold)",
        url: "https://www.gunnisoninsects.org/ephemeroptera/baetis_tricaudatus.html",
      },
      {
        title: "Scientific Reports 2016, Increased temperature delays late-season phenology of a multivoltine mayfly",
        url: "https://www.nature.com/articles/srep38022",
        year: 2016,
      },
      FLYFISHFINDER_MI,
      GRAY_DRAKE_LODGE,
    ],
  },
  {
    id: "tiny-blue-winged-olive",
    commonName: "Tiny Blue-Winged Olive",
    aliases: ["Pseudocloeon", "Pseudo", "Tiny BWO", "Little Medium Olive"],
    scientificName: "Plauditus and Acentrella spp. (formerly Pseudocloeon) and other small Baetidae",
    order: "mayfly",
    hookSizes: [20, 22, 24, 26],
    colors: ["pale olive body", "olive-gray body", "light gray wing"],
    window: { start: "05-15", end: "08-30" },
    timeOfDay: ["afternoon", "evening"],
    keyStages: ["emerger", "dun", "spinner"],
    trigger: {
      notes:
        "No temperature threshold published for Michigan. The Trails to Trout baseline window is 5/15-8/30; the Superior Flies U.P. chart carries Pseudocloeon 7/5-10/14 and the Muskegon tailwater fishes these #24-26 olives from summer into November, late afternoons until first snow.",
    },
    evidence: "A",
    regions: [],
    description:
      "The tiny summer and fall olives that sit alongside the standard Baetis and are easy to mistake for midges until you look closely. On the Muskegon they emerge and fall as spinners in the evening from midsummer through November, and trout keying on them demand #24-26 flies on 7X. Fish a sparse CDC emerger or a no-hackle in the film, and switch to a tiny rusty or olive spinner as the light goes. On the northern rivers they matter most from late May through August.",
    sources: [TRAILS_TO_TROUT, GRAY_DRAKE_LODGE, SUPERIOR_FLIES],
  },
  {
    id: "blue-quill",
    commonName: "Blue Quill",
    aliases: ["Little Mahogany", "Slate Wing Mahogany", "Little Red Quill", "Paraleptophlebia"],
    scientificName: "Neoleptophlebia adoptiva (formerly Paraleptophlebia adoptiva)",
    order: "mayfly",
    hookSizes: [16, 18],
    colors: ["dark reddish-brown to mahogany body", "slate gray wing", "dark brown nymph"],
    window: { start: "04-15", peakStart: "05-01", peakEnd: "05-14", end: "07-08" },
    timeOfDay: ["midday", "afternoon"],
    keyStages: ["nymph", "emerger", "dun", "spinner"],
    trigger: {
      waterTempF: [50, 55],
      notes:
        "Emerges around midday once water has held above 50 F for a few days (Troutnut, angling entomology); the upper bound is an operational range, not a published ceiling.",
    },
    evidence: "A",
    regions: [],
    description:
      "A small dark mayfly that comes off midday in the same late-April to mid-May window as the Hendrickson, and is often the reason trout ignore your #14 Hendrickson. Duns emerge slowly in slower water and eddies, so a #18 dark-bodied parachute or a mahogany emerger fished on the edges of the current is the play. The species runs sporadically into July; on the Boardman anglers report about six weeks of Blue Quills from mid-May. Fish a small dark Pheasant Tail before the hatch and a rusty spinner in the afternoon.",
    sources: [
      TRAILS_TO_TROUT,
      MOTOR_CITY,
      SUPERIOR_FLIES,
      {
        title: "Troutnut, Neoleptophlebia adoptiva (Blue Quill)",
        url: "https://www.troutnut.com/hatch/51/Mayfly-Paraleptophlebia-adoptiva-Blue-Quill",
      },
      {
        title: "DIY Fly Fishing, Boardman River Michigan",
        url: "https://diyflyfishing.com/boardman-river-michigan/",
      },
    ],
  },
  {
    id: "black-quill",
    commonName: "Black Quill",
    aliases: ["Great Mahogany", "Borcher's Drake", "Early Quill", "Leptophlebia"],
    scientificName: "Leptophlebia cupida",
    order: "mayfly",
    hookSizes: [10, 12, 14],
    colors: ["dark brown to blackish-brown body", "dark slate wing", "dark brown nymph"],
    window: { start: "04-20", end: "06-15" },
    timeOfDay: ["midday", "afternoon"],
    keyStages: ["nymph", "emerger", "dun", "spinner"],
    trigger: {
      notes:
        "No temperature threshold in any source. On the Muskegon the Early Quills (Leptophlebia cupida with Epeorus pleuralis) show around May 10 for about two weeks on warm afternoons; the Trails to Trout baseline is 4/20-6/15.",
    },
    evidence: "A",
    regions: [],
    description:
      "A large, very dark spring mayfly that emerges midday and early afternoon by crawling out on shore or popping through the surface in slow water, so the hatch is scattered rather than a blanket. It overlaps the Hendrickson and the Upper Manistee lists black quills among its May-June hatches. Trout take it best as a low-floating emerger or a #12 dark parachute; the Borcher's Drake, a Michigan pattern, was tied for this bug and for Isonychia spinners. Nymphs migrate toward slow bank water before emergence, so drift a dark nymph along the edges.",
    sources: [
      TRAILS_TO_TROUT,
      MOTOR_CITY,
      GRAY_DRAKE_LODGE,
      CURRENT_WORKS_MANISTEE,
      {
        title: "Troutnut, Leptophlebia cupida (Black Quill)",
        url: "https://www.troutnut.com/hatch/79/Mayfly-Leptophlebia-cupida-Black-Quill",
      },
      SUPERIOR_FLIES,
    ],
  },
  {
    id: "quill-gordon",
    commonName: "Quill Gordon",
    aliases: ["Epeorus", "Early Quill"],
    scientificName: "Epeorus pleuralis (identity per the Muskegon chart; not confirmed for northern rivers)",
    order: "mayfly",
    hookSizes: [12, 14],
    colors: ["gray-brown to tan body", "gray wing", "flat clinging nymph, dark brown"],
    window: { start: "05-24", end: "07-12" },
    timeOfDay: ["afternoon", "evening"],
    keyStages: ["nymph", "emerger", "dun"],
    trigger: {
      notes:
        "No Michigan temperature threshold. The Trails to Trout baseline row is 5/24-7/12; the Muskegon chart shows Epeorus pleuralis with the Early Quills around May 10 for two weeks on warm afternoons into early evening.",
    },
    evidence: "A",
    regions: [],
    description:
      "A fast-water clinging mayfly that shows on Michigan charts from late May into July on the northern rivers and about May 10 on the Muskegon. Epeorus duns often shed the nymphal shuck on the bottom and rise as winged adults, so a soft-hackle or wet fly swung through the riffles at hatch time can outfish a dry. When duns are on the water, a #12-14 gray-bodied parachute or Comparadun fished through pocket water is standard. Duns show on warm afternoons and into early evening.",
    sources: [TRAILS_TO_TROUT, GRAY_DRAKE_LODGE, SUPERIOR_FLIES],
  },
  {
    id: "march-brown",
    commonName: "March Brown",
    aliases: ["American March Brown", "Gray Fox", "Stenonema vicarium"],
    scientificName: "Maccaffertium vicarium (formerly Stenonema vicarium and S. fuscum)",
    order: "mayfly",
    hookSizes: [8, 10, 12],
    colors: [
      "pale amber-yellow to reddish-brown body",
      "heavily mottled tan and brown wing",
      "cream to tan body (Gray Fox form)",
    ],
    window: { start: "05-15", end: "07-20" },
    timeOfDay: ["midday", "afternoon"],
    keyStages: ["nymph", "emerger", "dun", "spinner"],
    trigger: {
      waterTempF: [54, 58],
      notes:
        "Begins when water reaches the mid-50s F (Troutnut, angling entomology); the upper bound is an operational range, not a published ceiling. The March Brown and Gray Fox are the same species in two color forms.",
    },
    evidence: "A",
    regions: [],
    description:
      "A big mottled-wing clinger that hatches sporadically from mid-May into July, late morning through evening with a mid-afternoon peak, rather than in dense flurries. Duns take a long time to get off the water in the riffles, which makes them a good target for a #10-12 parachute or Comparadun drifted through fast water and along seams. Nymphs are flat clingers on cobble; a March Brown or Hare's Ear nymph fished in the riffles before the hatch works. Ignore aggregator charts that start this hatch in March; no Michigan shop supports that.",
    sources: [
      TRAILS_TO_TROUT,
      {
        title: "Troutnut, Maccaffertium vicarium (March Brown)",
        url: "https://www.troutnut.com/hatch/601/Mayfly-Maccaffertium-vicarium-March-Brown",
      },
      CURRENT_WORKS_MANISTEE,
      GRAY_DRAKE_LODGE,
      {
        title: "Fly Shack, Au Sable River hatch chart (March-start dates not corroborated)",
        url: "https://www.flyshack.com/HatchChart.aspx?RiverID=1406",
      },
    ],
  },
  {
    id: "great-speckled-olive",
    commonName: "Great Speckled Olive",
    aliases: ["Large BWO", "Drunella"],
    scientificName: "Drunella sp. (identity unconfirmed by any Michigan source)",
    order: "mayfly",
    hookSizes: [8, 10, 12, 14],
    colors: ["olive to olive-brown body", "speckled gray wing", "robust olive-brown nymph"],
    window: { start: "05-15", peakStart: "05-15", peakEnd: "05-31", end: "07-15" },
    timeOfDay: ["midday", "afternoon"],
    keyStages: ["nymph", "emerger", "dun"],
    trigger: {
      notes:
        "No temperature threshold and no Latin name on the Michigan charts; the chart peak is printed as 5/14-5/31 against a 5/15 start. The Muskegon chart lists a Drunella BWO #14 in mid-May, which supports the genus assignment.",
    },
    evidence: "A",
    regions: [],
    description:
      "The large olive mayfly of late May on the Trails to Trout chart, hatching midday to late afternoon and peaking in the second half of May on the northern rivers. It is a much bigger bug than the Baetis olives, so when trout refuse a #18 BWO in late May try a #10-12 olive parachute or Comparadun. A robust olive nymph dead-drifted in the riffles works before the hatch. Treat the species identity as unconfirmed; only the size, color and window are documented.",
    sources: [TRAILS_TO_TROUT, GRAY_DRAKE_LODGE, SUPERIOR_FLIES],
  },
  {
    id: "light-cahill",
    commonName: "Light Cahill",
    aliases: ["Cahill", "Stenonema", "Stenacron"],
    scientificName: "Stenacron interpunctatum and Maccaffertium spp. (species not confirmed by Michigan sources)",
    order: "mayfly",
    hookSizes: [10, 12, 14],
    colors: ["cream to pale yellow body", "pale yellow to cream wing", "tan clinging nymph"],
    window: { start: "06-05", end: "08-14" },
    timeOfDay: ["afternoon", "evening", "dusk"],
    keyStages: ["nymph", "dun", "spinner"],
    trigger: {
      notes:
        "No temperature threshold in any source; the Trails to Trout baseline is 6/5-8/14 (2 pm to 10 pm). On the Muskegon the Stenonema complex (Light Cahill #14, March Brown #12, Gray Fox #12) is described as a huge presence from June through September.",
    },
    evidence: "A",
    regions: [],
    description:
      "The pale summer clinger of June through mid-August, coming off in the afternoon and evening on the Upper Manistee, Au Sable and Muskegon. Hatches are scattered rather than heavy, so the Light Cahill is often a searching pattern: a #12-14 cream parachute fished through riffles and pocket water on summer evenings. Spinners fall at dusk over the riffles. A Robert's Yellow Drake covers Cahills, Sulphurs and Brown Drakes in one Michigan pattern.",
    sources: [
      TRAILS_TO_TROUT,
      CURRENT_WORKS_MANISTEE,
      GRAY_DRAKE_LODGE,
      {
        title: "Hawkins Outfitters, Fly Patterns for Michigan Hatches",
        url: "https://hawkinsoutfitters.com/fly-patterns-for-michigan-hatches/",
      },
    ],
  },
  {
    id: "gray-drake",
    commonName: "Gray Drake",
    aliases: ["Siphlonurus", "Early Gray Drake", "Late Gray Drake"],
    scientificName: "Siphlonurus quebecensis (also S. alternatus, S. rapidus)",
    order: "mayfly",
    hookSizes: [8, 10, 12],
    colors: ["gray body with pale banding", "white stripe around the head", "clear wing (spinner)"],
    window: { start: "05-20", peakStart: "06-01", peakEnd: "06-07", end: "07-15" },
    timeOfDay: ["evening", "dusk"],
    keyStages: ["nymph", "spinner"],
    trigger: {
      notes:
        "No temperature threshold. Nymphs crawl out to emerge, so the dun is not fished; 78% of species records are in June. Spinner flights occur at dusk over riffles from 7 pm until dark, sometimes on cloudy, cold days.",
    },
    evidence: "A",
    regions: [],
    description:
      "Michigan's signature spinner-only hatch: nymphs crawl out on shore to emerge, so the dun stage is not imitated and the whole game is the dusk spinner fall over riffled water. Most important on the Pere Marquette and Muskegon, where spinner flights occur every evening from the third week of May into July, but Gray Drakes occur on most Michigan trout streams including the Boardman and Pine. Fish Ed McCoy's Real McCoy Gray Drake Spinner or a slim-tied #10-12 Adams from 7 pm to dark, and watch for trout targeting mating doubles. Swim a gray Siphlonurus nymph through slow water near wood earlier in the day.",
    sources: [
      {
        title: "Hawkins Outfitters, Gray Drake",
        url: "https://hawkinsoutfitters.com/gray-drake/",
      },
      TRAILS_TO_TROUT,
      GRAY_DRAKE_LODGE,
      {
        title: "Betts Guide Service, Muskegon River Trout Hatch Season",
        url: "https://bettsguideservice.com/muskegon-river-trout-hatch-season/",
      },
      {
        title: "Troutnut, Siphlonurus quebecensis (Gray Drake)",
        url: "https://www.troutnut.com/hatch/171/Mayfly-Siphlonurus-quebecensis-Gray-Drakes",
      },
      MOTOR_CITY,
    ],
  },
  {
    id: "brown-drake",
    commonName: "Brown Drake",
    aliases: ["Ephemera simulans"],
    scientificName: "Ephemera simulans",
    order: "mayfly",
    hookSizes: [8, 10, 12],
    colors: ["brownish-tan body with dark markings", "heavily mottled brown and tan wing", "pale burrowing nymph"],
    window: { start: "06-01", peakStart: "06-01", peakEnd: "06-14", end: "07-04" },
    timeOfDay: ["dusk", "night"],
    keyStages: ["nymph", "emerger", "dun", "spinner"],
    trigger: {
      waterTempF: [50, 55],
      notes:
        "Hatching begins at about 50 F water (Troutnut, angling entomology); the upper bound is an operational range. Blizzard hatches last 3-7 nights on a given reach and move upriver. Flannagan & Heise (1987) covered E. simulans alongside Hexagenia in the Manitoba degree-day study but published no separate figure usable here.",
    },
    evidence: "A",
    regions: [],
    description:
      "The third of the Au Sable's Big Five: short-lived, blizzard-like hatches from about 8 pm to midnight in the first half of June on the northern rivers, late May on the Pere Marquette and Muskegon. Each reach gets three to seven nights before the hatch moves upstream, so the trick is being on the right stretch. Duns emerge at dusk and the spinner fall into darkness is the best fishing; Brown Drakes and Sulphurs drive the evening rise on the South Branch. Fish a #10 Brown Drake dun or spinner, or a Robert's Yellow Drake, and a burrowing-nymph pattern over sand and silt before dark.",
    sources: [
      TRAILS_TO_TROUT,
      OLD_AU_SABLE,
      {
        title: "Troutnut, Ephemera simulans (Brown Drake)",
        url: "https://www.troutnut.com/hatch/35/mayfly-ephemera-simulans-brown-drake",
      },
      {
        title: "Michigan Fly Fishing Hub, Au Sable River South Branch",
        url: "https://michiganflyfishinghub.com/rivers/au-sable-river-south-branch/",
        year: 2026,
      },
      SUPERIOR_FLIES,
      MOTOR_CITY,
    ],
  },
  {
    id: "hex",
    commonName: "Hex",
    aliases: ["Giant Michigan Mayfly", "Hexagenia", "Michigan Caddis (misnomer)", "Fishfly"],
    scientificName: "Hexagenia limbata",
    order: "mayfly",
    hookSizes: [4, 6, 8],
    colors: [
      "pale yellow to cream body with reddish-brown markings",
      "yellow-orange egg mass (female)",
      "mottled gray-brown wing",
      "pale tan burrowing nymph with dark wing cases",
    ],
    window: { start: "06-10", peakStart: "06-21", peakEnd: "07-07", end: "07-10" },
    timeOfDay: ["dusk", "night"],
    keyStages: ["nymph", "emerger", "dun", "spinner"],
    trigger: {
      waterTempF: [62, 68],
      degreeDays: {
        baseC: 10,
        low: 1806,
        high: 2030,
        notes:
          "Degree-days above 10 C accumulated by three Hexagenia limbata life-history types in Dauphin Lake, Manitoba: 1848, 2030 and 1806 (Flannagan & Heise 1987). Non-Michigan lake population; degree-day accumulation in the final year before emergence predicts timing better than the whole-life total. Subimagos do not emerge until water reaches 20 C (68 F) per Animal Diversity Web. Au Sable guides treat 62-65 F held consistently as the sign the hatch is days away.",
      },
      notes:
        "Peer-reviewed 20 C emergence floor; the 62-65 F Au Sable figure is angler guidance. Northern Michigan lakes hatch in early to mid-June and rivers follow 7-10 days later. Cold groundwater rivers run a two-year nymph cycle.",
    },
    evidence: "S",
    regions: [],
    description:
      "Michigan's biggest hatch and the last of the Au Sable's Big Five: 4-8 duns emerging in the dark from silt banks on muggy nights from about 10 pm, with spinner falls one to three nights after the first duns. Peak on the Au Sable Holy Water is June 20-28 (Mio Trophy Water is the classic Hex water), Manistee June 25-July 5, Pere Marquette June 10-25, Muskegon tailwater June 8-20, and the U.P. two to three weeks later (Superior Flies peak July 5-21). Fish a Hex dun or spinner such as Robert's Yellow Drake, McCoy's All Day Dun or a Boondoggle Hex on a short 6-foot 2X leader, and a Hex wiggle nymph or Spring Wiggler year-round; trout in prime habitat may see up to 2,000 nymphs a day outside the hatch. Watch water temperature from June 10 and expect the hatch within days once the Au Sable holds 62-65 F.",
    sources: [
      {
        title: "Animal Diversity Web, Hexagenia limbata",
        url: "https://animaldiversity.org/accounts/Hexagenia_limbata/",
      },
      {
        title: "Flannagan & Heise 1987, J. N. Am. Benthol. Soc.: Hexagenia limbata life history and degree-days",
        url: "https://www.journals.uchicago.edu/doi/10.2307/1467310",
        year: 1987,
      },
      TRAILS_TO_TROUT,
      SUPERIOR_FLIES,
      {
        title: "Hawkins Outfitters, Hexagenia limbata",
        url: "https://hawkinsoutfitters.com/hexagenia-limbata/",
      },
      {
        title: "Michigan Fly Fishing Hub, Michigan Hex Hatch",
        url: "https://michiganflyfishinghub.com/michigan-hex-hatch.html",
        year: 2026,
      },
      {
        title: "Troutnut, Hexagenia limbata (Hex)",
        url: "https://www.troutnut.com/hatch/32/mayfly-hexagenia-limbata-hex",
      },
      {
        title: "Troutnut forum, Hex hatch water temperature range",
        url: "https://www.troutnut.com/topic/8508/Hex-hatch-water-temperature-range",
      },
    ],
  },
  {
    id: "isonychia",
    commonName: "Isonychia",
    aliases: ["Iso", "Slate Drake", "Mahogany Dun (Iso)", "Leadwing Coachman", "White-Gloved Howdy"],
    scientificName: "Isonychia bicolor (also I. sadleri)",
    order: "mayfly",
    hookSizes: [8, 10, 12, 14],
    colors: [
      "dark mahogany to reddish-brown body",
      "slate gray wing",
      "dark brown nymph with pale dorsal stripe",
      "male spinner intensely red with white fore-legs",
    ],
    window: { start: "05-15", peakStart: "06-01", peakEnd: "06-30", end: "09-30" },
    timeOfDay: ["evening", "dusk", "midday"],
    keyStages: ["nymph", "dun", "spinner"],
    trigger: {
      notes:
        "No temperature threshold. Two peaks: late May to early July (June on the northern rivers) and a second brood in September, when emergence is more often midday. Only the June peak is stored in the window; the September peak is described below.",
    },
    evidence: "A",
    regions: [],
    description:
      "The fourth of the Au Sable's Big Five, with a June peak and a second September peak that gives some of the best fall dry-fly fishing. Nymphs are strong swimmers in fast cobble water and crawl out on rocks to emerge, leaving shucks on the stones, so a swum or stripped #10-12 Iso nymph is the primary fish-catcher, and the spinner fall in late evening over moderate current is the surface event. Fall duns often emerge midday and trout do take them on the water; a #12 Adams or Borcher's Drake covers the dun and spinner. Starts the first week of June on the Muskegon and runs sporadically to September.",
    sources: [
      TRAILS_TO_TROUT,
      {
        title: "Troutnut, Isonychia bicolor (Mahogany Dun)",
        url: "https://www.troutnut.com/hatch/649/Mayfly-Isonychia-bicolor-Mahogany-Dun",
      },
      OLD_AU_SABLE,
      GRAY_DRAKE_LODGE,
      MOTOR_CITY,
      SUPERIOR_FLIES,
    ],
  },
  {
    id: "baetisca",
    commonName: "Bat Fly",
    aliases: ["Armored Mayfly", "Baetisca", "Humpback Mayfly"],
    scientificName: "Baetisca spp.",
    order: "mayfly",
    hookSizes: [16, 18],
    colors: ["dark brown to reddish-brown body, very stout", "gray wing", "armored humpbacked nymph"],
    window: { start: "06-01", end: "06-30" },
    timeOfDay: ["morning", "midday", "evening"],
    keyStages: ["nymph", "spinner"],
    trigger: {
      notes:
        "No temperature threshold. The Motor City Anglers chart gives June statewide; Troutnut says nymphs crawl out on shore to emerge late morning or midday and spinners fall mid-evening around 8-9 pm.",
    },
    evidence: "A",
    regions: [],
    description:
      "An oddball June mayfly with an armored, humpbacked nymph and an extremely fat-bodied adult. Nymphs crawl out to emerge in late morning or midday, so the dun is rarely on the water; the fishable events are the crawling nymph near shore and the spinner fall at 8-9 pm. Standard slim spinner patterns fail because the natural is so stout; tie or buy a #16-18 spinner with a fat dubbed body. A minor hatch, but worth recognizing when trout refuse ordinary June patterns.",
    sources: [
      MOTOR_CITY,
      {
        title: "Troutnut, Baetisca (Armored Mayflies)",
        url: "https://www.troutnut.com/hatch/38/",
      },
      UMMZ_EPHEMEROPTERA,
    ],
  },
  {
    id: "trico",
    commonName: "Trico",
    aliases: ["Tricorythodes", "White-Winged Black", "Trike"],
    scientificName: "Tricorythodes spp.",
    order: "mayfly",
    hookSizes: [20, 22, 24, 26],
    colors: [
      "black body with white wing (male spinner)",
      "pale olive body with white wing (female)",
      "pale gray to olive dun",
    ],
    window: { start: "07-20", end: "10-20" },
    timeOfDay: ["morning"],
    keyStages: ["dun", "spinner"],
    trigger: {
      notes:
        "No water-temperature threshold. One angler source ties the mid-morning spinner fall to air temperature reaching about 68 F; on the Muskegon tailwater the timing tracks bottom-draw dam releases. Superior Flies U.P. start is August 3 versus the July 20 baseline.",
    },
    evidence: "A",
    regions: [],
    description:
      "The tiny morning mayfly of late July through October, fished from 6 to 10 am when the spinner clouds drop onto flat water and pods of trout sip steadily. Duns hatch late evening or very early morning; the mid-morning spinner fall (roughly 9-11 am, keyed to warming air) is the event, and it runs daily for weeks on the Au Sable, Upper Manistee, Boardman and Pigeon, and on the Muskegon between the dam and Henning Park. Fish a #22-24 Trico spinner on 6X-7X, or a double-spinner pattern as the Muskegon guides do, with a long drag-free drift. September Tricos on the South Branch Au Sable are a reliable close to the season.",
    sources: [
      TRAILS_TO_TROUT,
      SUPERIOR_FLIES,
      MOTOR_CITY,
      GRAY_DRAKE_LODGE,
      {
        title: "Troutnut, Tricorythodes (Tricos)",
        url: "https://www.troutnut.com/hatch/669/Mayfly-Tricorythodes-Tricos/",
      },
      {
        title: "DIY Fly Fishing, Pigeon River Michigan",
        url: "https://diyflyfishing.com/pigeon-river-michigan/",
      },
    ],
  },
  {
    id: "white-fly",
    commonName: "White Fly",
    aliases: ["Ephoron", "White Mayfly", "White Miller (mayfly, misnomer)"],
    scientificName: "Ephoron leukon and E. album",
    order: "mayfly",
    hookSizes: [10, 12, 14, 16],
    colors: ["creamy white body", "light gray wing (not pure white)", "pale burrowing nymph"],
    window: { start: "08-14", end: "09-30" },
    timeOfDay: ["dusk", "evening", "night"],
    keyStages: ["emerger", "dun", "spinner"],
    trigger: {
      waterTempF: [65, 70],
      notes:
        "Emerges at 65-70 F water (Troutnut, angling entomology); favors alkaline, warmer water. Females never molt to spinners and mate and die as duns; the whole event lasts about two hours at dusk.",
    },
    evidence: "A",
    regions: [],
    description:
      "The last big mayfly of the season: a burrowing mayfly that erupts at dusk from about August 14 through September on the Au Sable, Huron, White and Rifle rivers, with huge numbers emerging after dark. The event is compressed into about two hours; males molt to spinners in flight while females stay as duns, so a single cream-bodied, gray-winged pattern (White Wulff, White Parachute, White Comparadun #12-14) covers it. Bright white flies are inaccurate; the naturals are cream with light gray wings. Get in position before dark and expect a short, frantic rise.",
    sources: [
      TRAILS_TO_TROUT,
      MOTOR_CITY,
      FLYFISHFINDER_MI,
      {
        title: "Troutnut, Ephoron (White Flies)",
        url: "https://www.troutnut.com/hatch/820/Mayfly-Ephoron-White-Flies",
      },
      {
        title: "RiverReports, Au Sable River Michigan Fly Fishing",
        url: "https://www.riverreports.com/river-intel/rivers/au-sable-river-michigan-fly-fishing",
      },
      SUPERIOR_FLIES,
    ],
  },
  {
    id: "mahogany-dun",
    commonName: "Mahogany Dun",
    aliases: ["Fall Mahogany", "Small Slate Mahogany", "Paraleptophlebia"],
    scientificName: "Paraleptophlebia / Neoleptophlebia spp., fall brood (species not confirmed by Michigan sources)",
    order: "mayfly",
    hookSizes: [16, 18],
    colors: ["mahogany to reddish-brown body", "slate gray wing", "rusty spinner"],
    window: { start: "09-01", peakStart: "09-15", peakEnd: "10-15", end: "10-31" },
    timeOfDay: ["midday", "afternoon"],
    keyStages: ["nymph", "emerger", "dun", "spinner"],
    trigger: {
      notes:
        "No temperature threshold and no baseline chart row. The Pere Marquette (mid-state) reports fall Mahogany Duns drawing feeding activity mid-September through October and the Superior Flies U.P. chart carries a Small Slate Mahogany #16-18 from August 3 to November 13; the northern-LP window is set between those two. Distinct from the spring Blue Quill (N. adoptiva) and from Isonychia, which Troutnut also calls Mahogany Dun.",
    },
    evidence: "A",
    regions: [],
    description:
      "The small dark mayfly that brings trout up on fall afternoons after the Tricos and before the season closes, mid-September through October on the Pere Marquette and, by the U.P. chart, into November farther north. Duns emerge in slower water and eddies during the warmest part of the day, when they overlap the fall Blue-Winged Olives; a #16-18 mahogany or rusty parachute solves the fish that refuse an olive. Fish a small dark nymph on the edges beforehand and a rusty spinner late in the afternoon. On the Upper Manistee, mahogany duns are also listed among the May-June hatches, where the Blue Quill record applies.",
    sources: [
      {
        title: "FlyFishFinder, Pere Marquette River hatches",
        url: "https://flyfishfinder.com/pages/hatches/pere-marquette-river/",
        year: 2026,
      },
      SUPERIOR_FLIES,
      FLYFISHFINDER_MI,
      CURRENT_WORKS_MANISTEE,
    ],
  },

  /* ---------------------------------------------------------------- */
  /* Caddisflies                                                       */
  /* ---------------------------------------------------------------- */
  {
    id: "little-black-caddis",
    commonName: "Little Black Caddis",
    aliases: ["Black Caddis", "Little Black Sedge", "Chimarra"],
    scientificName: "Chimarra aterrima",
    order: "caddis",
    hookSizes: [16, 18, 20],
    colors: ["black to very dark brown body", "black wing", "bright yellow-orange larva"],
    window: { start: "04-20", peakStart: "05-01", peakEnd: "05-14", end: "06-30" },
    timeOfDay: ["midday", "afternoon", "evening"],
    keyStages: ["larva", "pupa", "emerger", "adult"],
    trigger: {
      dateDriven: true,
      notes: `Adults emerge slowly through the film in late morning or midday and lay eggs sitting on the surface in late afternoon; larvae drift extensively before emergence. ${CADDIS_DATE_NOTE}`,
    },
    evidence: "A",
    regions: [],
    description:
      "The small black caddis that comes off with the Hendricksons in late April and May on the Au Sable, Upper Manistee and Boardman, emerging midday and returning to lay eggs in the late afternoon and evening. Emergence is slow through the surface film, so a low-floating black emerger or a soft-hackle swung at midday usually beats a high-riding dry; in the evening a #18 black elk-hair or CDC caddis covers the egg-layers. Larvae drift heavily before the hatch and are bright yellow-orange, so a small orange or yellow larva works under an indicator. On the Muskegon the black caddis is extremely heavy from mid-May through June at dusk.",
    sources: [
      TRAILS_TO_TROUT,
      SUPERIOR_FLIES,
      MOTOR_CITY,
      {
        title: "Troutnut, Chimarra aterrima (Little Black Sedge)",
        url: "https://www.troutnut.com/hatch/2952/Caddisfly-Chimarra-aterrima-Little-Black-Sedge",
      },
      CURRENT_WORKS_MANISTEE,
      GRAY_DRAKE_LODGE,
      HOUGHTON_2015,
    ],
  },
  {
    id: "grannom",
    commonName: "Grannom",
    aliases: ["Mother's Day Caddis", "American Grannom", "Brachycentrus", "Apple Caddis"],
    scientificName: "Brachycentrus spp. (B. americanus, B. numerosus, B. lateralis and others in Michigan)",
    order: "caddis",
    hookSizes: [12, 14, 16],
    colors: [
      "bright green body with pale blonde wing (fresh adult)",
      "medium green body with brownish-gray wing (egg-layer)",
      "green larva in a square, tapered wood case",
    ],
    window: { start: "04-20", end: "07-31" },
    timeOfDay: ["afternoon", "evening", "dusk"],
    keyStages: ["larva", "pupa", "emerger", "adult"],
    trigger: {
      waterTempF: [50, 55],
      dateDriven: true,
      notes: `Brachycentrus hatches once water stays around 50 F (low 50s) for a few days (Orvis, MidCurrent; angling entomology). ${CADDIS_DATE_NOTE}`,
    },
    evidence: "A",
    regions: [],
    description:
      "The spring caddis of late April through May, with intense but brief afternoon emergences and females that ride the water to lay eggs, which is why an egg-laying dry works so well. Look for larvae hanging on silk lines in fast rocky water before the hatch; a green-bodied caddis larva or a soft-hackle swung through the riffles takes fish as the pupae rise. During the hatch fish a #14-16 tan-winged, green-bodied elk-hair or X-caddis from 2 pm to dark. The chart window runs into July but the heavy hatches are the first weeks; the U.P. runs about two weeks behind.",
    sources: [
      TRAILS_TO_TROUT,
      SUPERIOR_FLIES,
      {
        title: "Orvis News, The American Grannom (genus Brachycentrus)",
        url: "https://news.orvis.com/fly-fishing/american-grannom-genus-brachycentrus-springtime-gem",
      },
      {
        title: "MidCurrent, Caddisfly Hatches from February through April",
        url: "https://midcurrent.com/v2/caddisfly-hatches-from-february-through-april-flies-timing-and-presentation-for-every-stage/",
      },
      {
        title: "Troutnut, Brachycentrus (Grannoms)",
        url: "https://www.troutnut.com/hatch/1751/Caddisfly-Brachycentrus-Grannoms",
      },
      UMMZ_TRICHOPTERA,
      HOUGHTON_2015,
    ],
  },
  {
    id: "tan-caddis",
    commonName: "Tan Caddis",
    aliases: ["Spotted Sedge", "Cinnamon Caddis", "Hydropsyche", "Net-Spinning Caddis"],
    scientificName: "Hydropsyche spp. (20+ Michigan species) and Ceratopsyche spp.",
    order: "caddis",
    hookSizes: [12, 14, 16, 18],
    colors: ["tan to cinnamon body", "mottled tan and brown wing", "olive-tan larva with dark head"],
    window: { start: "05-01", end: "09-30" },
    timeOfDay: ["midday", "afternoon", "evening", "dusk"],
    keyStages: ["larva", "pupa", "emerger", "adult"],
    trigger: {
      dateDriven: true,
      notes: `Hydropsyche emerges slowly through the surface film in early or late morning, evening or night; pupal wing pads darken to near black a day or so before emergence. Houghton (2013) found early-to-mid July is the seasonal peak of adult caddis abundance on the Manistee system, with activity peaking one to two hours after sunset. ${CADDIS_DATE_NOTE}`,
    },
    evidence: "A",
    regions: [],
    description:
      "The all-summer caddis of Michigan rivers, from May through September and heaviest in early-to-mid July, when the Manistee system's caddis abundance peaks an hour or two after sunset. The Trails to Trout chart splits it into Spotted Sedge (#12-16, from May 1) and Cinnamon Caddis (#14-18, from May 20); both are net-spinners that emerge slowly through the film, so a sparkle pupa or soft-hackle swung at dusk is often the best fly. Larvae are available year-round in the riffles and are a steelhead and trout staple. For the egg-laying flights at dark fish a #14-16 tan elk-hair caddis; on the Muskegon the cinnamon caddis (#16) starts mid-May and the tan/olive caddis fishes into August on the Upper Manistee.",
    sources: [
      TRAILS_TO_TROUT,
      MOTOR_CITY,
      {
        title: "Troutnut, Hydropsyche (Spotted Sedges)",
        url: "https://www.troutnut.com/hatch/1916/Caddisfly-Hydropsyche-Spotted-Sedges",
      },
      GRAY_DRAKE_LODGE,
      CURRENT_WORKS_MANISTEE,
      HOUGHTON_2013,
      HOUGHTON_2015,
    ],
  },
  {
    id: "little-sister-caddis",
    commonName: "Little Sister Sedge",
    aliases: ["Green Caddis", "Little Sister Caddis", "Cheumatopsyche", "Tiny Green Caddis"],
    scientificName: "Cheumatopsyche spp. (C. speciosa, C. campyla, C. analis and others in Michigan)",
    order: "caddis",
    hookSizes: [10, 12, 14, 16, 18, 20],
    colors: ["green to olive body", "tan to light brown wing", "bright green larva"],
    window: { start: "05-01", end: "07-31" },
    timeOfDay: ["afternoon", "evening", "dusk"],
    keyStages: ["larva", "pupa", "emerger", "adult"],
    trigger: {
      dateDriven: true,
      notes: `Trails to Trout baseline Green Caddis #10-16, 5/1-7/31, 2 pm to dark; the Muskegon fishes a tiny green Cheumatopsyche speciosa #18-20 from mid-July through October, so the true season is longer than the baseline row. ${CADDIS_DATE_NOTE}`,
    },
    evidence: "A",
    regions: [],
    description:
      "The smaller, lighter-winged sibling of the Hydropsyche tan caddis, sitting lower in the watershed and running from May into midsummer on the northern rivers and, in its tiny #18-20 form, from mid-July through October on the Muskegon. Adults emerge and lay eggs in the afternoon and at dusk; trout feed heavily on the spent egg-layers at dark, so a green-bodied X-caddis or a spent partridge caddis fished in the film is the evening fly. The bright green larva is available all year and is a Michigan steelhead staple. Fish a #16-18 green caddis larva or a soft-hackle in the riffles by day.",
    sources: [
      TRAILS_TO_TROUT,
      GRAY_DRAKE_LODGE,
      {
        title: "Troutnut, Cheumatopsyche (Little Sister Sedges)",
        url: "https://www.troutnut.com/hatch/1913/Caddisfly-Cheumatopsyche-Little-Sister-Sedges",
      },
      {
        title: "Schrems West Michigan TU, Nymph Fishing for Steelhead",
        url: "https://swmtu.org/fishing/nymph-fishing-for-steelhead",
      },
      SUPERIOR_FLIES,
      HOUGHTON_2015,
    ],
  },
  {
    id: "green-rock-worm",
    commonName: "Green Rock Worm",
    aliases: ["Rhyacophila", "Green Caddis Larva", "Free-Living Caddis"],
    scientificName: "Rhyacophila spp. (R. fuscula, R. manistee and others in Michigan)",
    order: "caddis",
    hookSizes: [12, 14, 16],
    colors: ["bright green to olive-green larva", "dark head and legs", "olive-bodied adult with mottled gray-brown wing"],
    window: { start: "01-01", end: "12-31" },
    timeOfDay: ["all-day"],
    keyStages: ["larva"],
    trigger: {
      dateDriven: true,
      notes:
        "The larva, not the adult, is the fished stage and is present in the drift all year; no Michigan source gives adult emergence dates, so the window is the year-round larval availability. Free-living Rhyacophila larvae build no case and are dislodged into the drift in fast water.",
    },
    evidence: "A",
    regions: [],
    description:
      "A free-living caddis larva of fast, cold riffles that trout and steelhead eat year-round; it is one of the classic Michigan nymphs rather than a hatch to wait for. The bright green larva builds no case and gets knocked into the drift constantly, so a #12-16 green caddis larva dead-drifted along the bottom works in any month, and West Michigan TU singles out a green Rhyacophila larva as effective for Muskegon steelhead. Fish it as a point fly under an indicator or in a Euro rig, especially in winter and spring when little else is hatching. Adults are not a significant Michigan surface hatch.",
    sources: [
      {
        title: "Schrems West Michigan TU, Nymph Fishing for Steelhead",
        url: "https://swmtu.org/fishing/nymph-fishing-for-steelhead",
      },
      UMMZ_TRICHOPTERA,
    ],
  },
  {
    id: "white-miller",
    commonName: "White Miller",
    aliases: ["White Miller Caddis", "Nectopsyche"],
    scientificName: "Nectopsyche spp. (N. albida on the Muskegon)",
    order: "caddis",
    hookSizes: [12, 14, 16],
    colors: ["white to cream body", "white wing with fine dark speckling", "pale larva in a long thin case"],
    window: { start: "07-01", end: "09-30" },
    timeOfDay: ["afternoon", "dusk", "night"],
    keyStages: ["pupa", "adult"],
    trigger: {
      dateDriven: true,
      notes: `Trails to Trout baseline 7/1-9/30, afternoons; the Muskegon chart shows White Miller #14 at dark from late September into October and the Superior Flies U.P. chart runs it 5/29-11/13. ${CADDIS_DATE_NOTE}`,
    },
    evidence: "A",
    regions: [],
    description:
      "A pale, almost white caddis of July through September that shows in the afternoon on the northern rivers and swarms at dark on the Muskegon in early fall. It is easy to confuse with the White Fly mayfly in August; the caddis has tent wings and a jerky flight. Fish a #14 white or cream elk-hair caddis or a pale X-caddis at dusk, and a cream pupa swung through the tail-outs just before dark. The Rifle River shops list white millers among the summer hatches.",
    sources: [
      TRAILS_TO_TROUT,
      GRAY_DRAKE_LODGE,
      SUPERIOR_FLIES,
      {
        title: "DIY Fly Fishing, Rifle River Michigan",
        url: "https://diyflyfishing.com/rifle-river-michigan/",
      },
      HOUGHTON_2015,
    ],
  },
  {
    id: "october-caddis",
    commonName: "October Caddis",
    aliases: ["Great Autumn Brown Sedge", "Giant Autumn Sedge", "Pumpkin Caddis", "Pycnopsyche"],
    scientificName: "Pycnopsyche lepida (and P. guttifer, P. subfasciata)",
    order: "caddis",
    hookSizes: [8, 10, 12, 14],
    colors: ["reddish-brown to orange-brown body (about 20 mm)", "mottled brown wing", "larva in a wood or pebble case"],
    window: { start: "08-01", peakStart: "09-20", peakEnd: "10-20", end: "10-31" },
    timeOfDay: ["evening", "morning"],
    keyStages: ["larva", "pupa", "adult"],
    trigger: {
      dateDriven: true,
      notes: `Adult records for P. lepida are mostly August (31%), September (28%), July (24%) and October (10%); Michigan charts list the fishable hatch late September through October. The Trails to Trout row (7/20-1/30) is a chart artifact and is not used as the window. ${CADDIS_DATE_NOTE}`,
    },
    evidence: "A",
    regions: [],
    description:
      "The big orange-brown caddis of fall, the Midwest's most abundant Pycnopsyche, with adults active from August and the fishable hatch late September into October in the evening and early morning. Adults skitter and lay eggs on the surface at dusk, so a #10 orange-bodied Stimulator or a bushy elk-hair caddis twitched across the tail-outs draws big browns in the fall. Larvae in wood and pebble cases crawl in slow water and are worth imitating with a cased-caddis nymph. Not the western Dicosmoecus; Michigan's October Caddis is the Great Autumn Brown Sedge.",
    sources: [
      MOTOR_CITY,
      TRAILS_TO_TROUT,
      {
        title: "Troutnut, Pycnopsyche lepida (Great Autumn Brown Sedge)",
        url: "https://www.troutnut.com/hatch/2909/Caddisfly-Pycnopsyche-lepida-Great-Autumn-Brown-Sedge",
      },
      GRAY_DRAKE_LODGE,
      UMMZ_TRICHOPTERA,
      HOUGHTON_2015,
    ],
  },

  /* ---------------------------------------------------------------- */
  /* Stoneflies                                                        */
  /* ---------------------------------------------------------------- */
  {
    id: "tiny-black-stonefly",
    commonName: "Tiny Black Stonefly",
    aliases: ["Tiny Winter Black", "Snowfly", "Little Black Stonefly", "Allocapnia", "Capniidae"],
    scientificName: "Allocapnia spp. (A. granulata, A. pygmaea, A. vivipara, A. minima in Michigan)",
    order: "stonefly",
    hookSizes: [16, 18, 20],
    colors: ["black body", "dark gray wing folded flat", "nearly black nymph"],
    window: { start: "01-01", end: "04-30" },
    timeOfDay: ["midday", "afternoon"],
    keyStages: ["nymph", "adult"],
    trigger: {
      notes:
        "Nymphs start to stir when water temperature hits 36 F and are most active on warm, sunny afternoons from about 1 to 4 pm; nymphs migrate in the drift and crawl on shelf ice and snow along the banks. Weather-driven and hard to time; no degree-day model.",
    },
    evidence: "A",
    regions: [],
    description:
      "The first insect of the year: tiny black stoneflies crawling on shelf ice and bank snow from January into April, extremely abundant in Michigan's alkaline groundwater rivers. Nymphs migrate toward shore in the drift on warm afternoons, which makes a #16-18 black stonefly nymph a top winter and early-spring steelhead and trout fly on sunny days in clear water. Adults are on the water in the afternoon and occasionally bring trout up on the Muskegon tailwater. Fish it as a point fly with an egg on a dropper for steelhead, and best around 1-4 pm.",
    sources: [
      TRAILS_TO_TROUT,
      SUPERIOR_FLIES,
      {
        title: "Hallowed Waters, Cold Stoned",
        url: "https://hallowedwaters.com/2024/03/cold-stoned/",
        year: 2024,
      },
      {
        title: "Current Works, Top 5 Steelhead Flies for Michigan",
        url: "https://www.current-works.com/fly-fishing-articles/top-5-steelhead-flies/",
      },
      {
        title: "Schrems West Michigan TU, Nymph Fishing for Steelhead",
        url: "https://swmtu.org/fishing/nymph-fishing-for-steelhead",
      },
      UMMZ_PLECOPTERA,
    ],
  },
  {
    id: "early-black-stonefly",
    commonName: "Early Black Stonefly",
    aliases: ["Early Black Stone", "Black Willowfly", "Taeniopteryx", "Winter Stonefly"],
    scientificName: "Taeniopteryx nivalis (also T. burksi, T. parvula)",
    order: "stonefly",
    hookSizes: [10, 12, 14, 16],
    colors: ["black to very dark brown body", "dark smoky wing", "dark brown-black nymph"],
    window: { start: "02-21", end: "04-30" },
    timeOfDay: ["midday", "afternoon"],
    keyStages: ["nymph", "adult"],
    trigger: {
      notes:
        "Weather-driven and described as extremely difficult to predict; peak emergence February through May with nymphs stirring at 36 F water and adults most active 1-4 pm on warm, sunny afternoons. Females perform egg-laying flights with wings beating continuously. No degree-day model.",
    },
    evidence: "A",
    regions: [],
    description:
      "The bigger early black stone, #10-14, emerging from late February through April on warm afternoons and the first insect that Michigan steelhead see in numbers. Nymphs crawl to shore to emerge and drift heavily beforehand, so a weighted black stonefly nymph such as the Sly Stone Wiggle drifted along the banks is the main fly; on the Muskegon and Pere Marquette it fishes from mid-February. When females return to lay eggs on sunny afternoons, trout and even steelhead will take a #12-14 black CDC-wing adult skated on the surface. The Upper Manistee lists early black stones as its April hatch.",
    sources: [
      TRAILS_TO_TROUT,
      SUPERIOR_FLIES,
      MOTOR_CITY,
      {
        title: "Gray Drake Lodge, The Early Black Stonefly Hatch",
        url: "http://graydrakelodgeandoutfitters.blogspot.com/2020/03/the-early-black-stonefly-hatch-more.html",
        year: 2020,
      },
      {
        title: "Hallowed Waters, Cold Stoned",
        url: "https://hallowedwaters.com/2024/03/cold-stoned/",
        year: 2024,
      },
      {
        title: "Current Works, Top 5 Steelhead Flies for Michigan",
        url: "https://www.current-works.com/fly-fishing-articles/top-5-steelhead-flies/",
      },
      CURRENT_WORKS_MANISTEE,
    ],
  },
  {
    id: "early-brown-stonefly",
    commonName: "Early Brown Stonefly",
    aliases: ["Early Brown Stone", "Strophopteryx", "Willowfly"],
    scientificName: "Strophopteryx fasciata and Taeniopteryx spp. (identity inferred; no Michigan source names it)",
    order: "stonefly",
    hookSizes: [10, 12, 14],
    colors: ["brown to reddish-brown body", "brown mottled wing", "brown nymph with banded legs"],
    window: { start: "03-15", end: "05-10" },
    timeOfDay: ["afternoon", "evening"],
    keyStages: ["nymph", "adult"],
    trigger: {
      notes:
        "No temperature threshold in any source; the Trails to Trout baseline is 3/15-5/10, 1-7 pm, and the Superior Flies U.P. window is 3/29-5/24. The species identity is an inference from the UMMZ Taeniopterygidae list.",
    },
    evidence: "A",
    regions: [],
    description:
      "The brown stonefly that follows the early blacks from mid-March into early May, on the water from early afternoon into evening. Nymphs crawl to the bank to emerge, so a #12 brown stonefly nymph drifted tight to the edges in the afternoon is the main fly; the adults matter mostly when females return to lay eggs on warm afternoons and a brown Stimulator or CDC stone twitched near the bank will draw a rise. It overlaps the first Hendricksons and Blue Quills in late April. Species identity has not been confirmed by any Michigan source.",
    sources: [TRAILS_TO_TROUT, SUPERIOR_FLIES, UMMZ_PLECOPTERA],
  },
  {
    id: "little-yellow-sally",
    commonName: "Little Yellow Sally",
    aliases: ["Yellow Sally", "Little Yellow Stonefly", "Isoperla"],
    scientificName: "Isoperla spp. (I. bilineata and 11 other Michigan species)",
    order: "stonefly",
    hookSizes: [10, 12, 14, 16],
    colors: ["yellow to yellow-olive body", "pale yellow wing", "red-orange egg sac tip (female)", "yellow-brown nymph"],
    window: { start: "05-01", end: "06-30" },
    timeOfDay: ["afternoon"],
    keyStages: ["nymph", "adult"],
    trigger: {
      notes:
        "No temperature threshold. Hatches sporadically from May through much of the summer; nymphs crawl toward calmer shoreline water before emerging and are dislodged into the drift. The Trails to Trout baseline row is 5/1-6/30; aggregator charts extend Yellow Sallies into August on the Au Sable and to July 31 on the Manistee.",
    },
    evidence: "A",
    regions: [],
    description:
      "A small yellow stonefly that trickles off on afternoons from May through June and sporadically into summer on the Upper Manistee, Au Sable, Jordan and Pine. Nymphs migrate to slow bank water before emergence, so drift a #12-14 yellow-brown stonefly nymph along the edges; the fishable surface event is females dipping to lay eggs in the afternoon, when a #14 yellow Stimulator or a yellow elk-hair caddis is a fine searching pattern. Motor City Anglers lists it late May through June at #12-14. On the Muskegon the chart's #14 golden stones are probably large Yellow Sallies.",
    sources: [
      TRAILS_TO_TROUT,
      MOTOR_CITY,
      {
        title: "Troutnut, Isoperla (Yellow Sallies)",
        url: "https://www.troutnut.com/hatch/1115/Stonefly-Isoperla-Yellow-Sallies",
      },
      CURRENT_WORKS_MANISTEE,
      {
        title: "DIY Fly Fishing, Jordan River Michigan",
        url: "https://diyflyfishing.com/jordan-river-michigan/",
      },
      {
        title: "Big Y Fly Co, Manistee River Michigan hatch chart",
        url: "https://bigyflyco.com/pages/manistee-river-michigan-hatch-chart",
      },
    ],
  },
  {
    id: "golden-stone",
    commonName: "Golden Stonefly",
    aliases: ["Golden Stone", "Big Golden Stonefly", "Acroneuria", "Paragnetina"],
    scientificName: "Acroneuria lycorias, A. abnormis and Paragnetina media",
    order: "stonefly",
    hookSizes: [4, 6, 8],
    colors: ["golden-brown to amber body", "tan mottled wing", "banded yellow-brown nymph with dark markings"],
    window: { start: "05-15", end: "08-07" },
    timeOfDay: ["night", "morning"],
    keyStages: ["nymph", "adult"],
    trigger: {
      notes:
        "No temperature threshold. Acroneuria lycorias emerges early June through mid-July in the Midwest by crawling out on shore in early morning, afternoon or evening; nymphs migrate from riffles to slower bank water before emergence. The Trails to Trout chart lists Golden Stonefly #4-6 from 5/15-6/30 and Big Golden Stonefly #6-8 from 6/21-8/7; the window spans both rows.",
    },
    evidence: "A",
    regions: [],
    description:
      "Michigan's large golden stoneflies emerge from mid-May through early August by crawling out on shore at night and around dawn, so the nymph is the fished stage. Nymphs spend two or more years in the riffles and migrate to slower bank water before emergence; a #6-8 golden stonefly nymph fished tight to the banks in June is a proven big-trout fly, and Hawkins' Mattress Thrasher covers the adult. Egg-laying adults on summer evenings can bring up big fish where they are locally abundant. Paragnetina media is common in Michigan collections but no source gives it separate dates.",
    sources: [
      TRAILS_TO_TROUT,
      SUPERIOR_FLIES,
      {
        title: "Troutnut, Acroneuria lycorias (Golden Stone)",
        url: "https://www.troutnut.com/hatch/1042/Stonefly-Acroneuria-lycorias-Golden-Stone",
      },
      GRAY_DRAKE_LODGE,
      {
        title: "Hawkins Outfitters, Fly Patterns for Michigan Hatches",
        url: "https://hawkinsoutfitters.com/fly-patterns-for-michigan-hatches/",
      },
      UMMZ_PLECOPTERA,
    ],
  },
  {
    id: "giant-black-stone",
    commonName: "Giant Black Stonefly",
    aliases: ["Giant Stonefly", "Salmonfly (eastern)", "Pteronarcys", "Giant Stone"],
    scientificName: "Pteronarcys dorsata",
    order: "stonefly",
    hookSizes: [2, 4, 6, 8],
    colors: ["dark brown to black body", "dark smoky wing (up to 2 inches)", "dark brown nymph with orange at the leg joints"],
    window: { start: "05-15", end: "06-30" },
    timeOfDay: ["night", "dusk"],
    keyStages: ["nymph", "adult"],
    trigger: {
      notes:
        "No Michigan temperature threshold. Nymphs take 2-4 years and emerge at night, sporadically; the Muskegon chart calls it not a major hatch but effective after dark in June. A western Pteronarcys californica study found no peak emergence below 8.4 C, but that is a different species and river network.",
    },
    evidence: "A",
    regions: [],
    description:
      "The largest Michigan stonefly, up to two inches, widespread in the state but mostly nocturnal, so it is generally fished as a nymph rather than a hatch. On the Pine River, the coldest, fastest river in the Lower Peninsula, Pteronarcys nymphs #2-6 are the staple food and the best big-rainbow fly; on the Au Sable, guides note stoneflies producing quality trout in early May. Emergence is sporadic and after dark from mid-May through June, when a big dark adult fished after dark on the Muskegon or Manistee can move a large brown. Dead-drift a heavy #4-6 black stonefly nymph along the bottom of fast runs any month of the year.",
    sources: [
      TRAILS_TO_TROUT,
      SUPERIOR_FLIES,
      MOTOR_CITY,
      {
        title: "Troutnut, Pteronarcys dorsata (Giant Black Stonefly)",
        url: "https://www.troutnut.com/hatch/975/Stonefly-Pteronarcys-dorsata-Giant-Black-Stonefly",
      },
      {
        title: "Hawkins Outfitters, Pine River",
        url: "https://hawkinsoutfitters.com/pine-river/",
      },
      GRAY_DRAKE_LODGE,
      {
        title: "Frontiers in Ecology & Evolution 2023, Pteronarcys californica emergence across a river network (non-Michigan)",
        url: "https://www.frontiersin.org/journals/ecology-and-evolution/articles/10.3389/fevo.2023.804143/full",
        year: 2023,
      },
      UMMZ_PLECOPTERA,
    ],
  },

  /* ---------------------------------------------------------------- */
  /* Midges and other Diptera                                          */
  /* ---------------------------------------------------------------- */
  {
    id: "midge",
    commonName: "Midge",
    aliases: ["Chironomid", "Buzzer", "Black Midge"],
    scientificName: "Chironomidae (species not identified by any Michigan river source)",
    order: "midge",
    hookSizes: [20, 22, 24, 26, 28],
    colors: ["black body", "olive to gray body", "cream body", "red larva (bloodworm)"],
    window: { start: "01-01", end: "12-31" },
    timeOfDay: ["afternoon", "all-day"],
    keyStages: ["larva", "pupa", "emerger", "adult"],
    trigger: {
      notes:
        "Present year-round; heaviest surface activity on warm afternoons near springs. The Trails to Trout baseline row is 6/1-10/30 (the Superior Flies U.P. row 6/15-11/13), but the Muskegon tailwater chart shows midges as the main winter surface food November through April and FlyFishFinder lists midges year-round, so the window is the full year.",
    },
    evidence: "A",
    regions: [],
    description:
      "Midges hatch every month of the year and are the main winter surface food on the Muskegon and Manistee tailwaters, where trout rise to #20-24 black midges on warm afternoons near springs from mid-December through April. On the northern rivers the charts list them June through October, but they are a fallback whenever nothing larger is hatching. Fish a black or olive midge larva or pupa (Zebra Midge) under an indicator by day, and a Griffith's Gnat or a tiny CDC emerger to sipping fish in the afternoon. Winter fishing peaks around 4 pm when water temperature rises slightly.",
    sources: [
      TRAILS_TO_TROUT,
      SUPERIOR_FLIES,
      GRAY_DRAKE_LODGE,
      FLYFISHFINDER_MI,
      {
        title: "Schrems West Michigan TU, Nymph Fishing for Steelhead",
        url: "https://swmtu.org/fishing/nymph-fishing-for-steelhead",
      },
    ],
  },
  {
    id: "crane-fly",
    commonName: "Crane Fly",
    aliases: ["Yellow Crane Fly", "Tipulidae", "Crane Fly Larva"],
    scientificName: "Tipulidae (Tipula and related genera; species not identified by Michigan sources)",
    order: "other",
    hookSizes: [8, 10, 12, 14, 16],
    colors: ["yellow to tan adult", "long pale legs", "gray-olive to tan grub-like larva"],
    window: { start: "05-15", end: "07-08" },
    timeOfDay: ["evening", "dusk"],
    keyStages: ["larva", "adult"],
    trigger: {
      notes:
        "No temperature threshold. The only Michigan timing is the Muskegon chart's yellow crane flies #16 hatching along with the Sulphurs (third week of May through June on that tailwater); the northern-LP window is aligned to the Sulphur baseline. Larvae are most useful in high water when they are dislodged.",
    },
    evidence: "A",
    regions: [],
    description:
      "Yellow crane flies show up with the Sulphurs in late May and June, and their long-legged, pale yellow adults skittering on the surface are often confused with mayflies. Adults are a minor surface food, but a #16 yellow crane fly or a light-colored skater can take fish that ignore the sulphur duns at dusk. The larger value is the larva: a one- to three-inch grub-like larva that lives in silt and bank mud and washes into the drift in high water, when a #8-12 crane fly larva dead-drifted deep is worth a try. Not treated as a major hatch by any Michigan source.",
    sources: [
      GRAY_DRAKE_LODGE,
      {
        title: "Dakota Angler, Cranefly Larva",
        url: "https://flyfishsd.com/blogs/blog/cranefly-larva-crane-fly-nymph",
      },
      {
        title: "Orvis, Swimming Crane Fly Larva",
        url: "https://howtoflyfish.orvis.com/fly-tying-videos/nymph-flies/831-swimming_crane_fly_larva",
      },
    ],
  },
];

export const hatches: Hatch[] = HatchList.parse(raw);
export const hatchById = new Map(hatches.map((h) => [h.id, h]));
