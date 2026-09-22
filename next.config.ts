import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "standalone",
  typescript: { ignoreBuildErrors: true },
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
    {
      protocol: "https",
      hostname: "truzon-backend-ajh7cqh7eq-el.a.run.app",
      pathname: "/**",
    },
    {
      protocol: "https",
      hostname: "storage.googleapis.com",
      pathname: "/**",
    },
    {
      protocol: "https",
      hostname: "images.unsplash.com",
      pathname: "/**",
    },
  ],

  dangerouslyAllowLocalIP: true,
},

  async rewrites() {
  return [];
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