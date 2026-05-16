import { Card, CardContent, CardHeader } from "@/components/ui/Card";
import { Skeleton } from "@/components/ui/Skeleton";

import styles from "./styles.module.css";

export function DashboardSkeleton() {
  return (
    <div className={styles.root}>
      <Skeleton className={styles.titleSk} />

      <div className={styles.statsGrid}>
        {Array.from({ length: 4 }).map((_, i) => (
          <Card key={i} className={styles.statCard}>
            <Skeleton className={styles.statLabel} />
            <Skeleton className={styles.statValue} />
            <Skeleton className={styles.statHint} />
          </Card>
        ))}
      </div>

      <Card>
        <CardHeader>
          <Skeleton className={styles.cardTitle} />
        </CardHeader>
        <CardContent>
          <div className={styles.mapGrid}>
            <Skeleton className={styles.mapBox} />
            <div className={styles.countriesList}>
              {Array.from({ length: 5 }).map((_, i) => (
                <Skeleton key={i} className={styles.countryRow} />
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      <div className={styles.breakdowns}>
        {Array.from({ length: 3 }).map((_, i) => (
          <Card key={i}>
            <CardHeader>
              <Skeleton className={styles.breakdownTitle} />
            </CardHeader>
            <CardContent className={styles.breakdownBody}>
              {Array.from({ length: 4 }).map((__, j) => (
                <Skeleton key={j} className={styles.breakdownRow} />
              ))}
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
