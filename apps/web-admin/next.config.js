/** @type {import('next').NextConfig} */
const nextConfig = {
  env: {
    API_GATEWAY_URL: process.env.API_GATEWAY_URL || 'http://localhost:3000',
  },
};

module.exports = nextConfig;