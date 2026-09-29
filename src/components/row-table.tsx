import type { ReactNode } from "react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { cn } from "@/lib/utils";

export interface RowFact {
  label: string;
  value: ReactNode;
  /** Extra classes for the desktop cell (mono, nowrap, alignment). */
  cellClassName?: string;
}

export interface RowTableRow {
  key: string;
  /** The row's subject: species, hatch, reach. First column on desktop, the heading on phones. */
  title: ReactNode;
  /** Optional wide element (the month strip) that gets its own full-width line on phones. */
  strip?: ReactNode;
  facts: RowFact[];
}

/**
 * A data table that stays a table where there is room and becomes a stacked
 * list on phones: title line, the month strip across the full width, then
 * label and value pairs. One source of rows, two layouts, no sideways scroll.
 */
export function RowTable({
  titleLabel,
  stripLabel,
  factLabels,
  rows,
  className,
  titleClassName,
  stripClassName,
}: {
  titleLabel: string;
  stripLabel?: string;
  /** Column headers for the facts, in the same order as each row's facts. */
  factLabels: string[];
  rows: RowTableRow[];
  className?: string;
  titleClassName?: string;
  stripClassName?: string;
}) {
  return (
    <div className={cn("min-w-0", className)}>
      {/* Phones: stacked rows */}
      <ol className="divide-y divide-border overflow-hidden rounded-lg border border-border sm:hidden">
        {rows.map((r) => (
          <li key={r.key} className="space-y-2 p-3">
            <div className="text-sm">{r.title}</div>
            {r.strip ? <div className="min-w-0">{r.strip}</div> : null}
            {r.facts.length ? (
              <dl className="grid grid-cols-[minmax(4.5rem,auto)_minmax(0,1fr)] gap-x-3 gap-y-1 text-xs">
                {r.facts.map((f) => (
                  <div key={f.label} className="contents">
                    <dt className="text-muted-foreground">{f.label}</dt>
                    <dd className="min-w-0 break-words">{f.value}</dd>
                  </div>
                ))}
              </dl>
            ) : null}
          </li>
        ))}
      </ol>

      {/* Tablet and up: the table */}
      <div className="hidden overflow-x-auto rounded-lg border border-border sm:block">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className={titleClassName}>{titleLabel}</TableHead>
              {stripLabel ? <TableHead className={cn("min-w-64", stripClassName)}>{stripLabel}</TableHead> : null}
              {factLabels.map((l) => (
                <TableHead key={l}>{l}</TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            {rows.map((r) => (
              <TableRow key={r.key}>
                <TableCell className={cn("whitespace-normal", titleClassName)}>{r.title}</TableCell>
                {stripLabel ? <TableCell className={stripClassName}>{r.strip}</TableCell> : null}
                {r.facts.map((f) => (
                  <TableCell key={f.label} className={cn("whitespace-normal", f.cellClassName)}>
                    {f.value}
                  </TableCell>
                ))}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
