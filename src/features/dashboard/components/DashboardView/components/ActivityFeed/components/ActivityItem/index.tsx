import {
  CircleAlert,
  CircleCheck,
  PencilLine,
  PlusCircle,
  Power,
  Trash2,
  type LucideIcon,
} from "lucide-react";
import { memo } from "react";
import type {
  ActivityEvent,
  ActivityType,
} from "@/features/dashboard/types";
import { cn } from "@/lib/cn";
import { formatDateTime } from "@/features/dashboard/lib";

interface ActivityItemProps {
  event: ActivityEvent;
}

const ICON_MAP: Record<
  ActivityType,
  { icon: LucideIcon; className: string }
> = {
  created: { icon: PlusCircle, className: "text-success bg-success/10" },
  removed: { icon: Trash2, className: "text-danger bg-danger/10" },
  alias_changed: { icon: PencilLine, className: "text-primary bg-primary/10" },
  status_changed: { icon: Power, className: "text-warning bg-warning/10" },
  updated: { icon: CircleCheck, className: "text-muted-foreground bg-muted" },
};

const FALLBACK = { icon: CircleAlert, className: "text-muted-foreground bg-muted" };

export const ActivityItem = memo(function ActivityItem({
  event,
}: ActivityItemProps) {
  const visual = ICON_MAP[event.type] ?? FALLBACK;
  const Icon = visual.icon;

  return (
    <li className="flex items-start gap-3 py-3 first:pt-0 last:pb-0">
      <div
        className={cn(
          "mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-full",
          visual.className
        )}
      >
        <Icon className="h-4 w-4" aria-hidden />
      </div>
      <div className="min-w-0 flex-1">
        <p className="truncate text-sm font-medium">{event.message}</p>
        <time
          dateTime={event.timestamp}
          className="text-xs text-muted-foreground"
        >
          {formatDateTime(event.timestamp)}
        </time>
      </div>
    </li>
  );
});
