"use client";

import { Activity, Eye, Sparkles, Users } from "lucide-react";

import type { ServerStats } from "@/features/dashboard/hooks";
import { formatNumber, formatPercent } from "@/lib/format";

import { StatCard } from "./components";

import styles from "./styles.module.css";

interface StatsOverviewProps {
  stats: ServerStats;
  newCount: number;
  newTrend?: { direction: "up" | "down"; value: number };
}

export function StatsOverview({
  stats,
  newCount,
  newTrend,
}: StatsOverviewProps) {
  return (
    <section aria-label="Server statistics overview" className={styles.section}>
      <StatCard
        label="Servers"
        value={formatNumber(stats.total)}
        badge={{ text: "Live", tone: "new" }}
        icon={<Users className={styles.icon} aria-hidden />}
        hint="Across all regions"
      />
      <StatCard
        label="Online"
        value={formatNumber(stats.online)}
        icon={<Eye className={styles.icon} aria-hidden />}
        // Trend = share of total. Up direction since "more online = healthier".
        trend={{
          direction: "up",
          value:
            stats.total === 0 ? 0 : stats.online / Math.max(stats.total, 1),
          label: `${formatPercent(stats.online, stats.total)} of fleet`,
        }}
      />
      <StatCard
        label="Offline"
        value={formatNumber(stats.offline)}
        icon={<Activity className={styles.icon} aria-hidden />}
        trend={
          stats.offline > 0
            ? {
                direction: "down",
                value: stats.offline / Math.max(stats.total, 1),
                label: "needs attention",
              }
            : undefined
        }
        hint={stats.offline === 0 ? "All healthy" : undefined}
      />
      <StatCard
        label="New"
        value={formatNumber(newCount)}
        badge={{ text: "Beta", tone: "beta" }}
        icon={<Sparkles className={styles.icon} aria-hidden />}
        trend={newTrend ? { ...newTrend, label: "vs prior window" } : undefined}
        hint={newTrend ? undefined : "Within the selected window"}
      />
    </section>
  );
}
