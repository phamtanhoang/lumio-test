import { ArrowLeft, Hourglass } from "lucide-react";
import Link from "next/link";
import type { ReactNode } from "react";

import styles from "./styles.module.css";

interface ComingSoonProps {
  title: string;
  description?: ReactNode;
  backHref?: string;
  backLabel?: string;
}

export function ComingSoon({
  title,
  description,
  backHref = "/dashboard",
  backLabel = "Back to dashboard",
}: ComingSoonProps) {
  return (
    <div className={styles.wrap}>
      <div className={styles.card}>
        <div className={styles.iconBubble}>
          <Hourglass className={styles.iconLg} aria-hidden />
        </div>
        <p className={styles.eyebrow}>Coming soon</p>
        <h1 className={styles.title}>{title}</h1>
        <p className={styles.description}>
          {description ?? "This section is on the roadmap. The dashboard is the only built-out view right now."}
        </p>
        <Link href={backHref} className={styles.backBtn}>
          <ArrowLeft className={styles.iconSm} aria-hidden />
          {backLabel}
        </Link>
      </div>
    </div>
  );
}
