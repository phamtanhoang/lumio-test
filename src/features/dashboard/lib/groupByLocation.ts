import type { Server } from "@/features/dashboard/types";

export interface ServerCluster {
  id: string;
  coordinates: [number, number];
  country: string;
  countryCode: string;
  servers: Server[];
}

export function groupByLocation(
  servers: ReadonlyArray<Server>
): ServerCluster[] {
  const buckets = new Map<string, Server[]>();

  for (const server of servers) {
    const existing = buckets.get(server.countryCode);
    if (existing) {
      existing.push(server);
    } else {
      buckets.set(server.countryCode, [server]);
    }
  }

  return Array.from(buckets.entries()).map(([code, group]) => {
    const sumLon = group.reduce((acc, s) => acc + s.coordinates[0], 0);
    const sumLat = group.reduce((acc, s) => acc + s.coordinates[1], 0);
    return {
      id: code,
      countryCode: code,
      country: group[0].country,
      coordinates: [sumLon / group.length, sumLat / group.length] as [
        number,
        number
      ],
      servers: group,
    };
  });
}
