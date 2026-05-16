import { create } from "zustand";

import type { TimeRange } from "@/types/filter.types";

interface FilterState {
  timeRange: TimeRange;
  setTimeRange: (range: TimeRange) => void;
}

export const useFilterStore = create<FilterState>((set) => ({
  timeRange: { kind: "week" },
  setTimeRange: (range) => set({ timeRange: range }),
}));
