export type TimeRange =
  | { kind: "24h" }
  | { kind: "week" }
  | { kind: "month" }
  | { kind: "custom"; from: string; to: string };

export type TimeRangeKind = TimeRange["kind"];
