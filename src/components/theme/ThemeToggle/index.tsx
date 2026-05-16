"use client";

import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";

import { cn } from "@/lib/cn";

import styles from "./styles.module.css";

interface ThemeToggleProps {
  className?: string;
}

export function ThemeToggle({ className }: ThemeToggleProps) {
  const { resolvedTheme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  const isDark = mounted && resolvedTheme === "dark";

  return (
    <button
      type="button"
      aria-label={isDark ? "Switch to light mode" : "Switch to dark mode"}
      onClick={() => setTheme(isDark ? "light" : "dark")}
      className={cn(styles.toggle, className)}
    >
      {mounted ? (
        isDark ? (
          <Sun className={styles.icon} aria-hidden />
        ) : (
          <Moon className={styles.icon} aria-hidden />
        )
      ) : (
        <span className={styles.icon} aria-hidden />
      )}
    </button>
  );
}
