import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Standalone output: a minimal, self-contained server bundle instead of
  // requiring `node_modules` + the full source tree at runtime — the whole
  // point of a lean production container (GCP_DEPLOYMENT.md §2).
  output: "standalone",
  // Lets other devices on the same WiFi (phones, tablets) reach this dev
  // server and its RSC endpoints — Next.js blocks cross-origin dev requests
  // from any origin not in this list.
  allowedDevOrigins: ["192.168.1.8"],
  images: {
    remotePatterns: [
      {
        protocol: "http",
        hostname: "localhost",
        port: "8000",
        pathname: "/media-files/**",
      },
      {
        protocol: "http",
        hostname: "192.168.1.8",
        port: "8000",
        pathname: "/media-files/**",
      },
      // Production backend, once deployed (GCP_DEPLOYMENT.md §3) — serves
      // media directly when R2 isn't configured, or as a fallback.
      {
        protocol: "https",
        hostname: "api.truzonhomes.com",
        pathname: "/media-files/**",
      },
      // Production media, once R2 is configured (GCP_DEPLOYMENT.md §2) — the
      // exact hostname depends on the public base URL you set for the R2
      // bucket; adjust this to match once that's chosen.
      {
        protocol: "https",
        hostname: "media.truzonhomes.com",
        pathname: "/**",
      },
    ],
    // The CMS backend is genuinely on localhost/LAN in dev — Next 16's default
    // SSRF guard otherwise refuses to optimize images from any private/loopback IP.
    dangerouslyAllowLocalIP: true,
  },
  async headers() {
    return [
      {
        source: "/:path*",
        headers: [
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "X-Frame-Options", value: "DENY" },
          { key: "Content-Security-Policy", value: "frame-ancestors 'none'" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
        ],
      },
    ];
  },
};

export default nextConfig;
