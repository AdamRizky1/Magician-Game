import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Static export for GitHub Pages hosting
  output: "export",
  // GitHub Pages serves at /Magician-Game subpath
  basePath: "/Magician-Game",
  // Disable image optimization (no server runtime in static export)
  images: {
    unoptimized: true,
  },
  // Add trailing slash so GitHub Pages serves index.html correctly
  trailingSlash: true,
  typescript: {
    ignoreBuildErrors: true,
  },
  reactStrictMode: false,
};

export default nextConfig;
