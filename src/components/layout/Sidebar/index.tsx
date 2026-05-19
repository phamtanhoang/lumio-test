"use client";

import { Settings, X } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect } from "react";

import { ThemeToggle } from "@/components/theme";
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
          className
        )}
      >
        <div className={styles.brand}>
          <Link
            href="/dashboard"
            aria-label="Server Dashboard home"
            className={styles.brandLogo}
          >
            S
          </Link>
          <span className={styles.brandName}>Lumio Studio</span>
          <button
            type="button"
            aria-label="Close navigation"
            onClick={closeMobileNav}
            className={styles.closeBtn}
          >
            <X className={styles.iconSm} aria-hidden />
          </button>
        </div>

        <nav className={styles.nav}>
          {NAV_ITEMS.map(({ icon: Icon, label, href }) => {
            const active = pathname === href || pathname.startsWith(`${href}/`);
            return (
              <Link
                key={href}
                href={href}
                aria-current={active ? "page" : undefined}
                className={cn(styles.navItem, active && styles.navItemActive)}
              >
                <Icon className={styles.icon} aria-hidden />
                <span className={styles.navLabel}>{label}</span>
              </Link>
            );
          })}
        </nav>

        <div className={styles.bottom}>
          <div className={styles.bottomRow}>
            <ThemeToggle className={styles.toggleBtn} />
            <span className={styles.navLabel}>Theme</span>
          </div>

          <Link
            href="/settings"
            aria-current={isSettingsActive ? "page" : undefined}
            className={cn(styles.navItem, isSettingsActive && styles.navItemActive)}
          >
            <Settings className={styles.icon} aria-hidden />
            <span className={styles.navLabel}>Settings</span>
          </Link>

          <div className={styles.profile}>
            <div className={styles.avatar}>HP</div>
            <div className={styles.profileText}>
              <p className={styles.profileName}>Hoàng Phạm</p>
              <p className={styles.profileEmail}>hp@lumio.studio</p>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
}
