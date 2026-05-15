import {
  BarChart3,
  Bell,
  Calendar,
  LayoutDashboard,
  Server,
  Zap,
  type LucideIcon,
} from "lucide-react";

export interface NavItem {
  icon: LucideIcon;
  label: string;
  href: string;
}

export const NAV_ITEMS: ReadonlyArray<NavItem> = [
  { icon: LayoutDashboard, label: "Dashboard", href: "/dashboard" },
  { icon: BarChart3, label: "Analytics", href: "/analytics" },
  { icon: Server, label: "Servers", href: "/servers" },
  { icon: Calendar, label: "Schedule", href: "/schedule" },
  { icon: Zap, label: "Automations", href: "/automations" },
  { icon: Bell, label: "Alerts", href: "/alerts" },
];
