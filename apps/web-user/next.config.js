/** @type {import('next').NextConfig} */
const nextConfig = {
  env: {
    API_GATEWAY_URL: process.env.API_GATEWAY_URL || 'http://localhost:3000',
    TEAM_A_WEB_URL: process.env.TEAM_A_WEB_URL || 'http://localhost:3011',
    TEAM_B_WEB_URL: process.env.TEAM_B_WEB_URL || 'http://localhost:3012',
    TEAM_C_WEB_URL: process.env.TEAM_C_WEB_URL || 'http://localhost:3013',
  },
};

module.exports = nextConfig;