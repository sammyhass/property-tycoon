/** @type {import('next').NextConfig} */
const nextConfig = {
  async redirects() {
    return [
      {
        source: '/admin',
        destination: '/admin/games',
        permanent: true,
      },
    ];
  },
  reactStrictMode: true,
};

module.exports = nextConfig;
