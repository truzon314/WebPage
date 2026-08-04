"use client";

import { useEffect, useRef, useState } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import type { Feature, FeatureCollection } from "geojson";
import { getMapLayerGeoJson, getMapProject, type CmsMapLayer } from "@/modules/properties/api";

interface Props {
  projectId: string;
}

// Minimum zoom level at which on-map text labels become legible and fit
// inside polygons — matches the CMS admin map's own threshold
// (lib/layers.ts's LABEL_MIN_ZOOM in truzon-cms/frontend) so labels appear
// at the same zoom here as they do for the admin.
const LABEL_MIN_ZOOM = 18;

// Grows labels as the visitor zooms in past LABEL_MIN_ZOOM instead of
// holding them at a fixed size — mirrors fontSizeForZoom in the CMS
// admin's lib/layers.ts so the two stay visually consistent.
function fontSizeForZoom(zoom: number): number {
  const base = 10;
  const growth = Math.max(0, zoom - LABEL_MIN_ZOOM) * 2.5;
  return Math.min(base + growth, 28);
}

// Centroid of a feature's geometry, for placing an on-map text label.
// Points return their own coordinate; polygons average their outer ring.
function centroidOf(geometry: { type: string; coordinates?: any } | null | undefined): L.LatLngExpression | null {
  if (!geometry) return null;
  if (geometry.type === "Point") {
    const [lng, lat] = geometry.coordinates;
    return [lat, lng];
  }
  let ring: number[][] | undefined;
  if (geometry.type === "Polygon") ring = geometry.coordinates[0];
  else if (geometry.type === "MultiPolygon") ring = geometry.coordinates[0]?.[0];
  if (!ring || ring.length === 0) return null;
  let sumLat = 0;
  let sumLng = 0;
  for (const [lng, lat] of ring) {
    sumLat += lat;
    sumLng += lng;
  }
  return [sumLat / ring.length, sumLng / ring.length];
}

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

function matchRule(layer: CmsMapLayer, properties: Record<string, unknown> | null | undefined) {
  const rules = layer.color_rules ?? [];
  if (!rules.length || !properties) return null;
  for (const rule of rules) {
    const actual = properties[rule.property];
    if (actual !== undefined && actual !== null && String(actual) === rule.value) return rule;
  }
  return null;
}

function dashArrayFor(strokeStyle: CmsMapLayer["stroke_style"]): string | undefined {
  if (strokeStyle === "dashed") return "12,8";
  if (strokeStyle === "dotted") return "2,7";
  return undefined;
}

function popupHtml(layerName: string, properties: Record<string, unknown>, allowedProperties: string[] | null): string {
  const allowed = allowedProperties && allowedProperties.length > 0 ? new Set(allowedProperties) : null;
  const entries = Object.entries(properties).filter(([key]) => allowed === null || allowed.has(key));
  const rows = entries.length
    ? entries
        .map(
          ([key, value], i) => `
            <div style="display:flex;justify-content:space-between;gap:14px;padding:6px 4px;${i % 2 === 1 ? "background:#f8fafc;" : ""}border-radius:4px;font-size:13px;">
              <span style="font-weight:600;color:#52525b;white-space:nowrap;">${escapeHtml(key)}</span>
              <span style="font-family:ui-monospace,monospace;color:#18181b;font-weight:600;text-align:right;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;max-width:190px;">${escapeHtml(String(value))}</span>
            </div>`
        )
        .join("")
    : `<span style="font-size:13px;color:#71717a;">No details available</span>`;

  return `
    <div style="min-width:220px;max-width:320px;font-family:system-ui,-apple-system,'Segoe UI',sans-serif;">
      <div style="font-weight:700;font-size:14px;color:#18181b;border-bottom:2px solid #e4e4e7;padding-bottom:8px;margin-bottom:8px;">
        ${escapeHtml(layerName)}
      </div>
      <div style="max-height:240px;overflow-y:auto;">${rows}</div>
    </div>
  `;
}

export function PropertyLocationMap({ projectId }: Props) {
  const containerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<L.Map | null>(null);
  // Combined extent of every loaded feature, kept current independently of
  // the initial fitBounds() call so the "Zoom to Fit" button still works
  // after the visitor has manually panned/zoomed away.
  const boundsRef = useRef<L.LatLngBounds | null>(null);
  const [loadError, setLoadError] = useState(false);
  const [hasFeatures, setHasFeatures] = useState(true);

  useEffect(() => {
    if (!containerRef.current || mapRef.current) return;

    // React 18 Strict Mode double-invokes effects in dev (mount → cleanup →
    // mount) — Leaflet stamps `_leaflet_id` on the container to guard
    // against double-init, but that stamp can outlive the first mount's
    // `map.remove()` cleanup, making the second mount silently throw
    // ("Map container is already initialized") with nothing ever rendering.
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    delete (containerRef.current as any)._leaflet_id;

    const map = L.map(containerRef.current, { zoomControl: true, scrollWheelZoom: true });
    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
      maxZoom: 20,
    }).addTo(map);
    map.setView([20.5937, 78.9629], 5);
    mapRef.current = map;

    let cancelled = false;
    const bounds = L.featureGroup();
    const labelMarkers: { marker: L.Marker; text: string }[] = [];

    function buildLabelIcon(text: string, fontSize: number): L.DivIcon {
      return L.divIcon({
        className: "property-map-label-icon",
        html: `<span style="
          display: inline-block;
          transform: translate(-50%, -50%);
          font-size: ${fontSize}px;
          font-weight: 700;
          color: #0f172a;
          text-shadow: 0 0 2px #ffffff, 0 0 4px #ffffff, 0 0 2px #ffffff;
          white-space: nowrap;
          pointer-events: none;
        ">${escapeHtml(text)}</span>`,
        iconSize: [0, 0],
        iconAnchor: [0, 0],
      });
    }

    // Toggles label visibility at LABEL_MIN_ZOOM and, past that, re-renders
    // each label's icon at the zoom-appropriate size — a divIcon's HTML is
    // static once created, so growing the font means swapping the icon.
    const syncLabels = () => {
      const zoom = map.getZoom();
      const fontSize = fontSizeForZoom(zoom);
      for (const { marker, text } of labelMarkers) {
        if (zoom >= LABEL_MIN_ZOOM) {
          marker.setIcon(buildLabelIcon(text, fontSize));
          if (!map.hasLayer(marker)) marker.addTo(map);
        } else if (map.hasLayer(marker)) {
          map.removeLayer(marker);
        }
      }
    };
    map.on("zoomend", syncLabels);

    getMapProject(projectId)
      .then(async (data) => {
        if (cancelled) return; // stale effect instance (React 18 Strict Mode double-invoke) — no-op, not an error
        if (!data) {
          setLoadError(true);
          return;
        }
        const visibleLayers = data.layers.filter((l) => l.default_visible);
        let totalFeatures = 0;

        for (const layer of visibleLayers) {
          const geojson: FeatureCollection | null = await getMapLayerGeoJson(projectId, layer.id).catch(() => null);
          if (cancelled || !geojson || !Array.isArray(geojson.features) || geojson.features.length === 0) continue;
          totalFeatures += geojson.features.length;

          const leafletLayer = L.geoJSON(geojson, {
            style: (feature) => {
              if (!feature) {
                return { color: layer.stroke_color, weight: layer.stroke_weight, fillColor: layer.fill_color, fillOpacity: layer.fill_opacity };
              }
              const rule = matchRule(layer, feature.properties);
              if (rule?.action === "hide") return { opacity: 0, fillOpacity: 0 };
              return {
                color: rule?.color || layer.stroke_color,
                weight: layer.stroke_weight,
                fillColor: rule?.color || layer.fill_color,
                fillOpacity: rule?.opacity ?? layer.fill_opacity,
                dashArray: dashArrayFor(layer.stroke_style),
              };
            },
            filter: (feature) => matchRule(layer, feature.properties)?.action !== "hide",
            onEachFeature: (feature: Feature, lLayer) => {
              if (!layer.popup_enabled) return;
              lLayer.bindPopup(popupHtml(layer.label, feature.properties || {}, layer.popup_properties), {
                maxWidth: 340,
                minWidth: 220,
              });
            },
          }).addTo(map);

          bounds.addLayer(leafletLayer);

          if (layer.label_property) {
            const prop = layer.label_property;
            const currentZoom = map.getZoom();
            const currentFontSize = fontSizeForZoom(currentZoom);
            for (const feature of geojson.features) {
              if (matchRule(layer, feature.properties)?.action === "hide") continue;
              const center = centroidOf(feature.geometry);
              const text = feature.properties?.[prop];
              if (!center || text == null) continue;

              const labelText = String(text);
              const marker = L.marker(center, {
                icon: buildLabelIcon(labelText, currentFontSize),
                interactive: false,
              });
              if (currentZoom >= LABEL_MIN_ZOOM) marker.addTo(map);
              labelMarkers.push({ marker, text: labelText });
            }
          }
        }

        if (!cancelled) {
          setHasFeatures(totalFeatures > 0);
          if (bounds.getLayers().length > 0) {
            boundsRef.current = bounds.getBounds();
            map.fitBounds(boundsRef.current, { padding: [24, 24] });
          }
        }
      })
      .catch(() => {
        if (!cancelled) setLoadError(true);
      });

    return () => {
      cancelled = true;
      map.off("zoomend", syncLabels);
      map.remove();
      mapRef.current = null;
    };
  }, [projectId]);

  if (loadError) return null;

  const handleZoomToFit = () => {
    const map = mapRef.current;
    if (map && boundsRef.current && boundsRef.current.isValid()) {
      map.fitBounds(boundsRef.current, { padding: [24, 24] });
    }
  };

  return (
    <div className="relative h-[420px] w-full overflow-hidden rounded-[10px] border border-gray-200">
      <div ref={containerRef} className="h-full w-full" />
      {hasFeatures && (
        <button
          onClick={handleZoomToFit}
          title="Zoom to fit map"
          className="absolute bottom-3 left-3 z-[400] rounded-md border border-gray-300 bg-white px-2.5 py-1.5 text-xs font-semibold text-gray-700 shadow hover:bg-gray-50"
        >
          ⛶ Zoom to Fit
        </button>
      )}
      {!hasFeatures && (
        <div className="pointer-events-none absolute inset-0 flex items-center justify-center bg-white/70">
          <p className="text-sm text-gray-500">Site layout map coming soon.</p>
        </div>
      )}
    </div>
  );
}
