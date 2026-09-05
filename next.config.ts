import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Standalone output: a minimal, self-contained server bundle instead of
  // requiring node_modules + the full source tree at runtime.
  output: "standalone",

  // Lets other devices on the same WiFi reach this dev server and its RSC endpoints.
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
    {
      protocol: "https",
      hostname: "truzon-backend-715189721854.asia-south1.run.app",
      pathname: "/media-files/**",
    },
    {
      protocol: "https",
      hostname: "api.truzonhomes.com",
      pathname: "/media-files/**",
    },
    {
      protocol: "https",
      hostname: "media.truzonhomes.com",
      pathname: "/**",
    },
  ],

  dangerouslyAllowLocalIP: true,
},

  async rewrites() {
    const cmsUrl =
      process.env.INTERNAL_CMS_URL ??
      process.env.NEXT_PUBLIC_CMS_URL ??
      "http://localhost:8000";
    return [
      {
        source: "/media-files/:path*",
        destination: `${cmsUrl}/media-files/:path*`,
      },
    ];
  },

  async headers() {
    return [
      {
        source: "/:path*",
        headers: [
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "X-Frame-Options", value: "DENY" },
          {
            key: "Content-Security-Policy",
            value: "frame-ancestors 'none'",
          },
          {
            key: "Referrer-Policy",
            value: "strict-origin-when-cross-origin",
          },
        ],
      },
    ];
  },
};

export default nextConfig;