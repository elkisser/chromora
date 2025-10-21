import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  typescript: {
    ignoreBuildErrors: false,
  },
  eslint: {
    ignoreDuringBuilds: false,
  },
  images: {
    domains: [],
    unoptimized: true, // Para export estático
  },
  output: 'export', // Para generar archivos estáticos
  trailingSlash: true, // Para compatibilidad con Netlify
  distDir: 'out', // Directorio de salida
};


export default nextConfig;
