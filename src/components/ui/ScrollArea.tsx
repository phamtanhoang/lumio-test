import * as React from "react";

import { cn } from "@/lib/cn";

import styles from "./ScrollArea.module.css";

interface ScrollAreaProps extends React.HTMLAttributes<HTMLDivElement> {
  maxHeight?: string;
}

export const ScrollArea = React.forwardRef<HTMLDivElement, ScrollAreaProps>(
  ({ className, maxHeight = "24rem", style, children, ...props }, ref) => (
    <div
      ref={ref}
      style={{ maxHeight, ...style }}
      className={cn(styles.scrollArea, className)}
      {...props}
    >
      {children}
    </div>
  )
);
ScrollArea.displayName = "ScrollArea";
