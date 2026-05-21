"use client";

import { Activity, Sparkles, Users } from "lucide-react";

import { CircleProgress } from "@/components/ui/CircleProgress";
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
  rangeLabel: string;
}

const Icon = {
  Servers: <Users className={styles.icon} aria-hidden />,
  Offline: <Activity className={styles.icon} aria-hidden />,
  New: <Sparkles className={styles.icon} aria-hidden />,
};

function buildCards(
  stats: ServerStats,
  totalInRange: number,
  newCount: number,
  rangeLabel: string,
  newTrend?: TrendDelta
): StatCardProps[] {
  const safeTotal = Math.max(stats.total, 1);
  const onlineRate = stats.total === 0 ? 0 : stats.online / safeTotal;

  return [
    {
      label: "Servers",
      value: formatNumber(totalInRange),
      description: "Total servers that exist within the selected window.",
      valueTooltip: `${formatNumber(totalInRange)} servers as of ${rangeLabel}.`,
      badge: { text: "Live", tone: "new" },
      icon: Icon.Servers,
      tone: "primary",
      hint: `as of ${rangeLabel}`,
    },
    {
      label: "Online",
      value: formatNumber(stats.online),
      description: "Servers currently reporting online status.",
      valueTooltip: `${formatNumber(stats.online)} of ${formatNumber(stats.total)} servers (${formatPercent(stats.online, stats.total)}) currently online.`,
      tone: "success",
      // Progress ring replaces the static icon bubble so the Online card
      // visualises the online ratio rather than just stating it.
      iconSlot: (
        <CircleProgress
          size={44}
          stroke={4}
          value={onlineRate}
          trackClassName="text-success/15"
          barClassName="text-success"
          label={`${formatPercent(stats.online, stats.total)} online`}
        >
          <span className={styles.ringText}>
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
      value: formatNumber(stats.offline),
      description: "Servers reporting offline status — investigate if non-zero.",
      valueTooltip: `${formatNumber(stats.offline)} of ${formatNumber(stats.total)} servers (${formatPercent(stats.offline, stats.total)}) currently offline${stats.offline > 0 ? " — needs attention" : ""}.`,
      icon: Icon.Offline,
      tone: stats.offline > 0 ? "danger" : "success",
      ...(stats.offline > 0
        ? {
            trend: {
              direction: "down",
              value: stats.offline / safeTotal,
              label: "needs attention",
            },
          }
        : { hint: "All healthy" }),
    },
    {
      label: "New",
      value: formatNumber(newCount),
      description: "Servers newly created within the selected window.",
      valueTooltip: `${formatNumber(newCount)} new server${newCount === 1 ? "" : "s"} created${newTrend ? ` (${newTrend.direction === "up" ? "+" : "−"}${(newTrend.value * 100).toFixed(0)}% vs prior window)` : ""}.`,
      badge: { text: "Beta", tone: "beta" },
      icon: Icon.New,
      tone: "beta",
      ...(newTrend
        ? { trend: { ...newTrend, label: "vs prior window" } }
        : { hint: `created in ${rangeLabel}` }),
    },
  ];
}

export function StatsOverview({
  stats,
  totalInRange,
  newCount,
  newTrend,
  rangeLabel,
}: StatsOverviewProps) {
  return (
    <section aria-label="Server statistics overview" className={styles.section}>
      {buildCards(stats, totalInRange, newCount, rangeLabel, newTrend).map(
        (card) => (
          <StatCard key={card.label} {...card} />
        )
      )}
    </section>
  );
}
