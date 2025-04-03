/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: false,
  swcMinify: true,
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    // !! WARN !!
    // Ignorar errores de tipo durante la compilación
    // !! WARN !!
    ignoreBuildErrors: process.env.SKIP_TYPE_CHECK === 'true',
  },
  experimental: {
    serverComponentsExternalPackages: ['@prisma/client'],
    esmExternals: 'loose',
  },
  output: 'standalone'
}

module.exports = nextConfig 