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
import { formatDateTime } from "@/lib/date";

import styles from "./styles.module.css";

interface ActivityItemProps {
  event: ActivityEvent;
}

const ICON_MAP: Record<
  ActivityType,
  { icon: LucideIcon; tone: string }
> = {
  created: { icon: PlusCircle, tone: styles.toneCreated },
  removed: { icon: Trash2, tone: styles.toneRemoved },
  alias_changed: { icon: PencilLine, tone: styles.toneAliasChanged },
  status_changed: { icon: Power, tone: styles.toneStatusChanged },
  updated: { icon: CircleCheck, tone: styles.toneUpdated },
};

const FALLBACK = { icon: CircleAlert, tone: styles.toneFallback };

export const ActivityItem = memo(function ActivityItem({
  event,
}: ActivityItemProps) {
  const visual = ICON_MAP[event.type] ?? FALLBACK;
  const Icon = visual.icon;

  return (
    <li className={styles.item}>
      <div className={cn(styles.iconBubble, visual.tone)}>
        <Icon className={styles.icon} aria-hidden />
      </div>
      <div className={styles.body}>
        <p className={styles.message}>{event.message}</p>
        <time dateTime={event.timestamp} className={styles.time}>
          {formatDateTime(event.timestamp)}
        </time>
      </div>
    </li>
  );
});
