import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
      },
      {
        protocol: 'https',
        hostname: 'www.brides.com',
      },
      {
        protocol: 'https',
        hostname: '**.supabase.co', // Supabase වලින් එන ඉමේජ් සඳහා
      },
      {
        protocol: 'https',
        hostname: '**', // වෙන ඕනෑම external ඩොමේන් එකකට ඉඩ දීමට
      },
    ],
  },
};

export default nextConfig;
