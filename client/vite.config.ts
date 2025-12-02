/**
 * Vite Configuration
 * 
 * Build configuration for React frontend with Storybook integration.
 * Includes API proxy, path aliases, and test setup for Playwright.
 * 
 * Recent Changes:
 * - [2025-10-27] FEAT: Added Vite config with Storybook and Playwright integration
 */

/// <reference types="vitest/config" />
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { storybookTest } from '@storybook/addon-vitest/vitest-plugin';
import { playwright } from '@vitest/browser-playwright';
const dirname = typeof __dirname !== 'undefined' ? __dirname : path.dirname(fileURLToPath(import.meta.url));

// More info at: https://storybook.js.org/docs/next/writing-tests/integrations/vitest-addon
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(dirname, './src'),
      '@shared': path.resolve(dirname, '../shared'),
    },
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          // React core and routing
          'react-vendor': ['react', 'react-dom', 'react-router-dom'],
          // Form handling
          'form-vendor': ['react-hook-form', '@hookform/resolvers', 'zod'],
          // UI components
          'ui-vendor': [
            'lucide-react',
            '@radix-ui/react-dialog',
            '@radix-ui/react-tabs',
            '@radix-ui/react-tooltip',
            '@radix-ui/react-radio-group',
            'clsx',
            'tailwind-merge'
          ],
          // PDF export
          'pdf-vendor': ['jspdf', 'html2canvas', 'jspdf-autotable'],
          // Markdown rendering
          'markdown-vendor': ['react-markdown', 'remark-gfm', 'rehype-highlight'],
          // tRPC and API
          'trpc': ['@trpc/client', '@trpc/react-query', '@tanstack/react-query']
        }
      }
    },
    // Adjust chunk size warning limit
    chunkSizeWarningLimit: 600
  },
  server: {
    host: '0.0.0.0',
    port: 5173,
    proxy: {
      '/api': {
        target: process.env.VITE_API_TARGET || 'http://localhost:3000',
        changeOrigin: true
      }
    }
  },
  test: {
    projects: [{
      extends: true,
      plugins: [
        // The plugin will run tests for the stories defined in your Storybook config
        // See options at: https://storybook.js.org/docs/next/writing-tests/integrations/vitest-addon#storybooktest
        storybookTest({
          configDir: path.join(dirname, '.storybook')
        })],
      test: {
        name: 'storybook',
        browser: {
          enabled: true,
          headless: true,
          provider: playwright({}),
          instances: [{
            browser: 'chromium'
          }]
        },
        setupFiles: ['.storybook/vitest.setup.ts']
      }
    }]
  }
});