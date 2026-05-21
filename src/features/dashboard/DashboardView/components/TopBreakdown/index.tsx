import { memo } from "react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { InfoIcon } from "@/components/ui/InfoIcon";
import { type TopEntry } from "@/lib/topByField";

import { TopBreakdownItem } from "./components";

import styles from "./styles.module.css";

interface TopBreakdownProps {
  title: string;
  entries: TopEntry<string>[];
  description?: string;
  emptyLabel?: string;
}

export const TopBreakdown = memo(function TopBreakdown({
  title,
  entries,
  description,
  emptyLabel = "No data",
}: TopBreakdownProps) {
  return (
    <Card>
      <CardHeader>
        <div className={styles.titleRow}>
          <CardTitle>{title}</CardTitle>
          {description ? <InfoIcon content={description} /> : null}
        </div>
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
