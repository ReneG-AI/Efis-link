/** @type {import('next').NextConfig} */
const nextConfig = {
  // Ignorar errores de tipos durante la compilación
  typescript: {
    ignoreBuildErrors: true,
  },
  // Ignorar errores de linting durante la compilación
  eslint: {
    ignoreDuringBuilds: true,
  },
  reactStrictMode: false,
  swcMinify: true,
  output: 'standalone', // Optimizado para Vercel
}

module.exports = nextConfig; 