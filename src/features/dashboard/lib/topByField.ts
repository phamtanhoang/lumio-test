import type { Server } from "@/features/dashboard/types";

export interface TopEntry<T extends string> {
  key: T;
  count: number;
  share: number; // 0..1
}

export function topByField<K extends keyof Server>(
  servers: ReadonlyArray<Server>,
  field: K,
  limit = 5
): TopEntry<string>[] {
  if (servers.length === 0) return [];

  const counts = new Map<string, number>();
  for (const server of servers) {
    const value = String(server[field]);
    counts.set(value, (counts.get(value) ?? 0) + 1);
  }

  const total = servers.length;
  return Array.from(counts.entries())
    .map(([key, count]) => ({ key, count, share: count / total }))
    .sort((a, b) => b.count - a.count)
    .slice(0, limit);
}
