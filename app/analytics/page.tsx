import type { Metadata } from "next";

import { ComingSoon } from "@/components/shared/ComingSoon";

export const metadata: Metadata = { title: "Analytics" };

export default function AnalyticsPage() {
  return (
    <ComingSoon
      title="Analytics"
      description="Deep-dive charts, funnel reports, and segmentation tools will land here."
    />
  );
}
