import { cn } from "@/lib/utils";
import { TroutLogo } from "./trout-logo";

/** The enamel sign over the counter: leaping trout, script wordmark, a spaced caps line. */
export function TroutSign({ className, compact = false }: { className?: string; compact?: boolean }) {
  return (
    <div className={cn("wall-sign", compact && "wall-sign-compact", className)}>
      <div className="wall-sign-inner">
        <TroutLogo className={compact ? "mx-auto max-w-[140px]" : "mx-auto max-w-[260px]"} />
        <p className="wall-sign-script">Michigan Flies</p>
        {!compact ? <p className="wall-sign-line">Hand-tied for Michigan rivers</p> : null}
      </div>
      <Screw className="wall-sign-screw wall-sign-screw-tl" />
      <Screw className="wall-sign-screw wall-sign-screw-tr" />
      <Screw className="wall-sign-screw wall-sign-screw-bl" />
      <Screw className="wall-sign-screw wall-sign-screw-br" />
    </div>
  );
}

/** A drawn slotted screw head in the same ink as the woodcut. */
function Screw({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 14 14" className={className} aria-hidden="true" focusable="false">
      <circle cx="7" cy="7" r="6" fill="var(--trout-belly)" stroke="currentColor" strokeWidth="1.6" />
      <path d="M3.6 9.4 L 10.4 4.6" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
    </svg>
  );
}
