import type { ReactNode } from "react";

import { cn } from "@/lib/cn";

interface CircleProgressProps {
  value: number; // 0..1
  size?: number;
  stroke?: number;
  className?: string;
  trackClassName?: string;
  barClassName?: string;
  children?: ReactNode;
  label?: string;
}

// Lightweight SVG progress ring — avoids pulling a chart lib in just to draw
// a single arc next to a stat. Pass any ReactNode (icon, number) as children
// to render in the middle of the ring.
export function CircleProgress({
  value,
  size = 56,
  stroke = 4,
  className,
  trackClassName,
  barClassName,
  children,
  label,
}: CircleProgressProps) {
  const clamped = Math.max(0, Math.min(1, value));
  const r = (size - stroke) / 2;
  const c = 2 * Math.PI * r;
  const offset = c * (1 - clamped);

  return (
    <div
      className={cn("relative inline-flex items-center justify-center", className)}
      style={{ width: size, height: size }}
      role={label ? "img" : undefined}
      aria-label={label}
    >
      <svg
        width={size}
        height={size}
        viewBox={`0 0 ${size} ${size}`}
        className="-rotate-90"
        aria-hidden
      >
        <circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          fill="none"
          strokeWidth={stroke}
          className={cn("text-muted", trackClassName)}
          stroke="currentColor"
        />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          fill="none"
          strokeWidth={stroke}
          strokeLinecap="round"
          strokeDasharray={c}
          strokeDashoffset={offset}
          className={cn(
            "text-primary transition-[stroke-dashoffset] duration-700 ease-out",
            barClassName
          )}
          stroke="currentColor"
        />
      </svg>
      {children ? (
        <span className="pointer-events-none absolute inset-0 flex items-center justify-center">
          {children}
        </span>
      ) : null}
    </div>
  );
}
