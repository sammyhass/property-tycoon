/** @type {import('next').NextConfig} */
const nextConfig = {
  redirects: [
    {
      source: '/admin',
      destination: '/admin/games',
    },
  ],
  reactStrictMode: true,
};

module.exports = nextConfig;
