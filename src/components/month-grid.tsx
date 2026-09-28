import { MONTH_SHORT } from "@/lib/season";
import { cn } from "@/lib/utils";

/**
 * Twelve-cell month strip. `active` months are filled, `peak` months are emphasized,
 * and `highlight` marks the month being asked about.
 */
export function MonthGrid({
  active,
  peak = [],
  highlight,
  className,
  compact = false,
}: {
  active: number[];
  peak?: number[];
  highlight?: number;
  className?: string;
  compact?: boolean;
}) {
  const activeSet = new Set(active);
  const peakSet = new Set(peak);
  return (
    <ol className={cn("grid grid-cols-12 gap-0.5", className)} aria-label="Months">
      {MONTH_SHORT.map((label, i) => {
        const m = i + 1;
        const isActive = activeSet.has(m);
        const isPeak = peakSet.has(m);
        return (
          <li
            key={label}
            title={`${label}${isPeak ? " (peak)" : isActive ? " (active)" : ""}`}
            className={cn(
              "flex items-center justify-center rounded-sm border text-[10px] font-mono uppercase",
              compact ? "h-5" : "h-7",
              isPeak
                ? "border-primary bg-primary text-primary-foreground"
                : isActive
                  ? "border-primary/30 bg-primary/15 text-foreground"
                  : "border-border/60 text-muted-foreground/60",
              highlight === m && "ring-2 ring-ring ring-offset-1 ring-offset-background",
            )}
          >
            {compact ? label[0] : label}
          </li>
        );
      })}
    </ol>
  );
}
