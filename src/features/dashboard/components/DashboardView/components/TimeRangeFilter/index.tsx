"use client";

import { Calendar } from "lucide-react";
import { useCallback, useState } from "react";
import { cn } from "@/lib/cn";
import { useFilterStore } from "@/features/dashboard/store";
import type { TimeRangeKind } from "@/features/dashboard/types";

interface Preset {
  kind: Exclude<TimeRangeKind, "custom">;
  label: string;
}

const PRESETS: Preset[] = [
  { kind: "24h", label: "Last 24 hours" },
  { kind: "week", label: "Last week" },
  { kind: "month", label: "Last month" },
];

export function TimeRangeFilter() {
  const timeRange = useFilterStore((s) => s.timeRange);
  const setTimeRange = useFilterStore((s) => s.setTimeRange);

  const [customOpen, setCustomOpen] = useState(timeRange.kind === "custom");
  const [from, setFrom] = useState(
    timeRange.kind === "custom" ? timeRange.from : ""
  );
  const [to, setTo] = useState(
    timeRange.kind === "custom" ? timeRange.to : ""
  );

  const handleApplyCustom = useCallback(() => {
    if (!from || !to) return;
    setTimeRange({ kind: "custom", from, to });
  }, [from, to, setTimeRange]);

  return (
    <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
      <div className="flex flex-wrap items-center gap-2">
        {PRESETS.map(({ kind, label }) => {
          const active = timeRange.kind === kind;
          return (
            <button
              key={kind}
              type="button"
              onClick={() => {
                setCustomOpen(false);
                setTimeRange({ kind });
              }}
              className={cn(
                "h-9 rounded-md px-3 text-sm font-medium transition-colors",
                active
                  ? "bg-primary text-primary-foreground"
                  : "border border-border bg-card text-foreground hover:bg-muted"
              )}
            >
              {label}
            </button>
          );
        })}

        <button
          type="button"
          onClick={() => setCustomOpen((o) => !o)}
          className={cn(
            "inline-flex h-9 items-center gap-1.5 rounded-md px-3 text-sm font-medium transition-colors",
            timeRange.kind === "custom"
              ? "bg-primary text-primary-foreground"
              : "border border-border bg-card text-foreground hover:bg-muted"
          )}
        >
          <Calendar className="h-4 w-4" aria-hidden />
          Custom
        </button>
      </div>

      {customOpen ? (
        <div className="flex flex-wrap items-center gap-2">
          <input
            type="date"
            value={from}
            onChange={(e) => setFrom(e.target.value)}
            aria-label="From date"
            className="h-9 rounded-md border border-border bg-card px-2 text-sm"
          />
          <span className="text-muted-foreground">→</span>
          <input
            type="date"
            value={to}
            onChange={(e) => setTo(e.target.value)}
            aria-label="To date"
            className="h-9 rounded-md border border-border bg-card px-2 text-sm"
          />
          <button
            type="button"
            disabled={!from || !to}
            onClick={handleApplyCustom}
            className="h-9 rounded-md bg-primary px-3 text-sm font-medium text-primary-foreground transition-opacity hover:opacity-90 disabled:opacity-50"
          >
            Apply
          </button>
        </div>
      ) : null}
    </div>
  );
}
