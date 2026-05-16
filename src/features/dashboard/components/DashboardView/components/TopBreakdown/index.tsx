import { memo } from "react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { type TopEntry } from "@/features/dashboard/lib";
import { cn } from "@/lib/cn";
import { formatNumber } from "@/lib/format";

import styles from "./styles.module.css";

interface TopBreakdownProps {
  title: string;
  entries: TopEntry<string>[];
  emptyLabel?: string;
}

export const TopBreakdown = memo(function TopBreakdown({
  title,
  entries,
  emptyLabel = "No data",
}: TopBreakdownProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
      </CardHeader>
      <CardContent>
        {entries.length === 0 ? (
          <p className={styles.empty}>{emptyLabel}</p>
        ) : (
          <ul className={styles.list}>
            {entries.map((entry, i) => (
              <li key={entry.key} className={styles.item}>
                <div className={styles.row}>
                  <span className={styles.label}>
                    <span
                      className={cn(
                        styles.rank,
                        i === 0 ? styles.rankFirst : styles.rankRest,
                      )}
                    >
                      {i + 1}
                    </span>
                    {entry.key}
                  </span>
                  <span className={styles.count}>
                    {formatNumber(entry.count)}
                  </span>
                </div>
                <div
                  className={styles.track}
                  role="progressbar"
                  aria-valuenow={Math.round(entry.share * 100)}
                  aria-valuemin={0}
                  aria-valuemax={100}
                >
                  <div
                    className={styles.bar}
                    style={{ width: `${entry.share * 100}%` }}
                  />
                </div>
              </li>
            ))}
          </ul>
        )}
      </CardContent>
    </Card>
  );
});
