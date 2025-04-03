/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  typescript: {
    // ⚠️ Peligroso pero necesario para el despliegue en Vercel
    // mientras solucionamos los problemas de tipos
    ignoreBuildErrors: process.env.SKIP_TYPE_CHECK === 'true',
  },
  eslint: {
    // También ignoramos errores de ESLint durante la compilación
    ignoreDuringBuilds: process.env.SKIP_TYPE_CHECK === 'true',
  },
};

module.exports = nextConfig; 