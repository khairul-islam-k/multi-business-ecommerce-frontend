import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      { hostname: "api.dicebear.com" },
      { hostname: "images.unsplash.com" },
      { hostname: "picsum.photos" },
    ],
  },
};

export default nextConfig;
