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
      port: 4001,
      proxy: {
        '/api': {
          target: 'http://localhost:4101',
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
    },
  };
});
