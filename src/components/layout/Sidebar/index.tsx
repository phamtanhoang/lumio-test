"use client";

import { Settings } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ThemeToggle } from "@/components/theme";
import { cn } from "@/lib/cn";
import { NAV_ITEMS } from "./nav-items";

interface SidebarProps {
  className?: string;
}

export function Sidebar({ className }: SidebarProps) {
  const pathname = usePathname();

  return (
    <aside
      className={cn(
        "hidden sticky top-0 h-screen w-[72px] shrink-0 flex-col items-center overflow-y-auto border-r border-border bg-card/60 py-5 backdrop-blur md:flex",
        className
      )}
    >
      <Link
        href="/dashboard"
        aria-label="Server Dashboard home"
        className="mb-7 flex h-10 w-10 items-center justify-center rounded-2xl bg-foreground text-base font-bold italic text-background"
      >
        S
      </Link>

      <nav className="flex flex-1 flex-col items-center gap-1.5">
        {NAV_ITEMS.map(({ icon: Icon, label, href }) => {
          // startsWith so /dashboard/foo still highlights the Dashboard tab.
          const active = pathname === href || pathname.startsWith(`${href}/`);
          return (
            <Link
              key={href}
              href={href}
              aria-label={label}
              aria-current={active ? "page" : undefined}
              className={cn(
                "flex h-10 w-10 items-center justify-center rounded-xl text-muted-foreground transition-colors",
                "hover:bg-muted hover:text-foreground",
                "focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-1 focus:ring-offset-background",
                active && "bg-primary/10 text-primary"
              )}
            >
              <Icon className="h-5 w-5" aria-hidden />
            </Link>
          );
        })}
      </nav>

      <div className="mt-auto flex flex-col items-center gap-3">
        <ThemeToggle className="rounded-xl border-0 bg-transparent" />

        <button
          type="button"
          aria-label="Settings"
          className="flex h-10 w-10 items-center justify-center rounded-xl text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
        >
          <Settings className="h-5 w-5" aria-hidden />
        </button>

        <div
          aria-label="Account"
          className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-pink-400 to-purple-500 text-sm font-semibold text-white"
        >
          HP
        </div>
      </div>
    </aside>
  );
}
