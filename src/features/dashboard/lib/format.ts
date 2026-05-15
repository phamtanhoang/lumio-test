const COMPACT = new Intl.NumberFormat("en-US", {
  notation: "compact",
  maximumFractionDigits: 1,
});

const FULL = new Intl.NumberFormat("en-US");

export function formatCompactNumber(n: number): string {
  return COMPACT.format(n);
}

export function formatNumber(n: number): string {
  return FULL.format(n);
}

export function formatPercent(value: number, total: number): string {
  if (total === 0) return "0%";
  return `${Math.round((value / total) * 100)}%`;
}
