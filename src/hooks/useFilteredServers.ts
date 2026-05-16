"use client";

import { useMemo } from "react";

import { useFilterStore } from "@/store/filter.store";
import type { ActivityEvent, Server } from "@/types/server.types";
import { isWithin, resolveTimeRange } from "@/lib/timeRange";

interface FilteredResult {
  filteredServers: Server[];
  newServers: Server[];
  filteredActivities: ActivityEvent[];
}


export function useFilteredServers(
  servers: ReadonlyArray<Server>,
  activities: ReadonlyArray<ActivityEvent>
): FilteredResult {
  const timeRange = useFilterStore((s) => s.timeRange);

  return useMemo(() => {
    const resolved = resolveTimeRange(timeRange);
    return {
      filteredServers: [...servers],
      newServers: servers.filter((s) => isWithin(s.createdAt, resolved)),
      filteredActivities: activities.filter((a) =>
        isWithin(a.timestamp, resolved)
      ),
    };
  }, [servers, activities, timeRange]);
}
