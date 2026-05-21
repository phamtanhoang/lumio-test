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

// Matches the tooltip's Tailwind `w-64`. Used by the viewport-clamp math
// below so the popover never spills off-screen on narrow phones.
const TOOLTIP_WIDTH = 256;
const VIEWPORT_MARGIN = 8;

// Lightweight popover that shows on hover/focus. Renders into `document.body`
// via a portal with `position: fixed` so the tooltip is never clipped by an
// ancestor's `overflow: hidden` / `overflow-y: auto` (eg. a scrollable list).
// Horizontal position is clamped to the viewport so it stays fully visible
// even when the trigger is near a screen edge.
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

    // Compute the desired LEFT EDGE of the tooltip (post-alignment).
    let desiredLeft: number;
    if (align === "start") desiredLeft = rect.left;
    else if (align === "end") desiredLeft = rect.right - TOOLTIP_WIDTH;
    else desiredLeft = rect.left + rect.width / 2 - TOOLTIP_WIDTH / 2;

    // Clamp into the viewport so the popover stays fully visible.
    const maxLeft =
      window.innerWidth - TOOLTIP_WIDTH - VIEWPORT_MARGIN;
    const left = Math.max(VIEWPORT_MARGIN, Math.min(maxLeft, desiredLeft));

    const top = position === "top" ? rect.top - 8 : rect.bottom + 8;
    setCoords({ top, left });
  }, [open, position, align]);

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
                // No horizontal transform — `left` is already the tooltip's
                // left edge (clamped). Only flip vertically for "top" position.
                transform:
                  position === "top" ? "translateY(-100%)" : undefined,
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
