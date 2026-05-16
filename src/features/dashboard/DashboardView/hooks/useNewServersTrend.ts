"use client";

import { useMemo } from "react";

import { useFilterStore } from "@/store/filter.store";
import type { Server } from "@/types/server.types";
import { isWithin, resolveTimeRange } from "@/lib/timeRange";

export interface TrendDelta {
  direction: "up" | "down";
  value: number;
}

const MAX_TREND = 9.99;

export function useNewServersTrend(
  servers: ReadonlyArray<Server>,
  newCount: number
): TrendDelta | undefined {
  const timeRange = useFilterStore((s) => s.timeRange);

  return useMemo(() => {
    if (servers.length === 0) return undefined;

    const { from, to } = resolveTimeRange(timeRange);
    const windowMs = to.getTime() - from.getTime();
    if (windowMs <= 0) return undefined;

    const priorRange = { from: new Date(from.getTime() - windowMs), to: from };
    const prior = servers.filter((s) => isWithin(s.createdAt, priorRange)).length;

    if (prior === 0) {
      return newCount > 0 ? { direction: "up", value: 1 } : undefined;
    }

    const delta = (newCount - prior) / prior;
    return {
      direction: delta >= 0 ? "up" : "down",
      value: Math.min(Math.abs(delta), MAX_TREND),
    };
  }, [servers, newCount, timeRange]);
}
