"use client";

import dynamic from "next/dynamic";

import { Skeleton } from "@/components/ui/Skeleton";
import { useFilterStore } from "@/store/filter.store";
import { formatTimeRange } from "@/lib/timeRange";

import { DashboardSkeleton } from "../DashboardSkeleton";
import {
  ActivityFeed,
  StatsOverview,
  TimeRangeFilter,
  TopBreakdown,
} from "./components";
import {
  useFilteredServers,
  useNewServersTrend,
  useServers,
  useServerStats,
} from "./hooks";

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
  },
);

export function DashboardView() {
  const { servers, activities, isLoading } = useServers();
  const { filteredServers, newServers, filteredActivities } = useFilteredServers(
    servers,
    activities,
  );
  // Every panel reads the same filtered window so the dashboard is consistent.
  // `useNewServersTrend` still needs the raw set so it can compare the current
  // window against the previous one.
  const stats = useServerStats(filteredServers);
  const newTrend = useNewServersTrend(servers, newServers.length);
  const timeRange = useFilterStore((s) => s.timeRange);
  const rangeLabel = formatTimeRange(timeRange);

  if (isLoading) return <DashboardSkeleton />;

  return (
    <div className={styles.root}>
      <TimeRangeFilter />

      <StatsOverview
        stats={stats}
        totalInRange={filteredServers.length}
        newCount={newServers.length}
        newTrend={newTrend}
        rangeLabel={rangeLabel}
      />

      <ServerGlobe
        servers={filteredServers}
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
