import { Badge } from "@/components/ui/badge";
import type { WindowStatus } from "@/lib/season";
import { cn } from "@/lib/utils";

const LABELS: Record<WindowStatus, string> = {
  peak: "Peak",
  active: "Hatching",
  approaching: "Starting soon",
  off: "Out of season",
};

const STYLES: Record<WindowStatus, string> = {
  peak: "bg-primary text-primary-foreground",
  active: "border-primary/40 bg-primary/10 text-primary",
  approaching: "border-border bg-muted text-foreground",
  off: "border-border text-muted-foreground",
};

export function StatusBadge({ status, className }: { status: WindowStatus; className?: string }) {
  return (
    <Badge variant="outline" className={cn(STYLES[status], className)}>
      {LABELS[status]}
    </Badge>
  );
}
