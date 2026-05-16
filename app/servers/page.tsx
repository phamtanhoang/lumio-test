import type { Metadata } from "next";

import { ComingSoon } from "@/components/shared/ComingSoon";

export const metadata: Metadata = { title: "Servers" };

export default function ServersPage() {
  return (
    <ComingSoon
      title="Servers"
      description="The full fleet inventory with filters, search, and per-server detail views."
    />
  );
}
