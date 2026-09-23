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
  },
};

export default nextConfig;
