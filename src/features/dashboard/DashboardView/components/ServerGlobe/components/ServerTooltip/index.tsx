import type { ServerCluster } from "@/lib/groupByLocation";
import { cn } from "@/lib/cn";

import styles from "./styles.module.css";

interface ServerTooltipProps {
  cluster: ServerCluster;
  x: number;
  y: number;
  onMouseEnter?: () => void;
  onMouseLeave?: () => void;
}

export function ServerTooltip({
  cluster,
  x,
  y,
  onMouseEnter,
  onMouseLeave,
}: ServerTooltipProps) {
  return (
    <div
      role="tooltip"
      style={{ left: x + 12, top: y + 12 }}
      className={styles.tooltip}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
    >
      <p className={styles.head}>
        <span className={styles.country}>{cluster.country}</span>
        <span className={styles.count}>
          {cluster.servers.length} server
          {cluster.servers.length === 1 ? "" : "s"}
        </span>
      </p>

      <ul className={styles.list}>
        {cluster.servers.map((s) => (
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
      </ul>
    </div>
  );
}
