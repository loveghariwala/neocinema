import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  experimental: {
    optimizePackageImports: ["lucide-react", "framer-motion"],
  },
  allowedDevOrigins: ["aggregately-legendary-nettie.ngrok-free.dev"],
  images: {
    unoptimized: true,
    remotePatterns: [
      {
        protocol: "https",
        hostname: "image.tmdb.org",
      },
      {
        protocol: "https",
        hostname: "ui-avatars.com",
      },
    ],
  },
  async redirects() {
    return [
      {
        source: '/blog/best-free-movie-streaming-sites-2025',
        destination: '/blog/best-free-movie-streaming-sites-2026',
        permanent: true,
      },
      {
        source: '/blog/best-korean-dramas-2025',
        destination: '/blog/best-korean-dramas-2026',
        permanent: true,
      },
      {
        source: '/blog/best-anime-for-beginners-2025',
        destination: '/blog/best-anime-for-beginners-2026',
        permanent: true,
      },
    ];
  },
  async headers() {
    return [
      {
        source: "/:path*",
        headers: [
          {
            key: "Referrer-Policy",
            value: "strict-origin-when-cross-origin",
          },
          {
            key: "Content-Security-Policy",
            value: "frame-src *; img-src * data: blob:;",
          },
          {
            key: "Cache-Control",
            value: "public, max-age=0, s-maxage=3600, stale-while-revalidate=86400",
          },
          {
            key: "X-Robots-Tag",
            value: "index, follow",
          },
        ],
      },
    ];
  },
};

export default nextConfig;
