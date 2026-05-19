"use client";

import { Activity, Eye, Sparkles, Users } from "lucide-react";

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
  Online: <Eye className={styles.icon} aria-hidden />,
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

  return [
    {
      label: "Servers",
      value: formatNumber(totalInRange),
      badge: { text: "Live", tone: "new" },
      icon: Icon.Servers,
      tone: "primary",
      hint: `as of ${rangeLabel}`,
    },
    {
      label: "Online",
      value: formatNumber(stats.online),
      icon: Icon.Online,
      tone: "success",
      trend: {
        direction: "up",
        value: stats.total === 0 ? 0 : stats.online / safeTotal,
        label: `${formatPercent(stats.online, stats.total)} of fleet`,
      },
    },
    {
      label: "Offline",
      value: formatNumber(stats.offline),
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
