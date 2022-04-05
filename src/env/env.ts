export const API_URL =
  process.env.NODE_ENV === 'production'
    ? 'https://property-tycoon.vercel.app/api'
    : 'http://localhost:3000/api';
