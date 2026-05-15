import type { ServerCluster } from "@/features/dashboard/lib";
import { cn } from "@/lib/cn";

interface ServerTooltipProps {
  cluster: ServerCluster;
  x: number;
  y: number;
}

export function ServerTooltip({ cluster, x, y }: ServerTooltipProps) {
  const preview = cluster.servers.slice(0, 3);
  const remaining = cluster.servers.length - preview.length;

  return (
    <div
      role="tooltip"
      style={{ left: x + 12, top: y + 12 }}
      className={cn(
        "pointer-events-none fixed z-50 w-64 rounded-lg border border-border bg-card p-3 shadow-xl",
        "text-sm text-card-foreground"
      )}
    >
      <p className="mb-2 flex items-center justify-between gap-2">
        <span className="font-semibold">{cluster.country}</span>
        <span className="rounded-full bg-primary/10 px-2 py-0.5 text-xs font-medium text-primary">
          {cluster.servers.length} server
          {cluster.servers.length === 1 ? "" : "s"}
        </span>
      </p>

      <ul className="space-y-1.5">
        {preview.map((s) => (
          <li key={s.id} className="flex items-center justify-between gap-2">
            <span className="truncate">
              <span className="font-medium">{s.name}</span>
              <span className="ml-1 text-muted-foreground">{s.ip}</span>
            </span>
            <span
              className={cn(
                "inline-flex h-2 w-2 shrink-0 rounded-full",
                s.status === "online" ? "bg-success" : "bg-danger"
              )}
              aria-hidden
            />
          </li>
        ))}
        {remaining > 0 ? (
          <li className="text-xs text-muted-foreground">
            +{remaining} more in this region
          </li>
        ) : null}
      </ul>
    </div>
  );
}
