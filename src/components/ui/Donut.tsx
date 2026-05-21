import { memo, type ReactNode } from "react";

import { cn } from "@/lib/cn";

export interface DonutSegment {
  value: number;
  className?: string;
  label?: string;
}

interface DonutProps {
  segments: ReadonlyArray<DonutSegment>;
  size?: number;
  thickness?: number;
  centerLabel?: ReactNode;
  trackClassName?: string;
  className?: string;
}

// SVG donut chart drawn with `strokeDasharray` arcs. Each segment uses
// `currentColor` so colors are controlled via Tailwind text-* classes
// passed in `segment.className`. Skip importing a chart lib — a single
// circle per segment is cheap and tweens for free via CSS transitions.
export const Donut = memo(function Donut({
  segments,
  size = 96,
  thickness = 10,
  centerLabel,
  trackClassName,
  className,
}: DonutProps) {
  const total = segments.reduce((acc, s) => acc + s.value, 0);

  const r = (size - thickness) / 2;
  const circumference = 2 * Math.PI * r;
  let cumulative = 0;

  return (
    <div
      className={cn(
        "relative inline-flex items-center justify-center",
        className
      )}
      style={{ width: size, height: size }}
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
          stroke="currentColor"
          strokeWidth={thickness}
          className={cn("text-muted/60", trackClassName)}
        />
        {total > 0
          ? segments.map((seg, i) => {
              const pct = seg.value / total;
              const dash = pct * circumference;
              const offset = -cumulative * circumference;
              cumulative += pct;
              return (
                <circle
                  key={i}
                  cx={size / 2}
                  cy={size / 2}
                  r={r}
                  fill="none"
                  stroke="currentColor"
                  strokeWidth={thickness}
                  strokeDasharray={`${dash} ${circumference}`}
                  strokeDashoffset={offset}
                  className={cn(
                    "transition-[stroke-dasharray,stroke-dashoffset] duration-700 ease-out",
                    seg.className
                  )}
                >
                  {seg.label ? <title>{seg.label}</title> : null}
                </circle>
              );
            })
          : null}
      </svg>
      {centerLabel ? (
        <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center text-center leading-none">
          {centerLabel}
        </div>
      ) : null}
    </div>
  );
});
