"use client";

import { ArrowUpRight, ChevronUp } from "lucide-react";
import Image from "next/image";
import { memo, useState } from "react";

import { InfoIcon } from "@/components/ui/InfoIcon";
import { Tooltip } from "@/components/ui/Tooltip";
import { flagUrl } from "@/lib/config";
import { formatCompactNumber, formatNumber } from "@/lib/format";
import type { CountryEntry } from "@/lib/topCountries";

import styles from "./styles.module.css";

interface CountryBreakdownProps {
  total: number;
  entries: ReadonlyArray<CountryEntry>;
  initialLimit?: number;
}

export const CountryBreakdown = memo(function CountryBreakdown({
  total,
  entries,
  initialLimit = 5,
}: CountryBreakdownProps) {
  const [expanded, setExpanded] = useState(false);
  const hasMore = entries.length > initialLimit;
  const visible = expanded || !hasMore ? entries : entries.slice(0, initialLimit);

  return (
    <div className={styles.root}>
      <div>
        <div className={styles.numberRow}>
          <p className={styles.number}>
            <Tooltip
              content={`${formatNumber(total)} servers across ${entries.length} ${entries.length === 1 ? "country" : "countries"} in the selected window.`}
            >
              <span>{formatCompactNumber(total)}</span>
            </Tooltip>
          </p>
          <InfoIcon content="Total servers across all countries in the selected window. The list below ranks them by share." />
        </div>
        <p className={styles.subtitle}>Global servers worldwide</p>
      </div>

      <ul className={styles.list}>
        {visible.map((entry) => (
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
              <Tooltip
                position="top"
                align="end"
                content={`${formatNumber(entry.count)} of ${formatNumber(total)} servers (${Math.round(entry.share * 100)}%) in ${entry.country}.`}
              >
                <span className={styles.percent}>
                  {Math.round(entry.share * 100)}%
                </span>
              </Tooltip>
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

      {hasMore ? (
        <button
          type="button"
          onClick={() => setExpanded((v) => !v)}
          aria-expanded={expanded}
          className={styles.seeAll}
        >
          {expanded ? (
            <>
              Show less
              <ChevronUp className={styles.iconSm} aria-hidden />
            </>
          ) : (
            <>
              See all regions ({entries.length})
              <ArrowUpRight className={styles.iconSm} aria-hidden />
            </>
          )}
        </button>
      ) : null}
    </div>
  );
});
