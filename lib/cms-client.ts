/**
 * Base fetch client for truzon-cms's `/public/*` surface (API.md) — the only
 * CMS API my-app is allowed to call. Every response is the envelope
 * `{success, data, meta, error}`; `cache: "no-store"` on every request so
 * edits made in the CMS show up on the next page load, not after a rebuild.
 *
 * Domain modules (modules/properties/api.ts, modules/blog/api.ts, etc.) build
 * their own typed functions on top of `cmsFetch` — this file only owns the
 * transport concern shared by all of them.
 */

const CONFIGURED_CMS_URL = process.env.NEXT_PUBLIC_CMS_URL ?? "http://localhost:8000";

/**
 * On the server (SSR/RSC), the configured URL is always correct — Node runs
 * on the same machine as the CMS. In the browser, "localhost" means the
 * *visiting device* — so a phone/tablet on the LAN (see next.config.ts's
 * `allowedDevOrigins`) would try to hit itself and fail with "Failed to
 * fetch". Swap the loopback host for whatever host the page was actually
 * loaded from, keeping the configured port.
 */
function resolveCmsUrl(): string {
  if (typeof window === "undefined") return CONFIGURED_CMS_URL;
  try {
    const url = new URL(CONFIGURED_CMS_URL);
    const configuredIsLoopback = url.hostname === "localhost" || url.hostname === "127.0.0.1";
    const browserIsLoopback = window.location.hostname === "localhost" || window.location.hostname === "127.0.0.1";
    if (configuredIsLoopback && !browserIsLoopback) {
      url.hostname = window.location.hostname;
      return url.toString().replace(/\/$/, "");
    }
  } catch {
    // Malformed configured URL — fall through to the raw value below.
  }
  return CONFIGURED_CMS_URL;
}

export const CMS_URL = resolveCmsUrl();

export interface ApiEnvelope<T> {
  success: boolean;
  data: T | null;
  meta: { page: number; per_page: number; total: number; total_pages: number } | null;
  error: { code: string; message: string; details?: unknown } | null;
}

export async function cmsFetch<T>(path: string, init?: RequestInit): Promise<ApiEnvelope<T>> {
  const res = await fetch(`${CMS_URL}${path}`, { ...init, cache: "no-store" });
  const body = (await res.json()) as ApiEnvelope<T>;
  if (!res.ok && res.status !== 404) {
    throw new Error(body.error?.message ?? `CMS request to ${path} failed (${res.status})`);
  }
  return body;
}
