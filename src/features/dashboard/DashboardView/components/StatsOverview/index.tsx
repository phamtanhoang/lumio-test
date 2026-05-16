"use client";

import { Activity, Eye, Sparkles, Users } from "lucide-react";

import type { TrendDelta } from "@/hooks/useNewServersTrend";
import type { ServerStats } from "@/hooks/useServerStats";
import { formatNumber, formatPercent } from "@/lib/format";

import { StatCard, type StatCardProps } from "./components";

import styles from "./styles.module.css";

interface StatsOverviewProps {
  stats: ServerStats;
  newCount: number;
  newTrend?: TrendDelta;
}

const Icon = {
  Servers: <Users className={styles.icon} aria-hidden />,
  Online: <Eye className={styles.icon} aria-hidden />,
  Offline: <Activity className={styles.icon} aria-hidden />,
  New: <Sparkles className={styles.icon} aria-hidden />,
};

function buildCards(
  stats: ServerStats,
  newCount: number,
  newTrend?: TrendDelta
): StatCardProps[] {
  const safeTotal = Math.max(stats.total, 1);

  return [
    {
      label: "Servers",
      value: formatNumber(stats.total),
      badge: { text: "Live", tone: "new" },
      icon: Icon.Servers,
      hint: "Across all regions",
    },
    {
      label: "Online",
      value: formatNumber(stats.online),
      icon: Icon.Online,
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
      ...(newTrend
        ? { trend: { ...newTrend, label: "vs prior window" } }
        : { hint: "Within the selected window" }),
    },
  ];
}

export function StatsOverview({
  stats,
  newCount,
  newTrend,
}: StatsOverviewProps) {
  return (
    <section aria-label="Server statistics overview" className={styles.section}>
      {buildCards(stats, newCount, newTrend).map((card) => (
        <StatCard key={card.label} {...card} />
      ))}
    </section>
  );
}
