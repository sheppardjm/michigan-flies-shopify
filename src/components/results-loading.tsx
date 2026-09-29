/**
 * The wait for fly finder results, shown as the shop's chalkboard being
 * written: a small engraved fly is drawn on stroke by stroke, and beneath it
 * the steps the server is actually taking appear one at a time in chalk.
 * Everything is CSS-timed to the typical wait, not tied to real progress, so
 * the last line holds until the results replace the board. Reduced motion
 * shows all lines at once with no drawing. A server component: no state.
 */
const STEPS = [
  "Reading the hatch calendar for this river and date",
  "Checking the USGS gauge and degree days",
  "Weighing eggs, forage and hatches for your fish",
  "Ranking the box for your setup",
];

export function ResultsLoading({ river, live }: { river: string; live: boolean }) {
  const steps = live ? STEPS : STEPS.filter((s) => !s.includes("gauge"));

  return (
    <div className="grid grid-cols-[minmax(0,1fr)] gap-8 lg:grid-cols-[minmax(0,1fr)_320px]" aria-busy="true">
      <section className="board results-board p-6 sm:p-8" role="status" aria-live="polite" aria-label="Finding your flies">
        {/* The chalk edge filter, so this board's marks are roughened like the home board's. */}
        <svg width="0" height="0" className="absolute" aria-hidden="true" focusable="false">
          <filter id="chalk-rough" x="-10%" y="-40%" width="120%" height="180%">
            <feTurbulence type="fractalNoise" baseFrequency="0.9 1.6" numOctaves="2" seed="7" result="noise" />
            <feDisplacementMap in="SourceGraphic" in2="noise" scale="2.2" xChannelSelector="R" yChannelSelector="G" />
          </filter>
        </svg>
        <div className="results-board-inner">
          <svg viewBox="0 0 240 120" className="results-board-fly" aria-hidden="true" focusable="false">
            <g fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round">
              {/* hook */}
              <path className="stroke s1" d="M178 26 v 38 c 0 20 -18 32 -38 30 c -14 -1.5 -22 -12 -20 -24" strokeWidth="2.4" />
              <circle className="stroke s1" cx="178" cy="21" r="4.5" strokeWidth="2.2" />
              <path className="stroke s2" d="M118 70 l 8 -9" strokeWidth="2.2" />
              {/* body */}
              <path className="stroke s3" d="M124 44 L 178 40" strokeWidth="7" />
              <path className="stroke s4" d="M130 44 c -4 -14 2 -22 7 -24 c 5 2 10 10 7 24" strokeWidth="1.8" />
              {/* hackle */}
              <path className="stroke s5" d="M128 42 l -7 -18 M133 41 l -1 -20 M139 40 l 6 -19 M144 40 l 12 -15 M126 44 l -16 4 M147 42 l 16 6 M136 46 l -2 18 M143 45 l 6 17" strokeWidth="1.6" />
              {/* tail */}
              <path className="stroke s6" d="M178 40 l 26 14 M178 40 l 28 6 M178 40 l 22 20" strokeWidth="1.6" />
            </g>
          </svg>
          <p className="board-title text-lg sm:text-xl">Finding your flies</p>
          <p className="results-board-river live">{river}</p>
          <ol className="results-board-steps">
            {steps.map((s, i) => (
              <li key={s} style={{ "--i": i, "--n": steps.length } as React.CSSProperties}>
                <span className="results-board-tick" aria-hidden="true">
                  ✓
                </span>
                <span className="results-board-text">{s}</span>
              </li>
            ))}
          </ol>
        </div>
      </section>
      <aside className="results-loading-aside" aria-hidden="true">
        <div className="results-loading-card" />
        <div className="results-loading-card short" />
      </aside>
    </div>
  );
}
