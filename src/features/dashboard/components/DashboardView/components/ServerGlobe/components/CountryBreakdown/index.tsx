import { ArrowUpRight, Info } from "lucide-react";
import Image from "next/image";
import { memo } from "react";
import {
  flagUrl,
  formatCompactNumber,
  type CountryEntry,
} from "@/features/dashboard/lib";

interface CountryBreakdownProps {
  total: number;
  entries: ReadonlyArray<CountryEntry>;
}

export const CountryBreakdown = memo(function CountryBreakdown({
  total,
  entries,
}: CountryBreakdownProps) {
  return (
    <div className="flex h-full flex-col gap-4 p-5 sm:p-6">
      <div>
        <div className="flex items-center gap-2">
          <p className="text-3xl font-bold tracking-tight tabular-nums">
            {formatCompactNumber(total)}
          </p>
          <button
            type="button"
            aria-label="About this metric"
            className="text-muted-foreground hover:text-foreground"
          >
            <Info className="h-4 w-4" aria-hidden />
          </button>
        </div>
        <p className="text-sm text-muted-foreground">
          Global servers worldwide
        </p>
      </div>

      <ul className="space-y-3">
        {entries.map((entry) => (
          <li key={entry.countryCode} className="space-y-1.5">
            <div className="flex items-center justify-between gap-3 text-sm">
              <span className="flex min-w-0 items-center gap-2.5">
                <span className="flex h-7 w-7 shrink-0 items-center justify-center overflow-hidden rounded-full ring-1 ring-border">
                  <Image
                    src={flagUrl(entry.countryCode)}
                    alt={`${entry.country} flag`}
                    width={36}
                    height={28}
                    className="h-full w-full object-cover"
                    unoptimized
                  />
                </span>
                <span className="truncate font-medium">{entry.country}</span>
              </span>
              <span className="shrink-0 tabular-nums text-muted-foreground">
                {Math.round(entry.share * 100)}%
              </span>
            </div>
            <div
              className="h-1.5 overflow-hidden rounded-full bg-muted"
              role="progressbar"
              aria-valuenow={Math.round(entry.share * 100)}
              aria-valuemin={0}
              aria-valuemax={100}
              aria-label={`${entry.country}: ${entry.count} servers`}
            >
              <div
                className="h-full rounded-full bg-primary transition-[width] duration-500 ease-out"
                style={{ width: `${Math.max(entry.share * 100, 6)}%` }}
              />
            </div>
          </li>
        ))}
      </ul>

      <button
        type="button"
        className="mt-auto inline-flex items-center gap-1.5 self-start text-sm font-semibold text-primary hover:underline"
      >
        See all regions
        <ArrowUpRight className="h-4 w-4" aria-hidden />
      </button>
    </div>
  );
});
