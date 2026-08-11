import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Standalone output: a minimal, self-contained server bundle instead of
  // requiring `node_modules` + the full source tree at runtime — the whole
  // point of a lean production container (see Dockerfile, which copies
  // exactly this `.next/standalone` output into the runner stage).
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
      // Production backend, once deployed — serves media directly from
      // its own /media-files route when R2 isn't configured, or as a
      // fallback. Placeholder hostname: replace with the real production
      // API domain before deploying, or image optimization will fail
      // with "hostname is not configured" for every property/blog image.
      {
        protocol: "https",
        hostname: "api.truzonhomes.com",
        pathname: "/media-files/**",
      },
      // Production media, once R2 (or another object store) is configured.
      // Placeholder hostname — the real value depends on the public base
      // URL of that bucket, which isn't chosen yet; adjust (or remove, if
      // media keeps being served through the API host above instead) once
      // it is, same caveat as api.truzonhomes.com above.
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
