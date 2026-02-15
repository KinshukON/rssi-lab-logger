import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Removed output: 'export' to enable API routes for auth + cloud sync.
  // Web: deployed to Vercel. Electron: loads from deployed URL for cloud sync.
  trailingSlash: true,
  images: {
    unoptimized: true,
  },
};

export default nextConfig;
