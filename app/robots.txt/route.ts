import { CMS_URL } from "@/lib/cms-client";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const response = await fetch(`${CMS_URL}/public/robots.txt`, { cache: "no-store" });
    if (response.ok) return new Response(await response.text(), { headers: { "Content-Type": "text/plain; charset=utf-8" } });
  } catch {
    // The public site remains crawlable if the CMS is temporarily unavailable.
  }
  return new Response("User-agent: *\nAllow: /\n", { headers: { "Content-Type": "text/plain; charset=utf-8" } });
}
