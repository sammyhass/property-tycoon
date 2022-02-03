/** @type {import('next').NextConfig} */
const nextConfig = {
  publicRuntimeConfig: {
    SUPABASE_URL: process.env.SUPABASE_URL,
  },
  env: {
    SUPABASE_URL: process.env.SUPABASE_URL,
    SUPABASE_ANON_KEY: process.env.SUPABASE_ANON_KEY,
    DATABASE_URL: process.env.DATABASE_URL,
  },
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
