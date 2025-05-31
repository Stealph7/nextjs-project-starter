/** @type {import('next').NextConfig} */
const config = {
  experimental: {
    serverActions: true,
  },
  images: {
    unoptimized: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
}

export default config
