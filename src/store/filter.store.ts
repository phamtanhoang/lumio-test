import { create } from "zustand";

import type { TimeRange } from "@/types/filter.types";

interface FilterState {
  timeRange: TimeRange;
  setTimeRange: (range: TimeRange) => void;
}

function todayYmd(): string {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(
    d.getDate()
  ).padStart(2, "0")}`;
}

// Default = today's custom range so the dashboard opens on "what's happening
// now" instead of a wide preset window.
const TODAY = todayYmd();

export const useFilterStore = create<FilterState>((set) => ({
  timeRange: { kind: "custom", from: TODAY, to: TODAY },
  setTimeRange: (range) => set({ timeRange: range }),
}));
