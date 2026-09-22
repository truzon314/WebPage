"use client";

import { useEffect, useRef, useState } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import type { Feature, FeatureCollection } from "geojson";
import { getMapLayerGeoJson, getMapProject, type CmsMapLayer } from "@/modules/properties/api";

interface Props {
  projectId?: string | null;
  propertyName?: string;
  location?: string;
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

// Extract label text from feature properties with auto-detection fallback.
// NOTE: We deliberately exclude `fid` and `id` from auto-detection because
// they are database row IDs, not meaningful display labels — showing them
// produces confusing "1", "2", "3" numbers on every polygon.
function getFeatureLabelText(properties: Record<string, unknown> | null | undefined, configuredProp?: string | null): string | null {
  if (!properties) return null;
  // If a specific property is configured (and not the literal string "None"), use it exclusively
  const prop = configuredProp && configuredProp !== "None" && configuredProp !== "null" ? configuredProp.trim() : null;
  if (prop) {
    const val = properties[prop];
    return val != null ? String(val) : null;
  }
  // Auto-detect only from meaningful semantic properties — never from id/fid
  const val = properties.Plot ?? properties.plot ?? properties.plot_number ?? properties.PlotNumber ?? properties.Name ?? properties.name ?? properties.label ?? properties.Label;
  return val != null ? String(val) : null;
}

// Centroid of a feature's geometry, for placing an on-map text label.
// Points return their own coordinate; polygons average their outer ring.
function centroidOf(geometry: { type: string; coordinates?: unknown } | null | undefined): L.LatLngExpression | null {
  if (!geometry) return null;
  if (geometry.type === "Point") {
    const coords = geometry.coordinates as [number, number];
    const [lng, lat] = coords;
    return [lat, lng];
  }
  let ring: number[][] | undefined;
  if (geometry.type === "Polygon") ring = (geometry.coordinates as number[][][])?.[0];
  else if (geometry.type === "MultiPolygon") ring = (geometry.coordinates as number[][][][])?.[0]?.[0];
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

export function PropertyLocationMap({ projectId, propertyName, location }: Props) {
  const containerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<L.Map | null>(null);
  // Combined extent of every loaded feature, kept current independently of
  // the initial fitBounds() call so the "Zoom to Fit" button still works
  // after the visitor has manually panned/zoomed away.
  const boundsRef = useRef<L.LatLngBounds | null>(null);
  const loadedGeojsonLayersRef = useRef<L.Layer[]>([]);
  const loadedLabelMarkersRef = useRef<{ marker: L.Marker; text: string }[]>([]);
  const [loadError, setLoadError] = useState(false);
  const [hasFeatures, setHasFeatures] = useState(true);

  // 1. Map container initialization (runs once when container is mounted)
  useEffect(() => {
    if (!containerRef.current || mapRef.current) return;

    // React 18 Strict Mode double-invokes effects in dev (mount → cleanup → mount)
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    delete (containerRef.current as any)._leaflet_id;

    const defaultCenter: [number, number] = [17.4485, 78.3758];
    const map = L.map(containerRef.current, { zoomControl: true, scrollWheelZoom: true });
    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
      maxZoom: 20,
    }).addTo(map);
    map.setView(defaultCenter, 13);
    mapRef.current = map;

    const t1 = setTimeout(() => map.invalidateSize(), 50);
    const t2 = setTimeout(() => map.invalidateSize(), 250);
    const t3 = setTimeout(() => map.invalidateSize(), 600);

    const onResize = () => map.invalidateSize();
    window.addEventListener("resize", onResize);

    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
      window.removeEventListener("resize", onResize);
      map.remove();
      mapRef.current = null;
    };
  }, []);

  function buildLabelIcon(text: string, fontSize: number, maxWidth = 120): L.DivIcon {
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
        max-width: ${maxWidth}px;
        overflow: hidden;
        text-overflow: ellipsis;
        pointer-events: none;
        text-align: center;
      ">${escapeHtml(text)}</span>`,
      iconSize: [0, 0],
      iconAnchor: [0, 0],
    });
  }

  // 2. Project & Layer loading (runs whenever projectId, propertyName, or location changes)
  useEffect(() => {
    const map = mapRef.current;
    if (!map) return;

    let cancelled = false;

    // Nuclear cleanup: remove every non-tile layer from the Leaflet map.
    // This guarantees no cross-project GeoJSON/marker bleed even if refs
    // become out-of-sync (e.g. React reusing the component instance in SSR).
    map.eachLayer((layer) => {
      if (!(layer instanceof L.TileLayer)) {
        map.removeLayer(layer);
      }
    });
    loadedGeojsonLayersRef.current = [];
    loadedLabelMarkersRef.current = [];
    boundsRef.current = null;

    const bounds = L.featureGroup();

    const syncLabels = () => {
      const zoom = map.getZoom();
      const fontSize = fontSizeForZoom(zoom);
      for (const { marker, text } of loadedLabelMarkersRef.current) {
        if (zoom >= LABEL_MIN_ZOOM) {
          marker.setIcon(buildLabelIcon(text, fontSize));
          if (!map.hasLayer(marker)) marker.addTo(map);
        } else if (map.hasLayer(marker)) {
          map.removeLayer(marker);
        }
      }
    };

    map.on("zoomend", syncLabels);
    map.on("zoom", syncLabels);

    if (!projectId) {
      const marker = L.marker([17.4485, 78.3758]).addTo(map);
      marker.bindPopup(`<b>${escapeHtml(propertyName || "Truzon Homes Project")}</b><br/>${escapeHtml(location || "Prime Hyderabad Corridor")}`).openPopup();
      loadedGeojsonLayersRef.current.push(marker);
      setHasFeatures(true);
      return () => {
        cancelled = true;
        map.off("zoomend", syncLabels);
        map.off("zoom", syncLabels);
      };
    }

    getMapProject(projectId)
      .then(async (data) => {
        if (cancelled) return;
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

          loadedGeojsonLayersRef.current.push(leafletLayer);
          bounds.addLayer(leafletLayer);

          const prop = layer.label_property;
          const currentZoom = map.getZoom();
          const currentFontSize = fontSizeForZoom(currentZoom);

          const centroids: (L.LatLngExpression | null)[] = geojson.features.map((f) => centroidOf(f.geometry));
          let displayPositions: (L.LatLngExpression | null)[] = centroids;

          if (layer.label_alignment === "aligned") {
            type PointEntry = { idx: number; lat: number; lng: number };
            const pts: PointEntry[] = [];
            centroids.forEach((c, i) => {
              if (c) {
                const [lat, lng] = c as [number, number];
                pts.push({ idx: i, lat, lng });
              }
            });

            if (pts.length > 0) {
              const sorted = [...pts].sort((a, b) => a.lat - b.lat || a.lng - b.lng);
              const nnDists: number[] = sorted.map((p, i) => {
                let min = Infinity;
                for (let j = Math.max(0, i - 5); j < Math.min(sorted.length, i + 6); j++) {
                  if (j === i) continue;
                  const d = Math.hypot(p.lat - sorted[j].lat, p.lng - sorted[j].lng);
                  if (d < min) min = d;
                }
                return min === Infinity ? 0 : min;
              });
              nnDists.sort((a, b) => a - b);
              const medianNN = nnDists[Math.floor(nnDists.length / 2)] || 0;
              const threshold = Math.min(medianNN * 2.5, 0.002);

              const parent = pts.map((_, i) => i);
              function find(i: number): number {
                if (parent[i] !== i) parent[i] = find(parent[i]);
                return parent[i];
              }
              function union(a: number, b: number) {
                parent[find(a)] = find(b);
              }
              for (let i = 0; i < pts.length; i++) {
                for (let j = i + 1; j < pts.length; j++) {
                  const d = Math.hypot(pts[i].lat - pts[j].lat, pts[i].lng - pts[j].lng);
                  if (d <= threshold) union(i, j);
                }
              }

              const groups = new Map<number, PointEntry[]>();
              pts.forEach((p, i) => {
                const root = find(i);
                if (!groups.has(root)) groups.set(root, []);
                groups.get(root)!.push(p);
              });

              const aligned = new Map<number, L.LatLngExpression>();
              groups.forEach((group) => {
                if (group.length === 1) {
                  const { idx, lat, lng } = group[0];
                  aligned.set(idx, [lat, lng]);
                  return;
                }
                const lats = group.map((p) => p.lat);
                const lngs = group.map((p) => p.lng);
                const latSpread = Math.max(...lats) - Math.min(...lats);
                const lngSpread = Math.max(...lngs) - Math.min(...lngs);
                const meanLat = lats.reduce((s, v) => s + v, 0) / lats.length;
                const meanLng = lngs.reduce((s, v) => s + v, 0) / lngs.length;

                group.forEach(({ idx, lat, lng }) => {
                  if (latSpread >= lngSpread) {
                    aligned.set(idx, [lat, meanLng]);
                  } else {
                    aligned.set(idx, [meanLat, lng]);
                  }
                });
              });

              displayPositions = centroids.map((c, i) => aligned.get(i) ?? c);
            }
          }

          for (let fi = 0; fi < geojson.features.length; fi++) {
            const feature = geojson.features[fi];
            if (matchRule(layer, feature.properties)?.action === "hide") continue;
            const center = displayPositions[fi];
            const text = getFeatureLabelText(feature.properties, prop);
            if (!center || text == null) continue;

            const labelText = String(text);
            const marker = L.marker(center, {
              icon: buildLabelIcon(labelText, currentFontSize),
              interactive: false,
            });
            if (currentZoom >= LABEL_MIN_ZOOM) marker.addTo(map);
            loadedLabelMarkersRef.current.push({ marker, text: labelText });
          }
        }

        if (!cancelled) {
          setHasFeatures(totalFeatures > 0);
          if (bounds.getLayers().length > 0) {
            boundsRef.current = bounds.getBounds();
            map.fitBounds(boundsRef.current, { padding: [24, 24] });
          } else {
            const marker = L.marker([17.4485, 78.3758]).addTo(map);
            marker.bindPopup(`<b>${escapeHtml(propertyName || "Truzon Homes Project")}</b><br/>${escapeHtml(location || "Prime Hyderabad Corridor")}`).openPopup();
            loadedGeojsonLayersRef.current.push(marker);
          }
          syncLabels();
        }
      })
      .catch(() => {
        if (!cancelled) {
          setLoadError(true);
          const marker = L.marker([17.4485, 78.3758]).addTo(map);
          marker.bindPopup(`<b>${escapeHtml(propertyName || "Truzon Homes Project")}</b><br/>${escapeHtml(location || "Prime Hyderabad Corridor")}`).openPopup();
          loadedGeojsonLayersRef.current.push(marker);
        }
      });

    return () => {
      cancelled = true;
      loadedGeojsonLayersRef.current.forEach((l) => map.removeLayer(l));
      loadedGeojsonLayersRef.current = [];
      loadedLabelMarkersRef.current.forEach(({ marker }) => map.removeLayer(marker));
      loadedLabelMarkersRef.current = [];
      map.off("zoomend", syncLabels);
      map.off("zoom", syncLabels);
    };
  }, [projectId, propertyName, location]);


  const handleZoomToFit = () => {
    const map = mapRef.current;
    if (map && boundsRef.current && boundsRef.current.isValid()) {
      map.fitBounds(boundsRef.current, { padding: [24, 24] });
    }
  };

  return (
    <div className="relative z-0 isolate h-full w-full overflow-hidden rounded-[10px] border border-gray-200">
      <div ref={containerRef} className="h-full w-full" />
      {hasFeatures && (
        <button
          onClick={handleZoomToFit}
          title="Zoom to fit map"
          className="absolute bottom-3 left-3 z-10 rounded-md border border-gray-300 bg-white px-2.5 py-1.5 text-xs font-semibold text-gray-700 shadow hover:bg-gray-50"
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
