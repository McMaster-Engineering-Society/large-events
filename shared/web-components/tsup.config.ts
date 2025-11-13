import { defineConfig } from 'tsup';

export default defineConfig({
  entry: ['src/index.ts'],
  format: ['esm'],
  dts: true,
  sourcemap: true,
  clean: true,
  external: ['react', 'react-dom', '@tanstack/react-router'],
  treeshake: true,
  splitting: false,
  minify: false,
});
