import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';
import { TanStackRouterVite } from '@tanstack/router-vite-plugin';
import path from 'path';

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '');

  return {
    plugins: [
      react(),
      TanStackRouterVite(),
    ],
    resolve: {
      alias: {
        '@': path.resolve(__dirname, './src'),
      },
    },
    server: {
      port: 4000,
      proxy: {
        '/api': {
          target: 'http://localhost:4100',
          changeOrigin: true,
        },
      },
    },
    build: {
      outDir: 'dist/client',
      sourcemap: true,
    },
    define: {
      'process.env.API_GATEWAY_URL': JSON.stringify(env.API_GATEWAY_URL || 'http://localhost:3000'),
      'process.env.TEAM_A_WEB_URL': JSON.stringify(env.TEAM_A_WEB_URL || 'http://localhost:3011'),
      'process.env.TEAM_B_WEB_URL': JSON.stringify(env.TEAM_B_WEB_URL || 'http://localhost:3012'),
      'process.env.TEAM_C_WEB_URL': JSON.stringify(env.TEAM_C_WEB_URL || 'http://localhost:3013'),
      'process.env.TEAM_D_WEB_URL': JSON.stringify(env.TEAM_D_WEB_URL || 'http://localhost:3014'),
    },
  };
});
