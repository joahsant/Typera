import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  server: {
    port: 3000,
  },
  // Exclude wawoff2 from pre-bundling – it uses WASM and requires special handling
  optimizeDeps: {
    exclude: ['wawoff2'],
  },
  build: {
    // Suppress chunk size warning for wawoff2 WASM bundle
    chunkSizeWarningLimit: 2000,
    rollupOptions: {
      output: {
        manualChunks: {
          'opentype': ['opentype.js'],
          'vendor':   ['react', 'react-dom', 'zustand'],
          'radix':    [
            '@radix-ui/react-dialog',
            '@radix-ui/react-slider',
            '@radix-ui/react-checkbox',
            '@radix-ui/react-tabs',
            '@radix-ui/react-tooltip',
            '@radix-ui/react-popover',
            '@radix-ui/react-label',
          ],
        },
      },
    },
  },
});
