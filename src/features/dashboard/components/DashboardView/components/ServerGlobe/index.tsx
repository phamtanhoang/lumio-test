"use client";

import { Calendar, Minus, Plus, Settings2, UserPlus, Zap } from "lucide-react";
import { useCallback, useMemo, useState } from "react";
import {
  ComposableMap,
  Geographies,
  Geography,
  ZoomableGroup,
} from "react-simple-maps";
import { Card } from "@/components/ui/Card";
import type { Server } from "@/features/dashboard/types";
import {
  groupByLocation,
  WORLD_MAP_URL,
  type CountryEntry,
  type ServerCluster,
} from "@/features/dashboard/lib";
import { cn } from "@/lib/cn";
import { CountryBreakdown, ServerMarker, ServerTooltip } from "./components";

interface ServerGlobeProps {
  servers: ReadonlyArray<Server>;
  topCountries: ReadonlyArray<CountryEntry>;
  total: number;
}

interface TooltipState {
  cluster: ServerCluster;
  x: number;
  y: number;
}

const REGION_LEGEND = [
  { color: "bg-violet-500", label: "Europe" },
  { color: "bg-blue-500", label: "Asia" },
  { color: "bg-amber-500", label: "Africa" },
  { color: "bg-pink-500", label: "America" },
];

export function ServerGlobe({ servers, topCountries, total }: ServerGlobeProps) {
  const clusters = useMemo(() => groupByLocation(servers), [servers]);

  const [tooltip, setTooltip] = useState<TooltipState | null>(null);
  // ZoomableGroup requires zoom + center controlled together to keep pan working.
  const [position, setPosition] = useState<{
    coordinates: [number, number];
    zoom: number;
  }>({ coordinates: [0, 20], zoom: 1 });

  const handleHover = useCallback(
    (cluster: ServerCluster, x: number, y: number) =>
      setTooltip({ cluster, x, y }),
    []
  );
  const handleLeave = useCallback(() => setTooltip(null), []);

  const canZoomIn = position.zoom < 3;
  const canZoomOut = position.zoom > 1;

  const handleZoom = useCallback(
    (delta: 1 | -1) =>
      setPosition((p) => {
        const next = p.zoom * (delta === 1 ? 1.5 : 1 / 1.5);
        return { ...p, zoom: Math.max(1, Math.min(3, next)) };
      }),
    []
  );

  return (
    <Card className="overflow-hidden">
      <div className="flex flex-wrap items-center justify-between gap-3 px-5 pt-5 sm:px-6 sm:pt-6">
        <div className="flex items-center gap-2">
          <h2 className="text-base font-semibold tracking-tight sm:text-lg">
            Target Demographics
          </h2>
          <span className="rounded-full bg-fuchsia-100 px-2 py-0.5 text-[10px] font-semibold uppercase text-fuchsia-700">
            Beta
          </span>
        </div>
        <div className="flex items-center gap-2">
          <button
            type="button"
            aria-label="Open calendar"
            className="flex h-9 w-9 items-center justify-center rounded-full border border-border bg-card text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
          >
            <Calendar className="h-4 w-4" aria-hidden />
          </button>
          <button
            type="button"
            aria-label="Map settings"
            className="flex h-9 w-9 items-center justify-center rounded-full border border-border bg-card text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
          >
            <Settings2 className="h-4 w-4" aria-hidden />
          </button>
          <button
            type="button"
            className="inline-flex h-9 items-center gap-1.5 rounded-full bg-primary px-3.5 text-sm font-semibold text-primary-foreground transition-opacity hover:opacity-90"
          >
            <UserPlus className="h-4 w-4" aria-hidden />
            Add server
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-0 lg:grid-cols-[1.6fr_1fr]">
        <div className="relative aspect-[16/10] w-full overflow-hidden bg-gradient-to-br from-muted/40 to-background lg:aspect-auto">
          <div className="pointer-events-none absolute left-4 top-4 z-10 flex h-9 w-9 items-center justify-center rounded-full bg-card/80 text-primary shadow-sm backdrop-blur">
            <Zap className="h-4 w-4" aria-hidden />
          </div>

          <ComposableMap
            projectionConfig={{ scale: 155 }}
            width={980}
            height={520}
            style={{ width: "100%", height: "100%" }}
          >
            {/* Pattern as Geography fill = countries rendered as dot stipple, oceans stay blank. */}
            <defs>
              <pattern
                id="dots"
                width="5"
                height="5"
                patternUnits="userSpaceOnUse"
              >
                <circle
                  cx="2.5"
                  cy="2.5"
                  r="0.9"
                  style={{ fill: "hsl(var(--muted-foreground))", opacity: 0.45 }}
                />
              </pattern>
            </defs>

            <ZoomableGroup
              zoom={position.zoom}
              center={position.coordinates}
              minZoom={1}
              maxZoom={3}
              onMoveEnd={(p) =>
                setPosition({
                  coordinates: p.coordinates as [number, number],
                  zoom: p.zoom,
                })
              }
            >
              <Geographies geography={WORLD_MAP_URL}>
                {({ geographies }) =>
                  geographies.map((geo) => (
                    <Geography
                      key={geo.rsmKey}
                      geography={geo}
                      fill="url(#dots)"
                      stroke="transparent"
                      strokeWidth={0}
                      style={{
                        default: { outline: "none" },
                        hover: { outline: "none", fill: "url(#dots)" },
                        pressed: { outline: "none" },
                      }}
                    />
                  ))
                }
              </Geographies>

              {clusters.map((cluster) => (
                <ServerMarker
                  key={cluster.id}
                  cluster={cluster}
                  onHover={handleHover}
                  onLeave={handleLeave}
                />
              ))}
            </ZoomableGroup>
          </ComposableMap>

          <div className="pointer-events-none absolute bottom-4 left-4 z-10 flex flex-wrap items-center gap-2 rounded-full bg-card/80 px-3 py-1.5 text-xs shadow-sm backdrop-blur">
            {REGION_LEGEND.map(({ color, label }) => (
              <span key={label} className="inline-flex items-center gap-1.5">
                <span className={cn("h-2 w-2 rounded-full", color)} aria-hidden />
                <span className="text-muted-foreground">{label}</span>
              </span>
            ))}
          </div>

          <div className="absolute bottom-4 right-4 z-10 flex flex-col overflow-hidden rounded-full border border-border bg-card shadow-sm">
            <button
              type="button"
              aria-label="Zoom in"
              disabled={!canZoomIn}
              onClick={() => handleZoom(1)}
              className="flex h-9 w-9 items-center justify-center text-muted-foreground transition-colors hover:bg-muted hover:text-foreground disabled:cursor-not-allowed disabled:opacity-50"
            >
              <Plus className="h-4 w-4" aria-hidden />
            </button>
            <div className="h-px bg-border" aria-hidden />
            <button
              type="button"
              aria-label="Zoom out"
              disabled={!canZoomOut}
              onClick={() => handleZoom(-1)}
              className="flex h-9 w-9 items-center justify-center text-muted-foreground transition-colors hover:bg-muted hover:text-foreground disabled:cursor-not-allowed disabled:opacity-50"
            >
              <Minus className="h-4 w-4" aria-hidden />
            </button>
          </div>

          {tooltip ? (
            <ServerTooltip
              cluster={tooltip.cluster}
              x={tooltip.x}
              y={tooltip.y}
            />
          ) : null}
        </div>

        <div className="border-t border-border lg:border-l lg:border-t-0">
          <CountryBreakdown total={total} entries={topCountries} />
        </div>
      </div>
    </Card>
  );
}
