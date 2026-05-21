"use client";

import { Users } from "lucide-react";

import { AnimatedNumber } from "@/components/ui/AnimatedNumber";
import { CircleProgress } from "@/components/ui/CircleProgress";
import { Sparkline } from "@/components/ui/Sparkline";
import type { TrendDelta } from "@/features/dashboard/DashboardView/hooks/useNewServersTrend";
import type { ServerStats } from "@/features/dashboard/DashboardView/hooks/useServerStats";
import { formatNumber, formatPercent } from "@/lib/format";

import { StatCard, type StatCardProps } from "./components";

import styles from "./styles.module.css";

interface StatsOverviewProps {
  stats: ServerStats;
  totalInRange: number;
  newCount: number;
  newTrend?: TrendDelta;
  // Bucketed series for the sparkline visualization on the New card.
  newSeries: ReadonlyArray<number>;
  rangeLabel: string;
}

const Icon = {
  Servers: <Users className={styles.icon} aria-hidden />,
};

function buildCards(
  stats: ServerStats,
  totalInRange: number,
  newCount: number,
  newSeries: ReadonlyArray<number>,
  rangeLabel: string,
  newTrend?: TrendDelta
): StatCardProps[] {
  const safeTotal = Math.max(stats.total, 1);
  const onlineRate = stats.total === 0 ? 0 : stats.online / safeTotal;
  const offlineRate = stats.total === 0 ? 0 : stats.offline / safeTotal;
  // Sparkline needs at least 2 points; fall back to a flat line otherwise.
  const sparkData =
    newSeries.length >= 2 ? newSeries : [newCount, newCount];

  return [
    {
      label: "Servers",
      value: <AnimatedNumber value={totalInRange} format={formatNumber} />,
      description: "Total servers that exist within the selected window.",
      valueTooltip: `${formatNumber(totalInRange)} servers as of ${rangeLabel}.`,
      badge: { text: "Live", tone: "new" },
      icon: Icon.Servers,
      tone: "primary",
      // Mobile drops the "as of" prefix to fit the date range in a narrow
      // card; desktop keeps the full natural-language phrase.
      hint: (
        <>
          <span className="hidden sm:inline">as of </span>
          {rangeLabel}
        </>
      ),
    },
    {
      label: "Online",
      value: <AnimatedNumber value={stats.online} format={formatNumber} />,
      description: "Servers currently reporting online status.",
      valueTooltip: `${formatNumber(stats.online)} of ${formatNumber(stats.total)} servers (${formatPercent(stats.online, stats.total)}) currently online.`,
      tone: "success",
      iconSlot: (
        <CircleProgress
          size={44}
          stroke={4}
          value={onlineRate}
          trackClassName="text-success/15"
          barClassName="text-success"
          label={`${formatPercent(stats.online, stats.total)} online`}
        >
          <span className={styles.ringTextSuccess}>
            {Math.round(onlineRate * 100)}%
          </span>
        </CircleProgress>
      ),
      trend: {
        direction: "up",
        value: onlineRate,
        label: `${formatPercent(stats.online, stats.total)} of fleet`,
      },
    },
    {
      label: "Offline",
      value: <AnimatedNumber value={stats.offline} format={formatNumber} />,
      description: "Servers reporting offline status — investigate if non-zero.",
      valueTooltip: `${formatNumber(stats.offline)} of ${formatNumber(stats.total)} servers (${formatPercent(stats.offline, stats.total)}) currently offline${stats.offline > 0 ? " — needs attention" : ""}.`,
      tone: stats.offline > 0 ? "danger" : "success",
      // Symmetric ring to Online — visualizes the offline ratio in danger tone.
      iconSlot: (
        <CircleProgress
          size={44}
          stroke={4}
          value={offlineRate}
          trackClassName="text-danger/15"
          barClassName="text-danger"
          label={`${formatPercent(stats.offline, stats.total)} offline`}
        >
          <span className={styles.ringTextDanger}>
            {Math.round(offlineRate * 100)}%
          </span>
        </CircleProgress>
      ),
      ...(stats.offline > 0
        ? {
            trend: {
              direction: "down",
              value: offlineRate,
              label: "needs attention",
            },
          }
        : { hint: "All healthy" }),
    },
    {
      label: "New",
      value: <AnimatedNumber value={newCount} format={formatNumber} />,
      description: "Servers newly created within the selected window.",
      valueTooltip: `${formatNumber(newCount)} new server${newCount === 1 ? "" : "s"} created${newTrend ? ` (${newTrend.direction === "up" ? "+" : "−"}${(newTrend.value * 100).toFixed(0)}% vs prior window)` : ""}.`,
      badge: { text: "Beta", tone: "beta" },
      tone: "beta",
      // Sparkline replaces the static icon — visualises how creations were
      // distributed across the window instead of just stating the total.
      iconSlot: (
        <Sparkline
          data={sparkData}
          width={72}
          height={32}
          className="text-fuchsia-500"
          label={`Created over ${rangeLabel}`}
        />
      ),
      ...(newTrend
        ? { trend: { ...newTrend, label: "vs prior window" } }
        : {
            hint: (
              <>
                <span className="hidden sm:inline">created in </span>
                {rangeLabel}
              </>
            ),
          }),
    },
  ];
}

export function StatsOverview({
  stats,
  totalInRange,
  newCount,
  newTrend,
  newSeries,
  rangeLabel,
}: StatsOverviewProps) {
  return (
    <section aria-label="Server statistics overview" className={styles.section}>
      {buildCards(stats, totalInRange, newCount, newSeries, rangeLabel, newTrend).map(
        (card) => (
          <StatCard key={card.label} {...card} />
        )
      )}
    </section>
  );
}
