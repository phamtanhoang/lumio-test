import { subDays, subHours, subMonths } from "date-fns";

import type { TimeRange } from "@/types/filter.types";

export interface ResolvedRange {
  from: Date;
  to: Date;
}

export function resolveTimeRange(range: TimeRange): ResolvedRange {
  const now = new Date();

  switch (range.kind) {
    case "24h":
      return { from: subHours(now, 24), to: now };
    case "week":
      return { from: subDays(now, 7), to: now };
    case "month":
      return { from: subMonths(now, 1), to: now };
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
  week: "Last 7 days",
  month: "Last 30 days",
};

export function formatTimeRange(range: TimeRange): string {
  if (range.kind === "custom") return `${range.from} → ${range.to}`;
  return PRESET_LABEL[range.kind];
}

export function isWithin(iso: string, range: ResolvedRange): boolean {
  const t = new Date(iso).getTime();
  return t >= range.from.getTime() && t <= range.to.getTime();
}
