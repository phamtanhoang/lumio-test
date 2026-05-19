"use client";

import { Calendar, Minus, Plus, Settings2, UserPlus, Zap } from "lucide-react";
import { useCallback, useMemo, useRef, useState } from "react";
import {
  ComposableMap,
  Geographies,
  Geography,
  ZoomableGroup,
} from "react-simple-maps";

import { Card } from "@/components/ui/Card";
import { WORLD_MAP_URL } from "@/lib/config";
import { groupByLocation, type ServerCluster } from "@/lib/groupByLocation";
import type { CountryEntry } from "@/lib/topCountries";
import type { Server } from "@/types/server.types";

import { CountryBreakdown, ServerMarker, ServerTooltip } from "./components";

import styles from "./styles.module.css";

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

// Marker color encodes cluster health, not region. Match what the SVG draws.
const STATUS_LEGEND = [
  { className: "bg-primary", label: "All online" },
  { className: "bg-danger", label: "Has offline" },
];

export function ServerGlobe({ servers, topCountries, total }: ServerGlobeProps) {
  const clusters = useMemo(() => groupByLocation(servers), [servers]);

  const [tooltip, setTooltip] = useState<TooltipState | null>(null);
  // Delay close so user can move mouse into the tooltip to scroll its list
  // without it disappearing the moment they leave the marker.
  const closeTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  // ZoomableGroup requires zoom + center controlled together to keep pan working.
  const [position, setPosition] = useState<{
    coordinates: [number, number];
    zoom: number;
  }>({ coordinates: [0, 20], zoom: 1 });

  const cancelClose = useCallback(() => {
    if (closeTimer.current) {
      clearTimeout(closeTimer.current);
      closeTimer.current = null;
    }
  }, []);

  const handleHover = useCallback(
    (cluster: ServerCluster, x: number, y: number) => {
      cancelClose();
      setTooltip({ cluster, x, y });
    },
    [cancelClose]
  );
  const handleLeave = useCallback(() => {
    cancelClose();
    closeTimer.current = setTimeout(() => setTooltip(null), 150);
  }, [cancelClose]);
  const handleTooltipLeave = useCallback(() => setTooltip(null), []);

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
    <Card className={styles.card}>
      <div className={styles.head}>
        <div className={styles.titleRow}>
          <h2 className={styles.title}>Target Demographics</h2>
          <span className={styles.betaBadge}>Beta</span>
        </div>
        <div className={styles.actions}>
          <button
            type="button"
            aria-label="Open calendar"
            className={styles.iconBtn}
          >
            <Calendar className={styles.iconSm} aria-hidden />
          </button>
          <button
            type="button"
            aria-label="Map settings"
            className={styles.iconBtn}
          >
            <Settings2 className={styles.iconSm} aria-hidden />
          </button>
          <button type="button" className={styles.primaryBtn}>
            <UserPlus className={styles.iconSm} aria-hidden />
            Add server
          </button>
        </div>
      </div>

      <div className={styles.body}>
        <div className={styles.mapWrap}>
          <div className={styles.zapBadge}>
            <Zap className={styles.iconSm} aria-hidden />
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

          <div className={styles.legend}>
            {STATUS_LEGEND.map(({ className, label }) => (
              <span key={label} className={styles.legendItem}>
                <span
                  className={`${styles.legendDot} ${className}`}
                  aria-hidden
                />
                <span className={styles.legendLabel}>{label}</span>
              </span>
            ))}
          </div>

          <div className={styles.zoomGroup}>
            <button
              type="button"
              aria-label="Zoom in"
              disabled={!canZoomIn}
              onClick={() => handleZoom(1)}
              className={styles.zoomBtn}
            >
              <Plus className={styles.iconSm} aria-hidden />
            </button>
            <div className={styles.zoomSep} aria-hidden />
            <button
              type="button"
              aria-label="Zoom out"
              disabled={!canZoomOut}
              onClick={() => handleZoom(-1)}
              className={styles.zoomBtn}
            >
              <Minus className={styles.iconSm} aria-hidden />
            </button>
          </div>

          {tooltip ? (
            <ServerTooltip
              cluster={tooltip.cluster}
              x={tooltip.x}
              y={tooltip.y}
              onMouseEnter={cancelClose}
              onMouseLeave={handleTooltipLeave}
            />
          ) : null}
        </div>

        <div className={styles.countriesPanel}>
          <CountryBreakdown total={total} entries={topCountries} />
        </div>
      </div>
    </Card>
  );
}
