"use client";

import {
  Menu,
  MoreHorizontal,
  Plus,
  Search,
  SlidersHorizontal,
} from "lucide-react";
import { usePathname } from "next/navigation";
import { useEffect, useMemo, useRef, useState } from "react";

import { ThemeToggle } from "@/components/theme";
import { useUiStore } from "@/store/ui.store";
import { cn } from "@/lib/cn";

import styles from "./styles.module.css";

interface HeaderProps {
  className?: string;
}

// Most-specific paths first so a request to /servers/123 still resolves
// to "Servers" via prefix match.
const PAGE_TITLES: ReadonlyArray<[string, string]> = [
  ["/dashboard", "Dashboard"],
  ["/analytics", "Analytics"],
  ["/servers", "Servers"],
  ["/schedule", "Schedule"],
  ["/automations", "Automations"],
  ["/alerts", "Alerts"],
  ["/settings", "Settings"],
  ["/profile", "Profile"],
];

function getPageTitle(pathname: string): string {
  for (const [prefix, title] of PAGE_TITLES) {
    if (pathname === prefix || pathname.startsWith(`${prefix}/`)) {
      return title;
    }
  }
  return PAGE_TITLES[0][1]; // Default to first title if no match (shouldn't happen if "/" is included)
}

export function Header({ className }: HeaderProps) {
  const openMobileNav = useUiStore((s) => s.openMobileNav);
  const pathname = usePathname();
  const title = useMemo(() => getPageTitle(pathname), [pathname]);
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement | null>(null);

  // Close dropdown on click outside / Escape.
  useEffect(() => {
    if (!menuOpen) return;
    const onClick = (e: MouseEvent) => {
      if (!menuRef.current?.contains(e.target as Node)) setMenuOpen(false);
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setMenuOpen(false);
    };
    document.addEventListener("mousedown", onClick);
    window.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onClick);
      window.removeEventListener("keydown", onKey);
    };
  }, [menuOpen]);

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
        <h1 className={styles.title}>{title}</h1>
      </div>

      <div className={styles.actions}>
        {/* Desktop: inline buttons */}
        <button
          type="button"
          aria-label="Search"
          className={cn(styles.iconBtn, styles.desktopOnly)}
        >
          <Search className={styles.btnIcon} aria-hidden />
        </button>
        <button
          type="button"
          aria-label="Customize"
          className={cn(styles.pillBtn, styles.desktopOnly)}
        >
          <SlidersHorizontal className={styles.btnIcon} aria-hidden />
          <span className={styles.pillLabel}>Customize</span>
        </button>
        <button
          type="button"
          aria-label="Add new"
          className={cn(styles.pillBtn, styles.desktopOnly)}
        >
          <Plus className={styles.btnIcon} aria-hidden />
          <span className={styles.pillLabel}>Add New</span>
        </button>

        {/* Mobile: collapse same actions into a dropdown */}
        <div ref={menuRef} className={styles.menuWrap}>
          <button
            type="button"
            aria-label="More actions"
            aria-expanded={menuOpen}
            onClick={() => setMenuOpen((o) => !o)}
            className={styles.iconBtn}
          >
            <MoreHorizontal className={styles.btnIcon} aria-hidden />
          </button>

          {menuOpen ? (
            <div role="menu" className={styles.menu}>
              <button
                type="button"
                role="menuitem"
                onClick={() => setMenuOpen(false)}
                className={styles.menuItem}
              >
                <Search className={styles.btnIcon} aria-hidden />
                Search
              </button>
              <button
                type="button"
                role="menuitem"
                onClick={() => setMenuOpen(false)}
                className={styles.menuItem}
              >
                <SlidersHorizontal className={styles.btnIcon} aria-hidden />
                Customize
              </button>
              <button
                type="button"
                role="menuitem"
                onClick={() => setMenuOpen(false)}
                className={styles.menuItem}
              >
                <Plus className={styles.btnIcon} aria-hidden />
                Add New
              </button>
            </div>
          ) : null}
        </div>

        <ThemeToggle className={styles.themeBtn} />
      </div>
    </header>
  );
}
