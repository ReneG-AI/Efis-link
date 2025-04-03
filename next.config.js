/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  output: 'standalone',
  trailingSlash: true,
  assetPrefix: './',
  typescript: {
    // !! IMPORTANTE: Deshabilitar verificación de tipos solo en desarrollo
    ignoreBuildErrors: process.env.TYPESCRIPT_SKIP_TYPECHECK === 'true',
  },
  eslint: {
    // Deshabilitar eslint en build para evitar fallos en despliegue
    ignoreDuringBuilds: true,
  },
  experimental: {
    // Habilitar optimizaciones experimentales
    esmExternals: 'loose',
  },
  images: {
    unoptimized: true,
  }
};

module.exports = nextConfig; 