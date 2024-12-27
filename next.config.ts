import type { NextConfig } from 'next'

/* cspell:disable */
const nextConfig: NextConfig = {
  output: 'standalone',
  async rewrites() {
    return [
      {
        source: '/images/:path*',
        destination: 'https://d1ttulk89fbidl.cloudfront.net/:path*',
        basePath: false,
        locale: false,
      },
    ]
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'd1ttulk89fbidl.cloudfront.net',
      },
    ],
  },
  async redirects() {
    return [
      {
        source: '/:path*',
        has: [
          {
            type: 'host',
            value: 'www.beatstore.co.uk',
          },
        ],
        destination: 'https://beatstore.co.uk/:path*',
        permanent: true,
      },
      {
        source: '/:path*',
        has: [
          {
            type: 'host',
            value: 'beat-store.fly.dev',
          },
        ],
        // ToDO: Change to beatstore.co.uk
        destination: 'https://beat-store.fly.dev/:path*',
        permanent: true,
      },
    ]
  },
}

export default nextConfig
