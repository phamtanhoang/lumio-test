import { Info, TrendingDown, TrendingUp } from "lucide-react";
import { memo, type ReactNode } from "react";

import { Card } from "@/components/ui/Card";
import { Tooltip } from "@/components/ui/Tooltip";
import { cn } from "@/lib/cn";

import styles from "./styles.module.css";

export interface StatTrend {
  direction: "up" | "down";
  value: number;
  label: string;
}

export type StatTone = "primary" | "success" | "danger" | "beta";

export interface StatCardProps {
  label: string;
  value: ReactNode;
  hint?: string;
  // Concise "what is this section" line shown on the (i) icon next to the
  // label. No numbers — keep it descriptive only.
  description?: string;
  // Detailed breakdown shown when hovering the value itself. Contains the
  // actual numbers / ratios.
  valueTooltip?: string;
  badge?: { text: string; tone?: "new" | "beta" };
  icon?: ReactNode;
  // Replaces the default icon bubble entirely — use for richer visuals like
  // a progress ring while keeping the rest of the card shape.
  iconSlot?: ReactNode;
  trend?: StatTrend;
  tone?: StatTone;
}

const BADGE_TONE: Record<NonNullable<StatCardProps["badge"]>["tone"] & string, string> = {
  new: styles.badgeNew,
  beta: styles.badgeBeta,
};

const ICON_TONE: Record<StatTone, string> = {
  primary: styles.iconBubblePrimary,
  success: styles.iconBubbleSuccess,
  danger: styles.iconBubbleDanger,
  beta: styles.iconBubbleBeta,
};

const CARD_TONE: Record<StatTone, string> = {
  primary: styles.cardPrimary,
  success: styles.cardSuccess,
  danger: styles.cardDanger,
  beta: styles.cardBeta,
};

function formatTrendPercent(value: number): string {
  return (value * 100).toFixed(1).replace(/\.0$/, "");
}

export const StatCard = memo(function StatCard({
  label,
  value,
  hint,
  description,
  valueTooltip,
  badge,
  icon,
  iconSlot,
  trend,
  tone,
}: StatCardProps) {
  const TrendIcon = trend?.direction === "down" ? TrendingDown : TrendingUp;
  const trendTone = trend?.direction === "down" ? styles.trendDown : styles.trendUp;

  return (
    <Card className={cn(styles.card, tone ? CARD_TONE[tone] : undefined)}>
      <div className={styles.head}>
        <div className={styles.labelRow}>
          <p className={styles.label}>{label}</p>
          {badge ? (
            <span className={cn(styles.badge, BADGE_TONE[badge.tone ?? "new"])}>
              {badge.text}
            </span>
          ) : null}
          {description ? (
            <Tooltip content={description} position="bottom">
              <button
                type="button"
                aria-label={`About ${label}`}
                className={styles.infoBtn}
              >
                <Info className={styles.infoIcon} aria-hidden />
              </button>
            </Tooltip>
          ) : null}
        </div>
        {iconSlot ?? (icon ? (
          <div
            className={cn(styles.iconBubble, tone ? ICON_TONE[tone] : undefined)}
          >
            {icon}
          </div>
        ) : null)}
      </div>

      <p className={styles.value}>
        {valueTooltip ? (
          <Tooltip content={valueTooltip}>
            <span>{value}</span>
          </Tooltip>
        ) : (
          value
        )}
      </p>

      <div className={styles.footer}>
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
    </Card>
  );
});
