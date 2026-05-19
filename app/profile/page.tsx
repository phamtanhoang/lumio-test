import type { Metadata } from "next";

import { ComingSoon } from "@/components/shared/ComingSoon";

export const metadata: Metadata = { title: "Profile" };

export default function ProfilePage() {
  return (
    <ComingSoon
      title="Profile"
      description="Account details, avatar, password, and session management."
    />
  );
}
