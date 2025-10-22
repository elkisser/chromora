import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  typescript: {
    ignoreBuildErrors: false,
  },
  eslint: {
    // Evita que errores de ESLint rompan el build en Netlify
    ignoreDuringBuilds: true,
  },
  images: {
    domains: [],
  },
};


export default nextConfig;
