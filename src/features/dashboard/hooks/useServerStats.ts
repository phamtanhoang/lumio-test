"use client";

import { useMemo } from "react";

import {
  topByField,
  topCountries,
  type CountryEntry,
  type TopEntry,
} from "@/features/dashboard/lib";
import type { Server } from "@/features/dashboard/types";

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
      topCountries: topCountries(servers),
    };
  }, [servers]);
}
