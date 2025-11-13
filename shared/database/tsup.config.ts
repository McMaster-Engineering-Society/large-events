import { defineConfig } from 'tsup';

export default defineConfig({
  entry: {
    index: 'src/index.ts',
    'schemas/index': 'src/schemas/index.ts',
  },
  format: ['esm'],
  dts: true,
  sourcemap: true,
  clean: true,
  external: ['drizzle-orm', 'pg'],
  treeshake: true,
  splitting: false,
  minify: false,
});
