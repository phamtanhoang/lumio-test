import { MoreVertical, TrendingDown, TrendingUp } from "lucide-react";
import { memo, type ReactNode } from "react";
import { Card } from "@/components/ui/Card";
import { cn } from "@/lib/cn";

export interface StatTrend {
  direction: "up" | "down";
  value: number;
  label: string;
}

interface StatCardProps {
  label: string;
  value: ReactNode;
  hint?: string;
  badge?: { text: string; tone?: "new" | "beta" };
  icon?: ReactNode;
  trend?: StatTrend;
}

const BADGE_TONE: Record<NonNullable<StatCardProps["badge"]>["tone"] & string, string> = {
  new: "bg-emerald-100 text-emerald-700",
  beta: "bg-fuchsia-100 text-fuchsia-700",
};

function formatTrendPercent(value: number): string {
  return (value * 100).toFixed(1).replace(/\.0$/, "");
}

export const StatCard = memo(function StatCard({
  label,
  value,
  hint,
  badge,
  icon,
  trend,
}: StatCardProps) {
  const TrendIcon = trend?.direction === "down" ? TrendingDown : TrendingUp;
  const trendTone = trend?.direction === "down" ? "text-danger" : "text-success";

  return (
    <Card className="relative overflow-hidden p-5">
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-2">
          <p className="text-sm font-medium text-muted-foreground">{label}</p>
          {badge ? (
            <span
              className={cn(
                "rounded-full px-2 py-0.5 text-[10px] font-semibold uppercase",
                BADGE_TONE[badge.tone ?? "new"]
              )}
            >
              {badge.text}
            </span>
          ) : null}
        </div>
        <button
          type="button"
          aria-label="More options"
          className="text-muted-foreground hover:text-foreground"
        >
          <MoreVertical className="h-4 w-4" aria-hidden />
        </button>
      </div>

      <p className="mt-3 text-3xl font-bold tracking-tight tabular-nums">
        {value}
      </p>

      <div className="mt-3 flex items-end justify-between gap-2">
        <div className="text-xs">
          {trend ? (
            <span className="inline-flex items-center gap-1">
              <TrendIcon className={cn("h-3.5 w-3.5", trendTone)} aria-hidden />
              <span className={cn("font-semibold", trendTone)}>
                {trend.direction === "down" ? "−" : "+"}
                {formatTrendPercent(trend.value)}%
              </span>
              <span className="text-muted-foreground">{trend.label}</span>
            </span>
          ) : hint ? (
            <span className="text-muted-foreground">{hint}</span>
          ) : null}
        </div>
        {icon ? (
          <div className="flex h-9 w-9 items-center justify-center rounded-full bg-muted text-muted-foreground">
            {icon}
          </div>
        ) : null}
      </div>
    </Card>
  );
});
