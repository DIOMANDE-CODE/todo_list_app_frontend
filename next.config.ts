import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  devIndicators: false,
  images: {
    remotePatterns: [
      {
        protocol: 'http',
        hostname: 'localhost',
        pathname: '/media/**',
      },
      {
        protocol: 'http',
        hostname: '192.168.100.2',
        pathname: '/media/**',
      },
        {
        protocol: 'http',
        hostname: '14.14.14.37',
        pathname: '/media/**',
      },
      {
        protocol: 'https',
        hostname: 'i.pravatar.cc',
        pathname: '/**',
      },
    ],
  }
  /* config options here */
};

export default nextConfig;
