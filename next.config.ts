import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      { hostname: "api.dicebear.com" },
      { hostname: "images.unsplash.com" },
      { hostname: "picsum.photos" },
      {
        protocol: "http",
        hostname: "192.168.0.123",
      },
    ],
  },
};

export default nextConfig;
