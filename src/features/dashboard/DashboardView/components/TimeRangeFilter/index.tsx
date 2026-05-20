"use client";

import { Calendar, Check, ChevronDown } from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";

import { useFilterStore } from "@/store/filter.store";
import { cn } from "@/lib/cn";
import { formatTimeRange } from "@/lib/timeRange";
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

  // Custom date inputs are shared by both layouts — typing on one matches the other.
  const [from, setFrom] = useState(
    timeRange.kind === "custom" ? timeRange.from : aWeekAgoYmd()
  );
  const [to, setTo] = useState(
    timeRange.kind === "custom" ? timeRange.to : todayYmd()
  );

  // Mobile dropdown
  const [mobileOpen, setMobileOpen] = useState(false);
  const [mobileCustomMode, setMobileCustomMode] = useState(
    timeRange.kind === "custom"
  );
  const mobileRef = useRef<HTMLDivElement | null>(null);

  // Desktop: toggles whether the inline date form is visible. Form lives on
  // the right of the same row, only revealed when Custom is selected.
  const [desktopCustomOpen, setDesktopCustomOpen] = useState(
    timeRange.kind === "custom"
  );

  useEffect(() => {
    if (!mobileOpen) return;
    const onPointer = (e: MouseEvent | TouchEvent) => {
      if (!mobileRef.current?.contains(e.target as Node)) setMobileOpen(false);
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setMobileOpen(false);
    };
    document.addEventListener("mousedown", onPointer);
    document.addEventListener("touchstart", onPointer);
    window.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onPointer);
      document.removeEventListener("touchstart", onPointer);
      window.removeEventListener("keydown", onKey);
    };
  }, [mobileOpen]);

  const pickPreset = useCallback(
    (kind: Preset["kind"]) => {
      setTimeRange({ kind });
      setMobileOpen(false);
      setMobileCustomMode(false);
      setDesktopCustomOpen(false);
    },
    [setTimeRange]
  );

  const handleApplyCustom = useCallback(() => {
    if (!from || !to) return;
    setTimeRange({ kind: "custom", from, to });
    setMobileOpen(false);
  }, [from, to, setTimeRange]);

  const triggerLabel = formatTimeRange(timeRange);
  const customActiveMobile = mobileCustomMode || timeRange.kind === "custom";
  const customActiveDesktop = desktopCustomOpen || timeRange.kind === "custom";

  return (
    <div className={styles.root}>
      {/* Mobile dropdown — single trigger that opens a popover with the 4 ranges. */}
      <div ref={mobileRef} className={styles.mobile}>
        <button
          type="button"
          aria-haspopup="dialog"
          aria-expanded={mobileOpen}
          onClick={() => setMobileOpen((o) => !o)}
          className={styles.trigger}
        >
          <Calendar className={styles.icon} aria-hidden />
          <span className={styles.triggerLabel}>{triggerLabel}</span>
          <ChevronDown
            className={cn(styles.chev, mobileOpen && styles.chevOpen)}
            aria-hidden
          />
        </button>

        {mobileOpen ? (
          <div
            role="dialog"
            aria-label="Choose time range"
            className={styles.popover}
          >
            <ul className={styles.options}>
              {PRESETS.map(({ kind, label }) => {
                const active = !mobileCustomMode && timeRange.kind === kind;
                return (
                  <li key={kind}>
                    <button
                      type="button"
                      onClick={() => pickPreset(kind)}
                      className={cn(styles.option, active && styles.optionActive)}
                    >
                      <span>{label}</span>
                      {active ? (
                        <Check className={styles.icon} aria-hidden />
                      ) : null}
                    </button>
                  </li>
                );
              })}
              <li>
                <button
                  type="button"
                  onClick={() => setMobileCustomMode(true)}
                  className={cn(
                    styles.option,
                    customActiveMobile && styles.optionActive
                  )}
                >
                  <span>Custom range</span>
                  {timeRange.kind === "custom" ? (
                    <Check className={styles.icon} aria-hidden />
                  ) : null}
                </button>
              </li>
            </ul>

            {mobileCustomMode ? (
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
        ) : null}
      </div>

      {/* Desktop: presets on the left, Custom toggle reveals the date form
          on the right of the same row. */}
      <div className={styles.desktop}>
        <div className={styles.presetGroup}>
          {PRESETS.map(({ kind, label }) => {
            const active = timeRange.kind === kind && !desktopCustomOpen;
            return (
              <button
                key={kind}
                type="button"
                onClick={() => pickPreset(kind)}
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
            aria-expanded={desktopCustomOpen}
            onClick={() => setDesktopCustomOpen((o) => !o)}
            className={cn(
              styles.customToggle,
              customActiveDesktop ? styles.presetActive : styles.presetInactive
            )}
          >
            <Calendar className={styles.icon} aria-hidden />
            Custom
          </button>
        </div>

        {desktopCustomOpen ? (
          <div className={styles.customFormDesktop}>
            <input
              type="date"
              value={from}
              max={to || undefined}
              onChange={(e) => setFrom(e.target.value)}
              aria-label="From date"
              className={styles.dateInputDesktop}
            />
            <span className={styles.sep}>→</span>
            <input
              type="date"
              value={to}
              min={from || undefined}
              onChange={(e) => setTo(e.target.value)}
              aria-label="To date"
              className={styles.dateInputDesktop}
            />
            <button
              type="button"
              disabled={!from || !to}
              onClick={handleApplyCustom}
              className={styles.applyBtnDesktop}
            >
              Apply
            </button>
          </div>
        ) : null}
      </div>
    </div>
  );
}
