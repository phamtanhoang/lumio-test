import type { Metadata } from "next";
import { ComingSoon } from "@/components/shared/ComingSoon";

export const metadata: Metadata = { title: "Automations" };

export default function AutomationsPage() {
  return (
    <ComingSoon
      title="Automations"
      description="Rule-based playbooks that react to fleet events without human-in-the-loop."
    />
  );
}
