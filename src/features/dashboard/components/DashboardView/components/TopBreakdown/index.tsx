import { memo } from "react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { type TopEntry } from "@/features/dashboard/lib";

import { TopBreakdownItem } from "./components";

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
              <TopBreakdownItem key={entry.key} entry={entry} rank={i + 1} />
            ))}
          </ul>
        )}
      </CardContent>
    </Card>
  );
});
