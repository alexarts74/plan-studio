import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "bvo9cxhu4qde9fk6.public.blob.vercel-storage.com",
      },
    ],
  },
};

export default nextConfig;
