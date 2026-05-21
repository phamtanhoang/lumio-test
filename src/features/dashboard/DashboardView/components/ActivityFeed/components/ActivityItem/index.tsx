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

import { Tooltip } from "@/components/ui/Tooltip";
import type {
  ActivityEvent,
  ActivityType,
} from "@/types/server.types";
import { formatDateTime } from "@/lib/date";
import { cn } from "@/lib/cn";

import styles from "./styles.module.css";

interface ActivityItemProps {
  event: ActivityEvent;
}

const ICON_MAP: Record<
  ActivityType,
  { icon: LucideIcon; tone: string; label: string }
> = {
  created: { icon: PlusCircle, tone: styles.toneCreated, label: "Server created" },
  removed: { icon: Trash2, tone: styles.toneRemoved, label: "Server removed" },
  alias_changed: { icon: PencilLine, tone: styles.toneAliasChanged, label: "Alias changed" },
  status_changed: { icon: Power, tone: styles.toneStatusChanged, label: "Status changed" },
  updated: { icon: CircleCheck, tone: styles.toneUpdated, label: "Updated" },
};

const FALLBACK = { icon: CircleAlert, tone: styles.toneFallback, label: "Event" };

export const ActivityItem = memo(function ActivityItem({
  event,
}: ActivityItemProps) {
  const visual = ICON_MAP[event.type] ?? FALLBACK;
  const Icon = visual.icon;
  const tooltipContent = `${visual.label} · ${event.serverName} · ${formatDateTime(event.timestamp)}`;

  return (
    <li className={styles.item}>
      <div className={cn(styles.iconBubble, visual.tone)}>
        <Icon className={styles.icon} aria-hidden />
      </div>
      <div className={styles.body}>
        <Tooltip
          content={tooltipContent}
          position="top"
          align="start"
          className={styles.messageWrap}
        >
          <span className={styles.message}>{event.message}</span>
        </Tooltip>
        <time dateTime={event.timestamp} className={styles.time}>
          {formatDateTime(event.timestamp)}
        </time>
      </div>
    </li>
  );
});
