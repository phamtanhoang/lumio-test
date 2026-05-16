import type { Metadata } from "next";

import { ComingSoon } from "@/components/shared/ComingSoon";

export const metadata: Metadata = { title: "Schedule" };

export default function SchedulePage() {
  return (
    <ComingSoon
      title="Schedule"
      description="Maintenance windows and recurring jobs across the fleet."
    />
  );
}
