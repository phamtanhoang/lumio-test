"use client";

import dynamic from "next/dynamic";
import { useMemo } from "react";

import { Skeleton } from "@/components/ui/Skeleton";
import {
  useFilteredServers,
  useServerStats,
  useServers,
} from "@/features/dashboard/hooks";
import { isWithin, resolveTimeRange } from "@/features/dashboard/lib";
import { useFilterStore } from "@/features/dashboard/store";

import { DashboardSkeleton } from "../DashboardSkeleton";
import {
  ActivityFeed,
  StatsOverview,
  TimeRangeFilter,
  TopBreakdown,
} from "./components";

import styles from "./styles.module.css";

const ServerGlobe = dynamic(
  () => import("./components/ServerGlobe").then((m) => m.ServerGlobe),
  {
    ssr: false,
    loading: () => (
      <div className={styles.mapSkeleton}>
        <Skeleton className={styles.mapSkeletonInner} />
      </div>
    ),
  }
);

export function DashboardView() {
  const { servers, activities, isLoading } = useServers();
  const stats = useServerStats(servers);
  const { newServers, filteredActivities } = useFilteredServers(
    servers,
    activities
  );
  const timeRange = useFilterStore((s) => s.timeRange);

  const newTrend = useMemo(() => {
    if (servers.length === 0) return undefined;
    const resolved = resolveTimeRange(timeRange);
    const windowMs = resolved.to.getTime() - resolved.from.getTime();
    if (windowMs <= 0) return undefined;
    const priorTo = resolved.from;
    const priorFrom = new Date(priorTo.getTime() - windowMs);
    const prior = servers.filter((s) =>
      isWithin(s.createdAt, { from: priorFrom, to: priorTo })
    ).length;
    if (prior === 0) {
      return newServers.length > 0
        ? ({ direction: "up", value: 1 } as const)
        : undefined;
    }
    const delta = (newServers.length - prior) / prior;
    return {
      direction: delta >= 0 ? ("up" as const) : ("down" as const),
      value: Math.min(Math.abs(delta), 9.99),
    };
  }, [servers, newServers.length, timeRange]);

  if (isLoading) {
    return <DashboardSkeleton />;
  }

  return (
    <div className={styles.root}>
      <TimeRangeFilter />

      <StatsOverview
        stats={stats}
        newCount={newServers.length}
        newTrend={newTrend}
      />

      <ServerGlobe
        servers={servers}
        topCountries={stats.topCountries}
        total={stats.total}
      />

      <div className={styles.breakdowns}>
        <TopBreakdown title="Top operating systems" entries={stats.topOS} />
        <TopBreakdown title="Top platforms" entries={stats.topPlatform} />
        <TopBreakdown title="Top architectures" entries={stats.topArch} />
      </div>

      <ActivityFeed events={filteredActivities} />
    </div>
  );
}
