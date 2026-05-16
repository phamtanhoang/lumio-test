export type ServerStatus = "online" | "offline";

export type ServerPlatform = "Apache" | "Nginx" | "IIS" | "Tomcat" | "Caddy";

export type ServerArch = "x86" | "x64" | "arm" | "arm64";

export interface Server {
  id: string;
  ip: string;
  name: string;
  country: string;
  countryCode: string;
  os: string;
  version: string;
  platform: ServerPlatform;
  arch: ServerArch;
  status: ServerStatus;
  // [longitude, latitude] — react-simple-maps convention; prevents lat/lng swap.
  coordinates: [number, number];
  createdAt: string;
  updatedAt: string;
}

export type ActivityType =
  | "created"
  | "removed"
  | "alias_changed"
  | "status_changed"
  | "updated";

export interface ActivityEvent {
  id: string;
  serverId: string;
  serverName: string;
  type: ActivityType;
  message: string;
  timestamp: string;
}
