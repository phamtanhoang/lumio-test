import type { Server } from "@/features/dashboard/types";

export interface CountryEntry {
  country: string;
  countryCode: string;
  count: number;
  share: number; // 0..1
}

export function topCountries(
  servers: ReadonlyArray<Server>,
  limit = 5
): CountryEntry[] {
  if (servers.length === 0) return [];

  const buckets = new Map<string, { country: string; count: number }>();
  for (const server of servers) {
    const entry = buckets.get(server.countryCode);
    if (entry) entry.count += 1;
    else buckets.set(server.countryCode, { country: server.country, count: 1 });
  }

  const total = servers.length;
  return Array.from(buckets.entries())
    .map(([code, { country, count }]) => ({
      country,
      countryCode: code,
      count,
      share: count / total,
    }))
    .sort((a, b) => b.count - a.count)
    .slice(0, limit);
}
