"use client";

import dynamic from "next/dynamic";

import { Skeleton } from "@/components/ui/Skeleton";

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
  const stats = useServerStats(servers);
  const { newServers, filteredActivities } = useFilteredServers(
    servers,
    activities,
  );
  const newTrend = useNewServersTrend(servers, newServers.length);

  if (isLoading) return <DashboardSkeleton />;

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
