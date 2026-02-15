import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: 'export',
  // Workaround: Force relative paths for Electron (production build), but keep absolute for Vercel
  assetPrefix: (process.env.NODE_ENV === 'production' && !process.env.VERCEL) ? './' : undefined,
  trailingSlash: true,
  images: {
    unoptimized: true,
  },
};

export default nextConfig;
