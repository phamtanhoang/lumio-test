import { ArrowUpRight, Info } from "lucide-react";
import Image from "next/image";
import { memo } from "react";

import { flagUrl, type CountryEntry } from "@/features/dashboard/lib";
import { formatCompactNumber } from "@/lib/format";

import styles from "./styles.module.css";

interface CountryBreakdownProps {
  total: number;
  entries: ReadonlyArray<CountryEntry>;
}

export const CountryBreakdown = memo(function CountryBreakdown({
  total,
  entries,
}: CountryBreakdownProps) {
  return (
    <div className={styles.root}>
      <div>
        <div className={styles.numberRow}>
          <p className={styles.number}>{formatCompactNumber(total)}</p>
          <button
            type="button"
            aria-label="About this metric"
            className={styles.infoBtn}
          >
            <Info className={styles.iconSm} aria-hidden />
          </button>
        </div>
        <p className={styles.subtitle}>Global servers worldwide</p>
      </div>

      <ul className={styles.list}>
        {entries.map((entry) => (
          <li key={entry.countryCode} className={styles.item}>
            <div className={styles.row}>
              <span className={styles.left}>
                <span className={styles.flagBox}>
                  <Image
                    src={flagUrl(entry.countryCode)}
                    alt={`${entry.country} flag`}
                    width={36}
                    height={28}
                    className={styles.flagImg}
                    unoptimized
                  />
                </span>
                <span className={styles.country}>{entry.country}</span>
              </span>
              <span className={styles.percent}>
                {Math.round(entry.share * 100)}%
              </span>
            </div>
            <div
              className={styles.track}
              role="progressbar"
              aria-valuenow={Math.round(entry.share * 100)}
              aria-valuemin={0}
              aria-valuemax={100}
              aria-label={`${entry.country}: ${entry.count} servers`}
            >
              <div
                className={styles.bar}
                style={{ width: `${Math.max(entry.share * 100, 6)}%` }}
              />
            </div>
          </li>
        ))}
      </ul>

      <button type="button" className={styles.seeAll}>
        See all regions
        <ArrowUpRight className={styles.iconSm} aria-hidden />
      </button>
    </div>
  );
});
