import * as React from "react";

import { cn } from "@/lib/cn";

import styles from "./Badge.module.css";

type BadgeVariant = "default" | "success" | "danger" | "warning" | "outline";

interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: BadgeVariant;
}

const VARIANT_CLASSES: Record<BadgeVariant, string> = {
  default: styles.default,
  success: styles.success,
  danger: styles.danger,
  warning: styles.warning,
  outline: styles.outline,
};

export const Badge = React.forwardRef<HTMLSpanElement, BadgeProps>(
  ({ className, variant = "default", ...props }, ref) => (
    <span
      ref={ref}
      className={cn(styles.badge, VARIANT_CLASSES[variant], className)}
      {...props}
    />
  )
);
Badge.displayName = "Badge";
