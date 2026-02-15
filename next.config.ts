import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: 'export',
  // Use relative paths for assets so they load in Electron (file:// protocol)
  assetPrefix: process.env.NEXT_PUBLIC_IS_ELECTRON ? './' : undefined,
  trailingSlash: true,
  images: {
    unoptimized: true,
  },
};

export default nextConfig;
