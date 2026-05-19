"use client";

import {
  ChevronLeft,
  ChevronRight,
  Settings,
  X,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect } from "react";

import { useUiStore } from "@/store/ui.store";
import { cn } from "@/lib/cn";

import { NAV_ITEMS } from "./nav-items";

import styles from "./styles.module.css";

interface SidebarProps {
  className?: string;
}

export function Sidebar({ className }: SidebarProps) {
  const pathname = usePathname();
  const mobileOpen = useUiStore((s) => s.mobileNavOpen);
  const closeMobileNav = useUiStore((s) => s.closeMobileNav);
  const expanded = useUiStore((s) => s.sidebarExpanded);
  const toggleSidebar = useUiStore((s) => s.toggleSidebar);
  const isSettingsActive =
    pathname === "/settings" || pathname.startsWith("/settings/");

  useEffect(() => {
    closeMobileNav();
  }, [pathname, closeMobileNav]);

  useEffect(() => {
    if (!mobileOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") closeMobileNav();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [mobileOpen, closeMobileNav]);

  // Mobile (always wide) and desktop-expanded share the same wide layout.
  // Desktop-collapsed is the only variant — controlled by `collapsed` class.
  const collapsed = !expanded;
  const itemClass = cn(styles.navItem, collapsed && styles.navItemCollapsed);
  const labelClass = cn(styles.navLabel, collapsed && styles.navLabelCollapsed);

  return (
    <>
      {mobileOpen ? (
        <div
          className={styles.backdrop}
          onClick={closeMobileNav}
          aria-hidden
        />
      ) : null}

      <aside
        className={cn(
          styles.aside,
          mobileOpen ? styles.asideOpen : styles.asideClosed,
          collapsed && styles.asideCollapsed,
          className
        )}
      >
        <div
          className={cn(styles.brand, collapsed && styles.brandCollapsed)}
        >
          <Link
            href="/dashboard"
            aria-label="Server Dashboard home"
            className={styles.brandLogo}
          >
            S
          </Link>
          <span className={labelClass}>Lumio Studio</span>

          <button
            type="button"
            aria-label="Close navigation"
            onClick={closeMobileNav}
            className={styles.closeBtn}
          >
            <X className={styles.iconSm} aria-hidden />
          </button>
        </div>

        <nav className={cn(styles.nav, collapsed && styles.navCollapsed)}>
          {NAV_ITEMS.map(({ icon: Icon, label, href }) => {
            const active = pathname === href || pathname.startsWith(`${href}/`);
            return (
              <Link
                key={href}
                href={href}
                aria-current={active ? "page" : undefined}
                className={cn(itemClass, active && styles.navItemActive)}
              >
                <Icon className={styles.icon} aria-hidden />
                <span className={labelClass}>{label}</span>
              </Link>
            );
          })}
        </nav>

        <div className={cn(styles.bottom, collapsed && styles.bottomCollapsed)}>
          <Link
            href="/settings"
            aria-current={isSettingsActive ? "page" : undefined}
            className={cn(itemClass, isSettingsActive && styles.navItemActive)}
          >
            <Settings className={styles.icon} aria-hidden />
            <span className={labelClass}>Settings</span>
          </Link>

          <Link
            href="/profile"
            aria-label="View profile"
            aria-current={
              pathname === "/profile" || pathname.startsWith("/profile/")
                ? "page"
                : undefined
            }
            className={cn(styles.profile, collapsed && styles.profileCollapsed)}
          >
            <div className={styles.avatar}>HP</div>
            <div className={cn(styles.profileText, collapsed && styles.profileTextCollapsed)}>
              <p className={styles.profileName}>Hoàng Phạm</p>
              <p className={styles.profileEmail}>phamtanhoang3202@gmail.com</p>
            </div>
          </Link>

          <button
            type="button"
            aria-label={expanded ? "Collapse sidebar" : "Expand sidebar"}
            onClick={toggleSidebar}
            className={cn(itemClass, styles.toggleBtn)}
          >
            {expanded ? (
              <ChevronLeft className={styles.icon} aria-hidden />
            ) : (
              <ChevronRight className={styles.icon} aria-hidden />
            )}
            <span className={labelClass}>
              {expanded ? "Collapse" : "Expand"}
            </span>
          </button>
        </div>
      </aside>
    </>
  );
}
