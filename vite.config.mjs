import { defineConfig } from 'vite';
import { resolve } from 'path';
import react from '@astrojs/react';
import dynamicImportVars from '@rollup/plugin-dynamic-import-vars';

export default defineConfig({
  resolve: {
    alias: {
      '@': resolve(__dirname, './src'),
    },
  },
  plugins: [
    react(),
    dynamicImportVars({
      exclude: ['**/node_modules/**'],
    }),
  ],
});
