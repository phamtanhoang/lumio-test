import {
  endOfDay,
  endOfMonth,
  endOfWeek,
  startOfDay,
  startOfMonth,
  startOfWeek,
  subDays,
  subMonths,
  subWeeks,
} from "date-fns";

import type { TimeRange } from "@/types/filter.types";

export interface ResolvedRange {
  from: Date;
  to: Date;
}

// Week starts Monday (ISO 8601) so "Last week" maps to Mon → Sun of the
// previous week, matching what most non-US users expect.
const WEEK_OPTIONS = { weekStartsOn: 1 as const };

export function resolveTimeRange(range: TimeRange): ResolvedRange {
  const now = new Date();

  switch (range.kind) {
    case "24h": {
      // Previous calendar day: yesterday 00:00:00 → 23:59:59.999.
      const yesterday = subDays(now, 1);
      return {
        from: startOfDay(yesterday),
        to: endOfDay(yesterday),
      };
    }
    case "week": {
      // Previous calendar week: Mon 00:00 → Sun 23:59:59.999 of last week.
      const lastWeek = subWeeks(now, 1);
      return {
        from: startOfWeek(lastWeek, WEEK_OPTIONS),
        to: endOfWeek(lastWeek, WEEK_OPTIONS),
      };
    }
    case "month": {
      // Previous calendar month: 1st 00:00 → end-of-day on the last day.
      const lastMonth = subMonths(now, 1);
      return {
        from: startOfMonth(lastMonth),
        to: endOfMonth(lastMonth),
      };
    }
    case "custom":
      // Parse as LOCAL date — user picks calendar date in their timezone,
      // not UTC. Using "T00:00:00Z" would shift +/- 7-12h on most locales,
      // causing activity items at edges to be filtered incorrectly.
      return {
        from: parseLocalDate(range.from, 0, 0, 0, 0),
        to: parseLocalDate(range.to, 23, 59, 59, 999),
      };
  }
}

function parseLocalDate(
  ymd: string,
  h: number,
  m: number,
  s: number,
  ms: number
): Date {
  const [y, mo, d] = ymd.split("-").map(Number);
  return new Date(y, mo - 1, d, h, m, s, ms);
}

const PRESET_LABEL: Record<Exclude<TimeRange["kind"], "custom">, string> = {
  "24h": "Last 24 hours",
  week: "Last week",
  month: "Last month",
};

export function formatTimeRange(range: TimeRange): string {
  if (range.kind === "custom") {
    // Single-day custom range collapses to one date so the label doesn't say
    // "2026-05-21 → 2026-05-21" — saves space, esp. on mobile cards.
    return range.from === range.to
      ? range.from
      : `${range.from} → ${range.to}`;
  }
  return PRESET_LABEL[range.kind];
}

export function isWithin(iso: string, range: ResolvedRange): boolean {
  const t = new Date(iso).getTime();
  return t >= range.from.getTime() && t <= range.to.getTime();
}
