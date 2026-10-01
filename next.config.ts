import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Allow the LAN IP to load dev resources (HMR, fonts, stack frames)
  allowedDevOrigins: ['192.168.1.6'],
  compiler: {
    styledComponents: true,
  },
  images: {
    formats: ['image/webp', 'image/avif'],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048],
    imageSizes: [16, 32, 48, 64, 96, 128, 160, 200, 260, 384],
    // Cache optimized derivatives for 30 days instead of the 4-hour default,
    // so repeat visits don't re-run the optimizer or re-fetch the originals.
    minimumCacheTTL: 60 * 60 * 24 * 30,
    // Product images are admin-entered and can point at any host. Without
    // remotePatterns, next/image rejects every external URL, so saved
    // products render without images.
    remotePatterns: [
      { protocol: 'https', hostname: '**' },
      { protocol: 'http', hostname: '**' },
    ],
  },
};

export default nextConfig;
