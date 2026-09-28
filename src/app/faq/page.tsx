import type { Metadata } from "next";
import Link from "next/link";
import { TECHNIQUE_DESCRIPTIONS, TECHNIQUE_LABELS, Technique } from "@/data";

export const metadata: Metadata = {
  title: "FAQ and glossary",
  description: "Common questions about the fly finder and hatch calendar, and a glossary of fly fishing terms: setups, rigging, water, bugs, and fish.",
};

const LINK = "underline underline-offset-2 hover:text-primary";

interface Term {
  id: string;
  term: string;
  definition: React.ReactNode;
}

/** When each setup on the fly finder card earns its place. Keyed to Technique so a new setup needs an entry here. */
const SETUP_WHEN: Record<Technique, string> = {
  "dry-fly": "Pick it when fish are rising: a hatch is on, spinners are falling at dusk, or hoppers are blowing into the water in late summer.",
  "nymph-indicator": "The all-round choice when nothing is rising. Most of what trout eat is under the surface, and the indicator shows you the take.",
  "euro-nymph": "Best in pocket water and fast runs you can wade close to. You feel and see the take through the sighter instead of an indicator.",
  streamer: "For big browns and aggressive fish, especially in high or stained water, on cloudy days, and at first and last light.",
  "swing-spey": "The classic way to cover big water for steelhead and salmon: cast across, let the current swing the fly, take a step, repeat.",
  "chuck-and-duck": "A Michigan steelhead and salmon method for deep, fast runs with a single-hand rod. Check the gear rules for the water you fish.",
  mousing: "Summer nights for the biggest brown trout, which feed after dark. Learn the pool in daylight first.",
};

const SETUPS: Term[] = Technique.options.map((t) => ({
  id: t,
  term: TECHNIQUE_LABELS[t],
  definition: (
    <>
      {TECHNIQUE_DESCRIPTIONS[t]} {SETUP_WHEN[t]}
    </>
  ),
}));

const ON_THE_LINE: Term[] = [
  { id: "fly-line", term: "Fly line", definition: "The heavy, coated line that carries the cast. A fly rod throws the weight of the line, not the weight of the fly." },
  {
    id: "weight",
    term: "Weight (rod and line)",
    definition: "A number from 1 to 14 that matches rod to line. 3 to 5 weight suits trout dries and nymphs, 6 to 8 streamers and salmon, 7 to 9 steelhead.",
  },
  { id: "floating-line", term: "Floating line", definition: "Line that rides on the surface. Used for dries, indicator nymphing, and mousing." },
  {
    id: "sink-tip",
    term: "Sink-tip and sinking line",
    definition: "Line whose front section, or whole length, sinks so a streamer or swung fly gets down to the fish.",
  },
  {
    id: "skagit-scandi",
    term: "Skagit and Scandi heads",
    definition: "Short shooting heads for two-hand rods. A Skagit head is short and heavy for sink-tips and big flies; a Scandi head is longer and lighter for floating lines and smaller flies.",
  },
  {
    id: "running-line",
    term: "Running line",
    definition: "Thin line behind a shooting head, or the monofilament main line in chuck and duck, that lets the cast travel further.",
  },
  { id: "backing", term: "Backing", definition: "Thin, strong line under the fly line on the reel, there for a fish that runs further than the fly line is long." },
  { id: "leader", term: "Leader", definition: "The clear, tapered monofilament between fly line and fly. It turns the fly over on the cast and keeps the thick line away from the fish." },
  {
    id: "tippet",
    term: "Tippet and X sizes",
    definition: "The thinnest, last section of leader that you tie the fly to. It is sized in X: the higher the number, the finer the line. 5X to 7X for small trout flies, 3X to 4X for streamers, 0X to 2X for steelhead and salmon.",
  },
  {
    id: "sighter",
    term: "Sighter",
    definition: "A section of brightly colored monofilament in a Euro nymphing leader. You watch it for the pause or twitch that means a fish.",
  },
  {
    id: "strike-indicator",
    term: "Strike indicator",
    definition: "A small float on the leader that suspends nymphs at a set depth and dips or stops when a fish takes. The fly fisher's bobber.",
  },
  { id: "split-shot", term: "Split shot", definition: "Small weights pinched onto the leader above the flies to get them down." },
  {
    id: "slinky",
    term: "Slinky and pencil lead",
    definition: "Chuck-and-duck weights. A slinky is lead shot in a sleeve of parachute cord; pencil lead is lead wire in rubber tubing. Both bounce along the bottom without snagging as often.",
  },
  {
    id: "dropper",
    term: "Dropper",
    definition: "A second fly tied off the first, usually on a short length of tippet from the hook bend. A dry-dropper hangs a nymph under a floating dry, which doubles as the indicator.",
  },
  {
    id: "tungsten-bead",
    term: "Beadhead and tungsten",
    definition: "A metal bead at the head of a fly that adds weight. Tungsten is much denser than brass, so the fly sinks faster at the same size.",
  },
  { id: "hook-size", term: "Hook size (#)", definition: "Written as #14 or size 14. The bigger the number, the smaller the hook: a #20 midge is tiny, a #4 streamer is large." },
];

const ON_THE_WATER: Term[] = [
  {
    id: "tailwater",
    term: "Tailwater",
    definition: (
      <>
        The river below a dam. Water released from the reservoir runs cooler in summer and warmer in winter than a free-flowing river, so fish feed and bugs
        hatch year-round. Michigan&apos;s best known are the Muskegon below Croton Dam and the Big Manistee below Tippy Dam, where midges, scuds, and blue-winged
        olives carry trout through the winter.
      </>
    ),
  },
  {
    id: "groundwater-river",
    term: "Groundwater river and spring creek",
    definition: "A river fed mostly by springs, so its temperature and flow stay steady through the year. The Au Sable and Pere Marquette are Michigan's classic examples; they respond slowly to warm or cold spells.",
  },
  {
    id: "freestone",
    term: "Freestone or runoff river",
    definition: "A river fed mostly by rain and snowmelt. It rises, falls, warms, and cools quickly with the weather.",
  },
  { id: "riffle", term: "Riffle", definition: "Shallow, fast water with a broken surface over gravel. Bug factories, and where trout feed in the morning and evening." },
  { id: "run", term: "Run", definition: "Deeper, steady water below a riffle. Holds fish most of the day and is the usual water for nymphing and swinging." },
  { id: "pool", term: "Pool", definition: "The deep, slow section of a river. Big fish rest here, and it is where you mouse at night." },
  { id: "pocket-water", term: "Pocket water", definition: "Fast water broken up by boulders, with small slow pockets behind each rock where fish hold." },
  { id: "seam", term: "Seam", definition: "The line where fast and slow current meet. Fish sit in the slow side and eat what the fast side brings them." },
  { id: "tailout", term: "Tailout", definition: "Where a pool shallows and speeds up before the next riffle. Steelhead and trout often spawn here." },
  {
    id: "dead-drift",
    term: "Dead drift",
    definition: "Letting a fly float or sink at exactly the speed of the current, with no pull from the line, the way a real insect drifts.",
  },
  { id: "mend", term: "Mend", definition: "Flipping the line upstream or downstream after the cast so the current doesn't drag the fly." },
  { id: "drag", term: "Drag", definition: "The unnatural skate of a fly pulled by the line. Trout notice it. Also the brake on your reel." },
  { id: "swing", term: "Swing", definition: "Casting across the current and letting the line carry the fly in an arc across the river, the heart of spey fishing." },
  { id: "strip", term: "Strip", definition: "Pulling line in by hand in short tugs so a streamer darts like a baitfish." },
];

const BUGS_AND_FLIES: Term[] = [
  { id: "hatch", term: "Hatch", definition: "When aquatic insects rise from the river bottom and emerge as winged adults, often in numbers that set fish feeding." },
  { id: "mayfly", term: "Mayfly", definition: "Upright-winged insect with two or three long tails. Hendricksons, sulphurs, blue-winged olives, and the Hex are all mayflies." },
  { id: "caddis", term: "Caddis", definition: "Moth-like insect with tent-shaped wings. Larvae build cases from pebbles or plant bits on the river bottom." },
  { id: "stonefly", term: "Stonefly", definition: "A flat, two-tailed insect that crawls to the bank to hatch. Small black stones are Michigan's first bugs of the year, in late winter." },
  { id: "midge", term: "Midge", definition: "Tiny two-winged flies, often #20 and smaller. Winter food on the tailwaters." },
  {
    id: "hex",
    term: "Hex",
    definition: (
      <>
        <em>Hexagenia limbata</em>, Michigan&apos;s giant mayfly. It hatches after dark in June and early July and brings up the largest brown trout of the
        year.
      </>
    ),
  },
  { id: "nymph", term: "Nymph", definition: "The underwater stage of a mayfly or stonefly, and the flies tied to imitate it." },
  { id: "larva-pupa", term: "Larva and pupa", definition: "The underwater stages of caddis and midges. The pupa swims to the surface to hatch." },
  { id: "emerger", term: "Emerger", definition: "An insect caught in the surface film as it breaks out of its nymphal skin, and the flies that imitate that moment." },
  { id: "dun", term: "Dun", definition: "A newly hatched mayfly adult, drying its wings on the surface." },
  { id: "spinner-fall", term: "Spinner and spinner fall", definition: "The mature mayfly adult. After mating, spinners fall spent onto the water, usually at dusk, and trout sip them." },
  { id: "dry-fly-term", term: "Dry fly", definition: "A fly that floats on the surface, imitating an adult insect." },
  { id: "wet-fly", term: "Wet fly", definition: "A traditional fly fished just under the surface, often swung, imitating drowned or emerging insects." },
  { id: "streamer-term", term: "Streamer", definition: "A larger fly that imitates a baitfish, sculpin, or leech, fished by stripping or swinging." },
  { id: "terrestrial", term: "Terrestrial", definition: "Land insects that fall in: hoppers, ants, and beetles. Mid to late summer food." },
  { id: "egg-fly", term: "Egg fly", definition: "A fly imitating a single fish egg, drifted below spawning salmon, steelhead, or suckers." },
  { id: "attractor", term: "Attractor", definition: "A fly that imitates nothing in particular but draws strikes with color, flash, or silhouette." },
  { id: "scud-sowbug", term: "Scud and sowbug", definition: "Small freshwater crustaceans that live in weed beds. Year-round trout food on the tailwaters." },
  { id: "sculpin", term: "Sculpin", definition: "A small, big-headed bottom fish that big brown trout eat, and a classic streamer pattern." },
];

const FISH_AND_SEASONS: Term[] = [
  { id: "steelhead", term: "Steelhead", definition: "A rainbow trout that lives in the Great Lakes and runs up rivers to spawn, mostly from fall through spring." },
  { id: "salmon-run", term: "Run", definition: "The seasonal migration of steelhead, salmon, or suckers from the lakes into the rivers to spawn." },
  { id: "redd", term: "Redd", definition: "A spawning bed of cleaned gravel, usually in a tailout. Don't wade through redds or fish to fish sitting on them." },
  {
    id: "degree-days",
    term: "Degree days",
    definition: (
      <>
        A running total of warmth since January 1. Insects develop when water and air are warm enough, so degree days predict hatches better than dates.{" "}
        <Link href="/about-the-data" className={LINK}>
          How we use them
        </Link>.
      </>
    ),
  },
  { id: "catch-and-release", term: "Catch and release", definition: "Landing a fish quickly, keeping it wet, and letting it go. Barbless hooks make it easier." },
];

const GROUPS = [
  { id: "setups", title: "Setups on the fly finder", intro: "These are the choices under Setup on the “What should be on the end of my line?” card.", terms: SETUPS },
  { id: "on-the-line", title: "Rods, line, and rigging", intro: "What goes between the reel and the fly.", terms: ON_THE_LINE },
  { id: "on-the-water", title: "Water and presentation", intro: "Kinds of rivers, parts of a river, and how the fly moves in it.", terms: ON_THE_WATER },
  { id: "bugs-and-flies", title: "Bugs and flies", intro: "What trout eat, and the flies that imitate it.", terms: BUGS_AND_FLIES },
  { id: "fish-and-seasons", title: "Fish and seasons", intro: null, terms: FISH_AND_SEASONS },
];

const QUESTIONS: { q: string; a: React.ReactNode }[] = [
  {
    q: "How does the fly finder pick flies?",
    a: "It starts from what is likely hatching, spawning, or swimming on that river on that date, filters to the fish you chose, then ranks flies that suit the way you are rigged. Each fly in the box comes with the reason it made the list.",
  },
  {
    q: "Which setup should I choose?",
    a: (
      <>
        Pick the one that matches the rod and line you are carrying that day. If you are not sure, indicator nymphing works on more days and more rivers
        than anything else. The{" "}
        <a href="#setups" className={LINK}>
          setups in the glossary
        </a>{" "}
        describe each one.
      </>
    ),
  },
  {
    q: "How accurate are the hatch dates?",
    a: (
      <>
        They are windows, not appointments. They start from Au Sable and Manistee charts, shift by river, and adjust to this year&apos;s water temperature
        and degree days. Every claim is tagged by how well it is sourced.{" "}
        <Link href="/about-the-data" className={LINK}>
          About the data
        </Link>{" "}
        has the details.
      </>
    ),
  },
  {
    q: "Why is a fish faded out for my river?",
    a: "The fish options fade when no DNR weir count, stocking record, or reliable angler source puts that species in that river. You can still pick it; the results just have less to go on.",
  },
  {
    q: "Where do I check the fishing rules?",
    a: (
      <>
        Michigan&apos;s gear rules, seasons, and flies-only stretches change by river and by year. Confirm with the current{" "}
        <a
          href="https://www.michigan.gov/dnr/-/media/Project/Websites/dnr/Documents/LED/digests/2026-Michigan-Fishing-Regulations_web_accessible.pdf"
          className={LINK}
        >
          Michigan Fishing Regulations digest
        </a>{" "}
        before you fish.
      </>
    ),
  },
];

export default function FaqPage() {
  return (
    <div className="mx-auto w-full max-w-3xl space-y-12 px-4 py-8 sm:py-12">
      <div className="space-y-2">
        <h1 className="text-3xl font-semibold tracking-tight">FAQ and glossary</h1>
        <p className="max-w-2xl text-muted-foreground">Quick answers about how the site works, and plain definitions for the words fly fishers use.</p>
      </div>

      <section aria-labelledby="questions" className="space-y-5">
        <h2 id="questions" className="text-2xl font-semibold tracking-tight">
          Questions
        </h2>
        {QUESTIONS.map(({ q, a }) => (
          <div key={q} className="space-y-1.5">
            <h3 className="text-lg font-semibold">{q}</h3>
            <p className="leading-relaxed">{a}</p>
          </div>
        ))}
      </section>

      <section aria-labelledby="glossary" className="space-y-8">
        <div className="space-y-3">
          <h2 id="glossary" className="text-2xl font-semibold tracking-tight">
            Glossary
          </h2>
          <nav aria-label="Glossary sections" className="flex flex-wrap gap-2">
            {GROUPS.map((g) => (
              <a key={g.id} href={`#${g.id}`} className="rounded-full border border-ink/40 bg-card px-3 py-1 text-sm hover:border-ink">
                {g.title}
              </a>
            ))}
          </nav>
        </div>

        {GROUPS.map((g) => (
          <section key={g.id} aria-labelledby={g.id} className="space-y-3">
            <div className="space-y-1 border-b border-ink/20 pb-2">
              <h3 id={g.id} className="scroll-mt-24 text-xl font-semibold tracking-tight">
                {g.title}
              </h3>
              {g.intro ? <p className="text-sm text-muted-foreground">{g.intro}</p> : null}
            </div>
            <dl className="divide-y divide-ink/10">
              {g.terms.map((t) => (
                <div key={t.id} id={t.id} className="grid scroll-mt-24 gap-1 py-3 sm:grid-cols-[12rem_minmax(0,1fr)] sm:gap-6">
                  <dt className="font-semibold">{t.term}</dt>
                  <dd className="leading-relaxed">{t.definition}</dd>
                </div>
              ))}
            </dl>
          </section>
        ))}
      </section>
    </div>
  );
}
