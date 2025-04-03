/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  typescript: {
    // Ignorar errores de tipos durante la compilación
    ignoreBuildErrors: true,
  },
  eslint: {
    // Ignorar errores de ESLint durante la compilación
    ignoreDuringBuilds: true,
  },
  experimental: {
    // Habilitar optimizaciones experimentales
    esmExternals: 'loose',
  },
};

module.exports = nextConfig; 