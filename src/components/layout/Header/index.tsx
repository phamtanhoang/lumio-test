import { Plus, Search, SlidersHorizontal } from "lucide-react";

import { cn } from "@/lib/cn";

import styles from "./styles.module.css";

interface HeaderProps {
  className?: string;
}

export function Header({ className }: HeaderProps) {
  return (
    <header className={cn(styles.header, className)}>
      <div>
        <h1 className={styles.title}>Demographics Report</h1>
      </div>

      <div className={styles.actions}>
        <button type="button" aria-label="Search" className={styles.iconBtn}>
          <Search className={styles.btnIcon} aria-hidden />
        </button>

        <button type="button" className={styles.pillBtn}>
          <SlidersHorizontal className={styles.btnIcon} aria-hidden />
          Customize
        </button>

        <button type="button" className={styles.pillBtn}>
          <Plus className={styles.btnIcon} aria-hidden />
          Add New
        </button>
      </div>
    </header>
  );
}
