
import { NextConfig } from "next";

const nextConfig: NextConfig = {
  async headers() {
    return [
      {
        source: "/:path*",
        headers: [
          {
            key: "Permissions-Policy",
            value: "geolocation=*",
          },
        ],
      },
    ];
  },
  experimental: {
    // Other experimental features...
  },
  // Other Next.js configurations...
};

export default nextConfig;
