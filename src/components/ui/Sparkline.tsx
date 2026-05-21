import { memo } from "react";

import { cn } from "@/lib/cn";

interface SparklineProps {
  data: ReadonlyArray<number>;
  width?: number;
  height?: number;
  className?: string;
  strokeClassName?: string;
  fillClassName?: string;
  label?: string;
}

// Tiny inline SVG line chart with optional gradient area fill — keeps bundle
// light vs pulling recharts for a 60-pixel sparkline. Pad min/max so a flat
// series still draws on the middle of the box instead of clinging to the
// bottom edge.
export const Sparkline = memo(function Sparkline({
  data,
  width = 80,
  height = 28,
  className,
  strokeClassName,
  fillClassName,
  label,
}: SparklineProps) {
  if (data.length < 2) return null;

  const max = Math.max(...data);
  const min = Math.min(...data);
  const range = max - min || 1;
  const padY = 2;
  const usable = height - padY * 2;

  const points = data
    .map((v, i) => {
      const x = (i / (data.length - 1)) * width;
      const y = padY + (1 - (v - min) / range) * usable;
      return `${x},${y.toFixed(2)}`;
    })
    .join(" ");
  const areaPath = `M0,${height} L${points
    .split(" ")
    .map((p) => p)
    .join(" L")} L${width},${height} Z`;

  const gradientId = `sparkline-fill-${data.length}-${max}-${min}`;

  return (
    <svg
      width={width}
      height={height}
      viewBox={`0 0 ${width} ${height}`}
      className={cn("overflow-visible text-primary", className)}
      role={label ? "img" : undefined}
      aria-label={label}
      aria-hidden={!label}
    >
      <defs>
        <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="currentColor" stopOpacity="0.35" />
          <stop offset="100%" stopColor="currentColor" stopOpacity="0" />
        </linearGradient>
      </defs>
      <path d={areaPath} fill={`url(#${gradientId})`} className={fillClassName} />
      <polyline
        points={points}
        fill="none"
        stroke="currentColor"
        strokeWidth={1.5}
        strokeLinecap="round"
        strokeLinejoin="round"
        className={strokeClassName}
      />
    </svg>
  );
});
