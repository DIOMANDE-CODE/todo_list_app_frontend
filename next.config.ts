import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  devIndicators: false,
  images: {
    remotePatterns: [
      // Local dev
      {
        protocol: 'http',
        hostname: 'localhost',
        pathname: '/media/**',
      },
      {
        protocol: 'http',
        hostname: '127.0.0.1',
        pathname: '/media/**',
      },
      // Backend ngrok
      {
        protocol: 'https',
        hostname: 'streaming-approximate-perl-detective.trycloudflare.com',
        pathname: '/media/**',
      },
      // Avatars génériques
      {
        protocol: 'https',
        hostname: 'i.pravatar.cc',
        pathname: '/**',
      },
    ],
  },
};

export default nextConfig;
