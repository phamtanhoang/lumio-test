import { memo } from "react";

import type { TopEntry } from "@/features/dashboard/lib";
import { cn } from "@/lib/cn";
import { formatNumber } from "@/lib/format";

import styles from "./styles.module.css";

interface TopBreakdownItemProps {
  entry: TopEntry<string>;
  rank: number;
}

export const TopBreakdownItem = memo(function TopBreakdownItem({
  entry,
  rank,
}: TopBreakdownItemProps) {
  const percent = Math.round(entry.share * 100);

  return (
    <li className={styles.item}>
      <div className={styles.row}>
        <span className={styles.label}>
          <span
            className={cn(styles.rank, rank === 1 ? styles.first : styles.rest)}
          >
            {rank}
          </span>
          {entry.key}
        </span>
        <span className={styles.count}>{formatNumber(entry.count)}</span>
      </div>
      <div
        className={styles.track}
        role="progressbar"
        aria-valuenow={percent}
        aria-valuemin={0}
        aria-valuemax={100}
      >
        <div className={styles.bar} style={{ width: `${percent}%` }} />
      </div>
    </li>
  );
});
