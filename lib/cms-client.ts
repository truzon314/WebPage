const SERVER_CMS_URL =
  process.env.INTERNAL_CMS_URL ??
  process.env.NEXT_PUBLIC_CMS_URL ??
  "http://localhost:8000";

const BROWSER_CMS_URL =
  process.env.NEXT_PUBLIC_CMS_URL ?? "http://localhost:8000";

export const PUBLIC_MEDIA_URL = "/media-files";

function getCmsUrl(): string {
  return typeof window === "undefined"
    ? SERVER_CMS_URL
    : BROWSER_CMS_URL;
}

export const CMS_URL = getCmsUrl();

export function resolveMediaUrl(
  url: string | null | undefined
): string | undefined {
  if (!url) return undefined;

  try {
    const parsed = new URL(url);

    if (
      parsed.pathname.startsWith("/media-files/") &&
      (parsed.hostname === "localhost" ||
        parsed.hostname === "127.0.0.1" ||
        parsed.hostname === "host.docker.internal")
    ) {
      return `${PUBLIC_MEDIA_URL}${parsed.pathname.slice(
        "/media-files".length
      )}`;
    }

    return url;
  } catch {
    return url;
  }
}

export interface ApiEnvelope<T> {
  success: boolean;
  data: T | null;
  meta: {
    page: number;
    per_page: number;
    total: number;
    total_pages: number;
  } | null;
  error: {
    code: string;
    message: string;
    details?: unknown;
  } | null;
}

export async function cmsFetch<T>(
  path: string,
  init?: RequestInit
): Promise<ApiEnvelope<T>> {
  const cmsUrl =
    typeof window === "undefined"
      ? SERVER_CMS_URL
      : BROWSER_CMS_URL;

  const res = await fetch(`${cmsUrl}${path}`, {
    ...init,
    cache: "no-store",
  });

  const body = (await res.json()) as ApiEnvelope<T>;

  if (!res.ok && res.status !== 404) {
    throw new Error(
      body.error?.message ?? `CMS request to ${path} failed (${res.status})`
    );
  }

  return body;
}