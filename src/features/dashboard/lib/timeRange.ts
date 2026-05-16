import { subDays, subHours, subMonths } from "date-fns";

import type { TimeRange } from "@/features/dashboard/types";

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
      return {
        from: new Date(`${range.from}T00:00:00.000Z`),
        to: new Date(`${range.to}T23:59:59.999Z`),
      };
  }
}

export function isWithin(iso: string, range: ResolvedRange): boolean {
  const t = new Date(iso).getTime();
  return t >= range.from.getTime() && t <= range.to.getTime();
}
