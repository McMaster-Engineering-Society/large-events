const { NextFederationPlugin } = require('@module-federation/nextjs-mf');

/** @type {import('next').NextConfig} */
const nextConfig = {
  webpack: (config, { isServer }) => {
    if (!isServer) {
      config.plugins.push(
        new NextFederationPlugin({
          name: 'user-shell',
          filename: 'static/chunks/remoteEntry.js',
          remotes: {
            'team-a-user': process.env.NODE_ENV === 'development'
              ? 'team-a-user@http://localhost:3011/_next/static/chunks/remoteEntry.js'
              : 'team-a-user@/teams/teamA/user/_next/static/chunks/remoteEntry.js',
            'team-b-user': process.env.NODE_ENV === 'development'
              ? 'team-b-user@http://localhost:3012/_next/static/chunks/remoteEntry.js'
              : 'team-b-user@/teams/teamB/user/_next/static/chunks/remoteEntry.js',
            'team-c-user': process.env.NODE_ENV === 'development'
              ? 'team-c-user@http://localhost:3013/_next/static/chunks/remoteEntry.js'
              : 'team-c-user@/teams/teamC/user/_next/static/chunks/remoteEntry.js',
          },
          shared: {
            'react': { singleton: true, requiredVersion: '^18.3.1' },
            'react-dom': { singleton: true, requiredVersion: '^18.3.1' },
          },
        })
      );
    }
    return config;
  },
  env: {
    API_GATEWAY_URL: process.env.API_GATEWAY_URL || 'http://localhost:3000',
    TEAM_A_WEB_URL: process.env.TEAM_A_WEB_URL || 'http://localhost:3011',
    TEAM_B_WEB_URL: process.env.TEAM_B_WEB_URL || 'http://localhost:3012',
    TEAM_C_WEB_URL: process.env.TEAM_C_WEB_URL || 'http://localhost:3013',
  },
};

module.exports = nextConfig;