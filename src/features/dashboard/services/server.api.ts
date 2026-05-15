import { MOCK_ACTIVITIES, MOCK_SERVERS } from "@/features/dashboard/data";
import type {
  ActivityEvent,
  Server,
} from "@/features/dashboard/types";

const ARTIFICIAL_LATENCY_MS = 250;

function delay<T>(value: T, ms = ARTIFICIAL_LATENCY_MS): Promise<T> {
  return new Promise((resolve) => setTimeout(() => resolve(value), ms));
}

export async function fetchServers(): Promise<Server[]> {
  return delay([...MOCK_SERVERS]);
}

export async function fetchActivities(): Promise<ActivityEvent[]> {
  return delay([...MOCK_ACTIVITIES]);
}
