import activities from "@/data/activities.json";
import servers from "@/data/servers.json";
import type { ActivityEvent, Server } from "@/types/server.types";

export async function fetchServers(): Promise<Server[]> {
  return servers as Server[];
}

export async function fetchActivities(): Promise<ActivityEvent[]> {
  return activities as ActivityEvent[];
}
