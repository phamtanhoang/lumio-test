export interface TopEntry<T extends string> {
  key: T;
  count: number;
  share: number; // 0..1
}

export function topByField<T, K extends keyof T>(
  items: ReadonlyArray<T>,
  field: K,
  limit = 5
): TopEntry<string>[] {
  if (items.length === 0) return [];

  const counts = new Map<string, number>();
  for (const item of items) {
    const value = String(item[field]);
    counts.set(value, (counts.get(value) ?? 0) + 1);
  }

  const total = items.length;
  return Array.from(counts.entries())
    .map(([key, count]) => ({ key, count, share: count / total }))
    .sort((a, b) => b.count - a.count)
    .slice(0, limit);
}
