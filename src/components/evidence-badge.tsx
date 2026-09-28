import { Badge } from "@/components/ui/badge";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { EVIDENCE_LABELS, type Evidence } from "@/data";
import { cn } from "@/lib/utils";

const STYLES: Record<Evidence, string> = {
  S: "border-emerald-600/40 bg-emerald-600/10 text-emerald-800 dark:text-emerald-300",
  A: "border-amber-600/40 bg-amber-600/10 text-amber-800 dark:text-amber-300",
  I: "border-border bg-muted text-muted-foreground",
};

export function EvidenceBadge({ evidence, className }: { evidence: Evidence; className?: string }) {
  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <Badge variant="outline" className={cn("font-mono", STYLES[evidence], className)} aria-label={EVIDENCE_LABELS[evidence]}>
          {evidence}
        </Badge>
      </TooltipTrigger>
      <TooltipContent>{EVIDENCE_LABELS[evidence]}</TooltipContent>
    </Tooltip>
  );
}
