/** @type {import('next').NextConfig} */
const apiProxyTarget = process.env.API_PROXY_TARGET || 'http://192.168.21.17:8000';

const nextConfig = {
  reactStrictMode: true,
  images: {
    domains: ['via.placeholder.com', 'api.dicebear.com'],
  },
  async rewrites() {
    return [
      {
        source: '/api/v1/:path*',
        destination: `${apiProxyTarget}/api/v1/:path*`,
      },
    ];
  },
};

module.exports = nextConfig;
