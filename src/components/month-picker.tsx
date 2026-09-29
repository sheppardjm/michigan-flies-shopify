import Link from "next/link";
import { MONTH_NAMES, MONTH_SHORT } from "@/lib/season";
import { cn } from "@/lib/utils";

/**
 * Twelve month links that set `?month=` on `basePath`. The current month links
 * to the bare path so "now" keeps one canonical URL.
 */
export function MonthPicker({ basePath, selected, current, className }: { basePath: string; selected: number; current: number; className?: string }) {
  return (
    <nav aria-label="Month" className={className}>
      <ol className="grid grid-cols-6 gap-1 sm:grid-cols-12">
        {MONTH_SHORT.map((label, i) => {
          const m = i + 1;
          const isSelected = m === selected;
          return (
            <li key={label}>
              <Link
                href={m === current ? basePath : `${basePath}?month=${m}`}
                scroll={false}
                aria-current={isSelected ? "page" : undefined}
                aria-label={`${MONTH_NAMES[i]}${m === current ? " (this month)" : ""}`}
                className={cn(
                  "relative flex h-8 items-center justify-center rounded-md border font-mono text-xs uppercase transition-colors",
                  isSelected ? "border-primary bg-primary text-primary-foreground" : "border-border hover:bg-muted",
                )}
              >
                {label}
                {m === current ? (
                  <span aria-hidden className={cn("absolute bottom-1 size-1 rounded-full", isSelected ? "bg-primary-foreground" : "bg-primary")} />
                ) : null}
              </Link>
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
