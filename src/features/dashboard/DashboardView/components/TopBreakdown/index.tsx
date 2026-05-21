import { memo } from "react";

import { AnimatedNumber } from "@/components/ui/AnimatedNumber";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { Donut } from "@/components/ui/Donut";
import { InfoIcon } from "@/components/ui/InfoIcon";
import { cn } from "@/lib/cn";
import { formatPercent } from "@/lib/format";
import { type TopEntry } from "@/lib/topByField";

import { TopBreakdownItem } from "./components";

import styles from "./styles.module.css";

export type TopBreakdownTheme = "primary" | "emerald" | "amber";

const THEME_CLASS: Record<TopBreakdownTheme, string> = {
  primary: styles.themePrimary,
  emerald: styles.themeEmerald,
  amber: styles.themeAmber,
};

// Top 3 donut segments share the primary hue with stepping opacity (darker
// → lighter). Rank 4+ uses a muted grey so they read as "the long tail".
const RANK_DONUT_CLASS = [
  styles.donutFirst,
  styles.donutSecond,
  styles.donutThird,
];

interface TopBreakdownProps {
  title: string;
  entries: TopEntry<string>[];
  // Full fleet total — `entries` is sliced to top N upstream, so we need this
  // separately to draw the donut against the whole population (and surface a
  // muted "Other" wedge for the long tail).
  total: number;
  // Theme picks the accent palette (purple / green / amber). Each card on the
  // dashboard gets its own theme so they read as distinct sections.
  theme?: TopBreakdownTheme;
  description?: string;
  emptyLabel?: string;
}

export const TopBreakdown = memo(function TopBreakdown({
  title,
  entries,
  total,
  theme = "primary",
  description,
  emptyLabel = "No data",
}: TopBreakdownProps) {
  const entriesSum = entries.reduce((acc, e) => acc + e.count, 0);
  const otherCount = Math.max(0, total - entriesSum);

  const segments = entries.map((entry, i) => ({
    value: entry.count,
    className: RANK_DONUT_CLASS[i] ?? styles.donutRest,
    label: `${entry.key}: ${entry.count} (${formatPercent(entry.count, total)})`,
  }));
  if (otherCount > 0) {
    segments.push({
      value: otherCount,
      className: styles.donutOther,
      label: `Other: ${otherCount} (${formatPercent(otherCount, total)})`,
    });
  }

  const top = entries[0];

  return (
    <Card className={cn(styles.card, THEME_CLASS[theme])}>
      <CardHeader>
        <div className={styles.titleRow}>
          <CardTitle>{title}</CardTitle>
          {description ? <InfoIcon content={description} /> : null}
        </div>
      </CardHeader>
      <CardContent className={styles.content}>
        {entries.length === 0 ? (
          <p className={styles.empty}>{emptyLabel}</p>
        ) : (
          <>
            <div className={styles.donutRow}>
              <Donut
                segments={segments}
                size={96}
                thickness={10}
                centerLabel={
                  <>
                    <span className={styles.donutTotal}>
                      <AnimatedNumber value={total} />
                    </span>
                    <span className={styles.donutHint}>servers</span>
                  </>
                }
              />
              {top ? (
                <div className={styles.leadBlock}>
                  <p className={styles.leadEyebrow}>Leader</p>
                  <p className={styles.leadKey}>{top.key}</p>
                  <p className={styles.leadStat}>
                    <AnimatedNumber value={top.count} />
                    <span className={styles.leadSep}>·</span>
                    <span className={styles.leadPercent}>
                      {formatPercent(top.count, total)}
                    </span>
                  </p>
                </div>
              ) : null}
            </div>

            <ul className={styles.list}>
              {entries.map((entry, i) => (
                <TopBreakdownItem key={entry.key} entry={entry} rank={i + 1} />
              ))}
            </ul>
          </>
        )}
      </CardContent>
    </Card>
  );
});
