import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: 'export',
  // Force relative paths in production builds to ensure Electron compatibility
  assetPrefix: process.env.NODE_ENV === 'production' ? './' : undefined,
  trailingSlash: true,
  images: {
    unoptimized: true,
  },
};

export default nextConfig;
