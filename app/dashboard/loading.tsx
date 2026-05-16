import { DashboardSkeleton } from "@/features/dashboard";

import styles from "./loading.module.css";

export default function Loading() {
  return (
    <div className={styles.wrap}>
      <DashboardSkeleton />
    </div>
  );
}
