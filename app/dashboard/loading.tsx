import { DashboardSkeleton } from "@/features/dashboard/components";

export default function Loading() {
  return (
    <div className="p-4 sm:p-6">
      <DashboardSkeleton />
    </div>
  );
}
