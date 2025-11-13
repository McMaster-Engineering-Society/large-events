import { defineConfig } from 'tsup';

export default defineConfig({
  entry: ['src/index.ts'],
  format: ['esm'],
  dts: true,
  sourcemap: true,
  clean: true,
  external: ['react', '@large-event/api-types'],
  treeshake: true,
  splitting: false,
  minify: false,
});
