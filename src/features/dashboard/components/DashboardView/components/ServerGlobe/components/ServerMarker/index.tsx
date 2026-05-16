"use client";

import type { MouseEvent } from "react";
import { Marker } from "react-simple-maps";

import type { ServerCluster } from "@/features/dashboard/lib";

import styles from "./styles.module.css";

interface ServerMarkerProps {
  cluster: ServerCluster;
  onHover: (cluster: ServerCluster, x: number, y: number) => void;
  onLeave: () => void;
}

function clusterRadius(count: number): number {
  const base = 5;
  return Math.min(base + Math.sqrt(count) * 1.5, 12);
}

export function ServerMarker({ cluster, onHover, onLeave }: ServerMarkerProps) {
  const r = clusterRadius(cluster.servers.length);
  const hasOffline = cluster.servers.some((s) => s.status === "offline");
  const color = hasOffline ? "hsl(var(--danger))" : "hsl(var(--primary))";

  return (
    <Marker
      coordinates={cluster.coordinates}
      onMouseEnter={(e: MouseEvent<SVGGElement>) =>
        onHover(cluster, e.clientX, e.clientY)
      }
      onMouseMove={(e: MouseEvent<SVGGElement>) =>
        onHover(cluster, e.clientX, e.clientY)
      }
      onMouseLeave={onLeave}
      style={{ default: { cursor: "pointer", outline: "none" } }}
    >
      <circle r={r * 1.8} fill={color} opacity={0.2} className={styles.pulse} />
      <circle r={r * 1.3} fill={color} opacity={0.22} />
      <circle r={r * 0.95} fill="white" />
      <circle r={r * 0.75} fill={color} />
      {cluster.servers.length > 1 ? (
        <text
          textAnchor="middle"
          y={r + 14}
          className={styles.label}
          style={{
            paintOrder: "stroke",
            stroke: "hsl(var(--background))",
            strokeWidth: 3,
          }}
        >
          {cluster.servers.length}
        </text>
      ) : null}
    </Marker>
  );
}
