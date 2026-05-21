"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";
import { createPortal } from "react-dom";

import { cn } from "@/lib/cn";

interface TooltipProps {
  content: ReactNode;
  children: ReactNode;
  position?: "top" | "bottom";
  // Horizontal alignment vs the trigger. `end` is useful for triggers near the
  // right edge of their container so the tooltip doesn't overflow.
  align?: "center" | "start" | "end";
  className?: string;
}

// Lightweight popover that shows on hover/focus. Renders into `document.body`
// via a portal with `position: fixed` so the tooltip is never clipped by an
// ancestor's `overflow: hidden` / `overflow-y: auto` (eg. a scrollable list).
export function Tooltip({
  content,
  children,
  position = "top",
  align = "center",
  className,
}: TooltipProps) {
  const [open, setOpen] = useState(false);
  const [coords, setCoords] = useState<{ top: number; left: number } | null>(
    null
  );
  const triggerRef = useRef<HTMLSpanElement>(null);

  // Capture trigger position when the tooltip opens. Stays put on scroll —
  // acceptable for short hover hints.
  useEffect(() => {
    if (!open) {
      setCoords(null);
      return;
    }
    const el = triggerRef.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    let left: number;
    if (align === "start") left = rect.left;
    else if (align === "end") left = rect.right;
    else left = rect.left + rect.width / 2;
    const top = position === "top" ? rect.top - 8 : rect.bottom + 8;
    setCoords({ top, left });
  }, [open, position, align]);

  // Compose the transform once based on the requested alignment / side.
  const xTransform =
    align === "center"
      ? "translateX(-50%)"
      : align === "end"
        ? "translateX(-100%)"
        : "";
  const yTransform = position === "top" ? "translateY(-100%)" : "";
  const transform = `${xTransform} ${yTransform}`.trim() || undefined;

  return (
    <>
      <span
        ref={triggerRef}
        className={cn("inline-flex cursor-help", className)}
        onMouseEnter={() => setOpen(true)}
        onMouseLeave={() => setOpen(false)}
        onFocus={() => setOpen(true)}
        onBlur={() => setOpen(false)}
      >
        {children}
      </span>
      {open && coords && typeof document !== "undefined"
        ? createPortal(
            <span
              role="tooltip"
              style={{
                position: "fixed",
                top: coords.top,
                left: coords.left,
                transform,
              }}
              className="pointer-events-none z-[100] w-64 whitespace-normal rounded-lg bg-foreground px-3 py-2 text-xs font-medium leading-relaxed text-background shadow-xl"
            >
              {content}
            </span>,
            document.body
          )
        : null}
    </>
  );
}
