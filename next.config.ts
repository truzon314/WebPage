import type { NextConfig } from "next";

const nextConfig: NextConfig = {
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
