"use client";

import { Settings } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

import { ThemeToggle } from "@/components/theme";
import { cn } from "@/lib/cn";

import { NAV_ITEMS } from "./nav-items";

import styles from "./styles.module.css";

interface SidebarProps {
  className?: string;
}

export function Sidebar({ className }: SidebarProps) {
  const pathname = usePathname();
  const isSettingsActive =
    pathname === "/settings" || pathname.startsWith("/settings/");

  return (
    <aside className={cn(styles.aside, className)}>
      <Link href="/dashboard" aria-label="Server Dashboard home" className={styles.logo}>
        S
      </Link>

      <nav className={styles.nav}>
        {NAV_ITEMS.map(({ icon: Icon, label, href }) => {
          // startsWith so /dashboard/foo still highlights the Dashboard tab.
          const active = pathname === href || pathname.startsWith(`${href}/`);
          return (
            <Link
              key={href}
              href={href}
              aria-label={label}
              aria-current={active ? "page" : undefined}
              className={cn(styles.navItem, active && styles.navItemActive)}
            >
              <Icon className={styles.icon} aria-hidden />
            </Link>
          );
        })}
      </nav>

      <div className={styles.bottom}>
        <ThemeToggle className="rounded-xl border-0 bg-transparent" />

        <Link
          href="/settings"
          aria-label="Settings"
          aria-current={isSettingsActive ? "page" : undefined}
          className={cn(styles.navItem, isSettingsActive && styles.navItemActive)}
        >
          <Settings className={styles.icon} aria-hidden />
        </Link>

        <div aria-label="Account" className={styles.avatar}>
          HP
        </div>
      </div>
    </aside>
  );
}
