import { defineConfig } from 'astro/config';

// https://astro.build/config
export default defineConfig({
  output: 'server',
  srcDir: 'src',
  publicDir: 'public',
  outDir: 'dist',
  build: {
    assets: 'assets',
  },
  server: {
    port: 4321,
    host: true
  }
});
