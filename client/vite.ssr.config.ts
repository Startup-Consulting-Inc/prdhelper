/**
 * Vite SSR Configuration
 *
 * Builds the server-side rendering bundle for static prerendering.
 * Used by scripts/prerender.mjs to generate prerendered HTML at build time.
 * Output goes to client/dist-ssr/ and is consumed at build time only.
 */

import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const dirname = typeof __dirname !== 'undefined' ? __dirname : path.dirname(fileURLToPath(import.meta.url));

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(dirname, './src'),
      '@shared': path.resolve(dirname, '../shared'),
    },
  },
  build: {
    ssr: 'src/entry-server.tsx',
    outDir: 'dist-ssr',
    rollupOptions: {
      output: {
        format: 'esm',
      },
    },
  },
  ssr: {
    // Externalize Node built-ins; keep everything else inlined
    noExternal: [/./],
  },
});
