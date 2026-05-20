"use client";

import { useMemo } from "react";

import { topByField, type TopEntry } from "@/lib/topByField";
import { topCountries, type CountryEntry } from "@/lib/topCountries";
import type { Server } from "@/types/server.types";

export interface ServerStats {
  total: number;
  online: number;
  offline: number;
  onlineRate: number; // 0..1
  topOS: TopEntry<string>[];
  topPlatform: TopEntry<string>[];
  topArch: TopEntry<string>[];
  topCountries: CountryEntry[];
}

export function useServerStats(servers: ReadonlyArray<Server>): ServerStats {
  return useMemo(() => {
    const total = servers.length;
    const online = servers.reduce(
      (acc, s) => acc + (s.status === "online" ? 1 : 0),
      0
    );
    const offline = total - online;
    return {
      total,
      online,
      offline,
      onlineRate: total === 0 ? 0 : online / total,
      topOS: topByField(servers, "os"),
      topPlatform: topByField(servers, "platform"),
      topArch: topByField(servers, "arch"),
      // Surface every country so the right panel can render the default top 5
      // and expand to "see all" without an extra hook call.
      topCountries: topCountries(servers, Infinity),
    };
  }, [servers]);
}
