"use client";

import { Calendar } from "lucide-react";
import { useCallback, useState } from "react";

import { useFilterStore } from "@/store/filter.store";
import { cn } from "@/lib/cn";
import type { TimeRangeKind } from "@/types/filter.types";

import styles from "./styles.module.css";

interface Preset {
  kind: Exclude<TimeRangeKind, "custom">;
  label: string;
}

const PRESETS: Preset[] = [
  { kind: "24h", label: "Last 24 hours" },
  { kind: "week", label: "Last week" },
  { kind: "month", label: "Last month" },
];

function todayYmd(): string {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(
    d.getDate()
  ).padStart(2, "0")}`;
}

function aWeekAgoYmd(): string {
  const d = new Date();
  d.setDate(d.getDate() - 7);
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(
    d.getDate()
  ).padStart(2, "0")}`;
}

export function TimeRangeFilter() {
  const timeRange = useFilterStore((s) => s.timeRange);
  const setTimeRange = useFilterStore((s) => s.setTimeRange);

  const [customOpen, setCustomOpen] = useState(timeRange.kind === "custom");
  const [from, setFrom] = useState(
    timeRange.kind === "custom" ? timeRange.from : aWeekAgoYmd()
  );
  const [to, setTo] = useState(
    timeRange.kind === "custom" ? timeRange.to : todayYmd()
  );

  const handleApplyCustom = useCallback(() => {
    if (!from || !to) return;
    setTimeRange({ kind: "custom", from, to });
  }, [from, to, setTimeRange]);

  // Custom button is "active" while the form is open OR custom is committed —
  // so user sees feedback the instant they click it.
  const customActive = customOpen || timeRange.kind === "custom";

  return (
    <div className={styles.root}>
      <div className={styles.presetGroup}>
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
                styles.preset,
                active ? styles.presetActive : styles.presetInactive
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
            styles.customToggle,
            customActive ? styles.presetActive : styles.presetInactive
          )}
        >
          <Calendar className={styles.icon} aria-hidden />
          Custom
        </button>
      </div>

      {customOpen ? (
        <div className={styles.customForm}>
          <input
            type="date"
            value={from}
            max={to || undefined}
            onChange={(e) => setFrom(e.target.value)}
            aria-label="From date"
            className={styles.dateInput}
          />
          <span className={styles.sep}>→</span>
          <input
            type="date"
            value={to}
            min={from || undefined}
            onChange={(e) => setTo(e.target.value)}
            aria-label="To date"
            className={styles.dateInput}
          />
          <button
            type="button"
            disabled={!from || !to}
            onClick={handleApplyCustom}
            className={styles.applyBtn}
          >
            Apply
          </button>
        </div>
      ) : null}
    </div>
  );
}
