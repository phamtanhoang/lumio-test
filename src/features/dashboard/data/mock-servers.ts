import type {
  ActivityEvent,
  Server,
  ServerArch,
  ServerPlatform,
} from "@/features/dashboard/types";

// Seeded so SSR and CSR produce the same dataset (no hydration mismatch).

const LOCATIONS: ReadonlyArray<{
  country: string;
  countryCode: string;
  coordinates: [number, number];
}> = [
  { country: "United States", countryCode: "US", coordinates: [-95.7, 37.1] },
  { country: "Germany", countryCode: "DE", coordinates: [10.45, 51.16] },
  { country: "Japan", countryCode: "JP", coordinates: [138.25, 36.2] },
  { country: "Brazil", countryCode: "BR", coordinates: [-51.92, -14.23] },
  { country: "Vietnam", countryCode: "VN", coordinates: [108.27, 14.05] },
  { country: "Australia", countryCode: "AU", coordinates: [133.77, -25.27] },
  { country: "India", countryCode: "IN", coordinates: [78.96, 20.59] },
  { country: "United Kingdom", countryCode: "GB", coordinates: [-3.43, 55.37] },
  { country: "Canada", countryCode: "CA", coordinates: [-106.34, 56.13] },
  { country: "France", countryCode: "FR", coordinates: [2.21, 46.22] },
  { country: "Singapore", countryCode: "SG", coordinates: [103.82, 1.35] },
  { country: "South Africa", countryCode: "ZA", coordinates: [22.94, -30.56] },
];

const OS_OPTIONS: ReadonlyArray<{ os: string; version: string }> = [
  { os: "Ubuntu", version: "22.04 LTS" },
  { os: "Ubuntu", version: "20.04 LTS" },
  { os: "CentOS", version: "8" },
  { os: "Debian", version: "12" },
  { os: "Windows Server", version: "2022" },
  { os: "Windows Server", version: "2019" },
  { os: "Red Hat Enterprise", version: "9.2" },
  { os: "Alpine", version: "3.19" },
];

const PLATFORMS: readonly ServerPlatform[] = [
  "Apache",
  "Nginx",
  "IIS",
  "Tomcat",
  "Caddy",
];
const ARCHES: readonly ServerArch[] = ["x86", "x64", "arm", "arm64"];

function seededRandom(seed: number): () => number {
  let state = seed;
  return () => {
    state = (state * 9301 + 49297) % 233280;
    return state / 233280;
  };
}

function pick<T>(arr: readonly T[], rand: () => number): T {
  return arr[Math.floor(rand() * arr.length)];
}

function jitter(
  base: readonly [number, number],
  rand: () => number
): [number, number] {
  return [base[0] + (rand() - 0.5) * 6, base[1] + (rand() - 0.5) * 6];
}

// Fixed anchor so time-range filter boundaries stay stable across renders.
const ANCHOR = new Date("2026-05-14T10:00:00Z");

function daysBeforeAnchor(days: number, hours = 0): string {
  const d = new Date(ANCHOR);
  d.setUTCDate(d.getUTCDate() - days);
  d.setUTCHours(d.getUTCHours() - hours);
  return d.toISOString();
}

function pad(n: number, width = 2): string {
  return n.toString().padStart(width, "0");
}

export function generateMockServers(count = 60): Server[] {
  const rand = seededRandom(42);
  const servers: Server[] = [];

  for (let i = 0; i < count; i++) {
    const location = LOCATIONS[i % LOCATIONS.length];
    const osChoice = pick(OS_OPTIONS, rand);
    const platform = pick(PLATFORMS, rand);
    const arch = pick(ARCHES, rand);
    const ageDays = Math.floor(rand() * 60);
    const updatedOffset = Math.floor(rand() * Math.max(ageDays, 1));

    servers.push({
      id: `srv-${pad(i + 1, 3)}`,
      ip: `${10 + (i % 200)}.${pad(Math.floor(rand() * 255), 3)}.${pad(
        Math.floor(rand() * 255),
        3
      )}.${pad((i % 254) + 1, 3)}`,
      name: `${location.countryCode}-NODE-${pad(i + 1, 3)}`,
      country: location.country,
      countryCode: location.countryCode,
      os: osChoice.os,
      version: osChoice.version,
      platform,
      arch,
      status: rand() > 0.18 ? "online" : "offline",
      coordinates: jitter(location.coordinates, rand),
      createdAt: daysBeforeAnchor(ageDays),
      updatedAt: daysBeforeAnchor(ageDays - updatedOffset),
    });
  }

  return servers;
}

const ACTIVITY_VERBS: ReadonlyArray<{
  type: ActivityEvent["type"];
  msg: (s: Server) => string;
}> = [
  { type: "created", msg: (s) => `${s.name} was created` },
  { type: "alias_changed", msg: (s) => `${s.name} was changed alias` },
  { type: "removed", msg: (s) => `${s.name} was removed` },
  { type: "status_changed", msg: (s) => `${s.name} went ${s.status}` },
  { type: "updated", msg: (s) => `${s.name} configuration was updated` },
];

export function generateMockActivities(
  servers: Server[],
  count = 40
): ActivityEvent[] {
  const rand = seededRandom(99);
  return Array.from({ length: count }, (_, i) => {
    const server = pick(servers, rand);
    const verb = pick(ACTIVITY_VERBS, rand);
    return {
      id: `evt-${pad(i + 1, 3)}`,
      serverId: server.id,
      serverName: server.name,
      type: verb.type,
      message: verb.msg(server),
      timestamp: daysBeforeAnchor(
        Math.floor(rand() * 30),
        Math.floor(rand() * 23)
      ),
    };
  }).sort((a, b) => b.timestamp.localeCompare(a.timestamp));
}

export const MOCK_SERVERS: ReadonlyArray<Server> = generateMockServers();
export const MOCK_ACTIVITIES: ReadonlyArray<ActivityEvent> =
  generateMockActivities([...MOCK_SERVERS]);
