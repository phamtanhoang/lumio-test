"use client";

import { useEffect, useRef, useState } from "react";

interface AnimatedNumberProps {
  value: number;
  duration?: number;
  format?: (n: number) => string;
  className?: string;
}

// Count-up tween between successive values. Uses requestAnimationFrame for a
// smooth ease-out cubic — no chart lib needed. Skips animation on first mount
// so the dashboard doesn't tween from 0 on initial render.
export function AnimatedNumber({
  value,
  duration = 600,
  format = String,
  className,
}: AnimatedNumberProps) {
  const [displayed, setDisplayed] = useState(value);
  const fromRef = useRef(value);
  const rafRef = useRef<number | null>(null);
  const isFirstRender = useRef(true);

  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
      fromRef.current = value;
      setDisplayed(value);
      return;
    }
    if (fromRef.current === value) return;

    const from = fromRef.current;
    const delta = value - from;
    const start = performance.now();

    const tick = (now: number) => {
      const t = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - t, 3);
      setDisplayed(from + delta * eased);
      if (t < 1) {
        rafRef.current = requestAnimationFrame(tick);
      } else {
        fromRef.current = value;
      }
    };

    rafRef.current = requestAnimationFrame(tick);
    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [value, duration]);

  // Round before formatting so the user sees whole numbers throughout the
  // tween instead of decimals like "47.32".
  return <span className={className}>{format(Math.round(displayed))}</span>;
}
