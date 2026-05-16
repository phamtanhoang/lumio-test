import { DashboardSkeleton } from "@/features/dashboard/components";

import styles from "./loading.module.css";

export default function Loading() {
  return (
    <div className={styles.wrap}>
      <DashboardSkeleton />
    </div>
  );
}
