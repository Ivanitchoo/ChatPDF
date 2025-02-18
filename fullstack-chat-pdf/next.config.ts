import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  pdf: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "**.amazonaws.com",
      },
    ],
  },
};

export default nextConfig;
