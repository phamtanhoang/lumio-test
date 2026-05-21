import { memo } from "react";

import { Tooltip } from "@/components/ui/Tooltip";
import { cn } from "@/lib/cn";
import { formatNumber } from "@/lib/format";
import type { TopEntry } from "@/lib/topByField";

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
  const isFirst = rank === 1;

  return (
    <li className={cn(styles.item, isFirst && styles.itemFirst)}>
      <div className={styles.row}>
        <span className={cn(styles.label, isFirst && styles.labelFirst)}>
          <span className={cn(styles.rank, isFirst ? styles.rankFirst : styles.rankRest)}>
            {rank}
          </span>
          {entry.key}
        </span>
        <Tooltip
          position="top"
          align="end"
          content={`${formatNumber(entry.count)} servers running ${entry.key} (${percent}% of fleet).`}
        >
          <span className={cn(styles.count, isFirst && styles.countFirst)}>
            {formatNumber(entry.count)}
          </span>
        </Tooltip>
      </div>
      <div
        className={cn(styles.track, isFirst && styles.trackFirst)}
        role="progressbar"
        aria-valuenow={percent}
        aria-valuemin={0}
        aria-valuemax={100}
      >
        <div
          className={cn(styles.bar, isFirst && styles.barFirst)}
          style={{ width: `${percent}%` }}
        />
      </div>
    </li>
  );
});
