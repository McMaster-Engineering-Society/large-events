import { defineConfig } from 'tsup';

export default defineConfig({
  entry: ['src/index.ts'],
  format: ['esm'],
  dts: true,
  sourcemap: true,
  clean: true,
  external: ['drizzle-orm', 'jsonwebtoken', '@large-event/database', '@large-event/api-types'],
  treeshake: true,
  splitting: false,
  minify: false,
});
