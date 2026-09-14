import type { NextConfig } from "next";
import path from "path";

const nextConfig: NextConfig = {
  experimental: {
    optimizePackageImports: ["lucide-react", "framer-motion"],
  },
  allowedDevOrigins: ["aggregately-legendary-nettie.ngrok-free.dev"],
  images: {
    unoptimized: true,
    formats: ['image/avif', 'image/webp'],
    remotePatterns: [
      {
        protocol: "https",
        hostname: "image.tmdb.org",
      },
      {
        protocol: "https",
        hostname: "ui-avatars.com",
      },
      {
        protocol: "https",
        hostname: "img.youtube.com",
      },
    ],
  },
  // Next sets Cache-Control itself from each route's revalidate, and sends
  // no-store on 404/500. Static headers() here would apply regardless of status.
  async redirects() {
    // Moved from vercel.json, which the Cloudflare Worker never reads.
    return [
      {
        source: "/blog/best-free-movie-streaming-sites-2025",
        destination: "/blog/best-free-movie-streaming-sites-2026",
        permanent: true,
      },
      {
        source: "/blog/best-korean-dramas-2025",
        destination: "/blog/best-korean-dramas-2026",
        permanent: true,
      },
      {
        source: "/blog/best-anime-for-beginners-2025",
        destination: "/blog/best-anime-for-beginners-2026",
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
