import * as React from "react";

import { cn } from "@/lib/cn";

import styles from "./Select.module.css";

export const Select = React.forwardRef<
  HTMLSelectElement,
  React.SelectHTMLAttributes<HTMLSelectElement>
>(({ className, children, ...props }, ref) => (
  <select ref={ref} className={cn(styles.select, className)} {...props}>
    {children}
  </select>
));
Select.displayName = "Select";
