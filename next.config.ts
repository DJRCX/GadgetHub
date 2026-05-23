import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    formats: ['image/avif', 'image/webp'],
    minimumCacheTTL: 86400,
    remotePatterns: [
      { protocol: 'https', hostname: '**.cloudinary.com' },
      { protocol: 'https', hostname: 'placehold.co' },
      { protocol: 'https', hostname: 'images.unsplash.com' },
      { protocol: 'https', hostname: 'www.mobiledokan.com' },
      { protocol: 'https', hostname: 'assets.gadgetandgear.com' },
      { protocol: 'https', hostname: 'ddfndelma2gpn.cloudfront.net' },
      { protocol: 'https', hostname: 'dazzle.com.bd' },
      { protocol: 'http', hostname: 'dazzle.com.bd' },
      { protocol: 'https', hostname: 'shop.rangs.com.bd' },
      { protocol: 'https', hostname: 'www.ryans.com' },
      { protocol: 'https', hostname: 'global.jbl.com' },
      { protocol: 'https', hostname: 'sheitech.com.bd' },
      { protocol: 'https', hostname: 'www.startech.com.bd' },
      { protocol: 'https', hostname: 'spigen.com.bd' },
      { protocol: 'https', hostname: 'baseus.com.bd' },
      { protocol: 'https', hostname: 'images.samsung.com' },
    ],
    dangerouslyAllowSVG: true,
  },
};

export default nextConfig;
