"use client";

import { X } from "lucide-react";
import Image from "next/image";
import { useEffect } from "react";

import { flagUrl } from "@/lib/config";
import { formatDateTime } from "@/lib/date";
import { cn } from "@/lib/cn";
import type { ServerCluster } from "@/lib/groupByLocation";

import styles from "./styles.module.css";

interface ClusterDetailsModalProps {
  cluster: ServerCluster;
  onClose: () => void;
}

export function ClusterDetailsModal({ cluster, onClose }: ClusterDetailsModalProps) {
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    // Lock body scroll so the modal feels like a real overlay on mobile.
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = prev;
    };
  }, [onClose]);

  const onlineCount = cluster.servers.filter((s) => s.status === "online").length;
  const offlineCount = cluster.servers.length - onlineCount;

  return (
    <div
      className={styles.backdrop}
      role="presentation"
      onClick={onClose}
      onTouchStart={(e) => e.stopPropagation()}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-label={`${cluster.country} servers`}
        className={styles.modal}
        onClick={(e) => e.stopPropagation()}
      >
        <span className={styles.grabber} aria-hidden />
        <header className={styles.head}>
          <span className={styles.flagBox}>
            <Image
              src={flagUrl(cluster.countryCode)}
              alt=""
              width={36}
              height={28}
              className={styles.flagImg}
              unoptimized
            />
          </span>
          <div className={styles.titleBlock}>
            <h2 className={styles.title}>{cluster.country}</h2>
            <p className={styles.subtitle}>
              {cluster.servers.length} server
              {cluster.servers.length === 1 ? "" : "s"}
              {" · "}
              <span className={styles.online}>{onlineCount} online</span>
              {offlineCount > 0 ? (
                <>
                  {" · "}
                  <span className={styles.offline}>{offlineCount} offline</span>
                </>
              ) : null}
            </p>
          </div>
          <button
            type="button"
            aria-label="Close details"
            onClick={onClose}
            className={styles.closeBtn}
          >
            <X className={styles.closeIcon} aria-hidden />
          </button>
        </header>

        <ul className={styles.list}>
          {cluster.servers.map((s) => (
            <li key={s.id} className={styles.row}>
              <div className={styles.rowHead}>
                <span className={styles.name}>{s.name}</span>
                <span
                  className={cn(
                    styles.statusBadge,
                    s.status === "online"
                      ? styles.statusOnline
                      : styles.statusOffline
                  )}
                >
                  <span
                    className={cn(
                      styles.statusDot,
                      s.status === "online"
                        ? styles.statusDotOnline
                        : styles.statusDotOffline
                    )}
                    aria-hidden
                  />
                  {s.status}
                </span>
              </div>
              <dl className={styles.meta}>
                <div className={styles.metaItem}>
                  <dt>IP</dt>
                  <dd className={styles.mono}>{s.ip}</dd>
                </div>
                <div className={styles.metaItem}>
                  <dt>OS</dt>
                  <dd>
                    {s.os} {s.version}
                  </dd>
                </div>
                <div className={styles.metaItem}>
                  <dt>Platform</dt>
                  <dd>{s.platform}</dd>
                </div>
                <div className={styles.metaItem}>
                  <dt>Arch</dt>
                  <dd>{s.arch}</dd>
                </div>
                <div className={styles.metaItem}>
                  <dt>Created</dt>
                  <dd className={styles.mono}>{formatDateTime(s.createdAt)}</dd>
                </div>
                <div className={styles.metaItem}>
                  <dt>Updated</dt>
                  <dd className={styles.mono}>{formatDateTime(s.updatedAt)}</dd>
                </div>
              </dl>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
