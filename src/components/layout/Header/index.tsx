"use client";

import { Menu, Plus, Search, SlidersHorizontal } from "lucide-react";

import { useUiStore } from "@/store/ui.store";
import { cn } from "@/lib/cn";

import styles from "./styles.module.css";

interface HeaderProps {
  className?: string;
}

export function Header({ className }: HeaderProps) {
  const openMobileNav = useUiStore((s) => s.openMobileNav);

  return (
    <header className={cn(styles.header, className)}>
      <div className={styles.titleRow}>
        <button
          type="button"
          aria-label="Open navigation"
          onClick={openMobileNav}
          className={styles.hamburger}
        >
          <Menu className={styles.btnIcon} aria-hidden />
        </button>
        <h1 className={styles.title}>Demographics Report</h1>
      </div>

      <div className={styles.actions}>
        <button type="button" aria-label="Search" className={styles.iconBtn}>
          <Search className={styles.btnIcon} aria-hidden />
        </button>

        <button type="button" className={styles.pillBtn} aria-label="Customize">
          <SlidersHorizontal className={styles.btnIcon} aria-hidden />
          <span className={styles.pillLabel}>Customize</span>
        </button>

        <button type="button" className={styles.pillBtn} aria-label="Add new">
          <Plus className={styles.btnIcon} aria-hidden />
          <span className={styles.pillLabel}>Add New</span>
        </button>
      </div>
    </header>
  );
}
