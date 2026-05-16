import { MoreVertical, TrendingDown, TrendingUp } from "lucide-react";
import { memo, type ReactNode } from "react";

import { Card } from "@/components/ui/Card";
import { cn } from "@/lib/cn";

import styles from "./styles.module.css";

export interface StatTrend {
  direction: "up" | "down";
  value: number;
  label: string;
}

export interface StatCardProps {
  label: string;
  value: ReactNode;
  hint?: string;
  badge?: { text: string; tone?: "new" | "beta" };
  icon?: ReactNode;
  trend?: StatTrend;
}

const BADGE_TONE: Record<NonNullable<StatCardProps["badge"]>["tone"] & string, string> = {
  new: styles.badgeNew,
  beta: styles.badgeBeta,
};

function formatTrendPercent(value: number): string {
  return (value * 100).toFixed(1).replace(/\.0$/, "");
}

export const StatCard = memo(function StatCard({
  label,
  value,
  hint,
  badge,
  icon,
  trend,
}: StatCardProps) {
  const TrendIcon = trend?.direction === "down" ? TrendingDown : TrendingUp;
  const trendTone = trend?.direction === "down" ? styles.trendDown : styles.trendUp;

  return (
    <Card className={styles.card}>
      <div className={styles.head}>
        <div className={styles.labelRow}>
          <p className={styles.label}>{label}</p>
          {badge ? (
            <span className={cn(styles.badge, BADGE_TONE[badge.tone ?? "new"])}>
              {badge.text}
            </span>
          ) : null}
        </div>
        <button type="button" aria-label="More options" className={styles.moreBtn}>
          <MoreVertical className={styles.iconSm} aria-hidden />
        </button>
      </div>

      <p className={styles.value}>{value}</p>

      <div className={styles.footer}>
        <div className={styles.footerText}>
          {trend ? (
            <span className={styles.trendWrap}>
              <TrendIcon className={cn(styles.trendIcon, trendTone)} aria-hidden />
              <span className={cn(styles.trendValue, trendTone)}>
                {trend.direction === "down" ? "−" : "+"}
                {formatTrendPercent(trend.value)}%
              </span>
              <span className={styles.muted}>{trend.label}</span>
            </span>
          ) : hint ? (
            <span className={styles.muted}>{hint}</span>
          ) : null}
        </div>
        {icon ? <div className={styles.iconBubble}>{icon}</div> : null}
      </div>
    </Card>
  );
});
