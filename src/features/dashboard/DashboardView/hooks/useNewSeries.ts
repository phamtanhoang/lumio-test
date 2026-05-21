"use client";

import { useMemo } from "react";

import { resolveTimeRange } from "@/lib/timeRange";
import { useFilterStore } from "@/store/filter.store";
import type { Server } from "@/types/server.types";

const BUCKETS = 8;

// Bucket "new" server creations across the active window into 8 evenly-sized
// time slots so the New card can render a meaningful sparkline regardless of
// whether the window is 24h, 7d, 30d, or a custom span.
export function useNewSeries(servers: ReadonlyArray<Server>): number[] {
  const timeRange = useFilterStore((s) => s.timeRange);

  return useMemo(() => {
    const { from, to } = resolveTimeRange(timeRange);
    const fromMs = from.getTime();
    const toMs = to.getTime();
    const span = Math.max(toMs - fromMs, 1);
    const bucketSize = span / BUCKETS;

    const buckets = new Array<number>(BUCKETS).fill(0);
    for (const s of servers) {
      const ts = new Date(s.createdAt).getTime();
      if (ts < fromMs || ts > toMs) continue;
      const idx = Math.min(Math.floor((ts - fromMs) / bucketSize), BUCKETS - 1);
      buckets[idx]++;
    }
    return buckets;
  }, [servers, timeRange]);
}
