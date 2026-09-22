import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async redirects() {
    return [
      {
        source: "/ai-video-tools",
        destination: "/",
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
