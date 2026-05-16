import type { ServerCluster } from "@/lib/groupByLocation";
import { cn } from "@/lib/cn";

import styles from "./styles.module.css";

interface ServerTooltipProps {
  cluster: ServerCluster;
  x: number;
  y: number;
}

export function ServerTooltip({ cluster, x, y }: ServerTooltipProps) {
  const preview = cluster.servers.slice(0, 3);
  const remaining = cluster.servers.length - preview.length;

  return (
    <div
      role="tooltip"
      style={{ left: x + 12, top: y + 12 }}
      className={styles.tooltip}
    >
      <p className={styles.head}>
        <span className={styles.country}>{cluster.country}</span>
        <span className={styles.count}>
          {cluster.servers.length} server
          {cluster.servers.length === 1 ? "" : "s"}
        </span>
      </p>

      <ul className={styles.list}>
        {preview.map((s) => (
          <li key={s.id} className={styles.row}>
            <span className={styles.identifier}>
              <span className={styles.name}>{s.name}</span>
              <span className={styles.ip}>{s.ip}</span>
            </span>
            <span
              className={cn(
                styles.dot,
                s.status === "online" ? styles.dotOnline : styles.dotOffline
              )}
              aria-hidden
            />
          </li>
        ))}
        {remaining > 0 ? (
          <li className={styles.more}>+{remaining} more in this region</li>
        ) : null}
      </ul>
    </div>
  );
}
