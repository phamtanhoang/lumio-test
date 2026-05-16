import type { Metadata } from "next";

import { ComingSoon } from "@/components/shared/ComingSoon";

export const metadata: Metadata = { title: "Alerts" };

export default function AlertsPage() {
  return (
    <ComingSoon
      title="Alerts"
      description="Live notifications for offline nodes, threshold breaches, and config drift."
    />
  );
}
