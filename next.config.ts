import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: 'export',
  // Use relative paths ONLY for Electron builds (triggered by build:electron script)
  assetPrefix: process.env.NEXT_PUBLIC_IS_ELECTRON ? './' : undefined,
  trailingSlash: true,
  images: {
    unoptimized: true,
  },
};

export default nextConfig;
