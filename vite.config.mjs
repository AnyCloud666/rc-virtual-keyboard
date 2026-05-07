import path from 'node:path';
import { fileURLToPath } from 'node:url';

import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';
import svgr from 'vite-plugin-svgr';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const repo = 'rc-virtual-keyboard';

export default defineConfig(({ command }) => ({
  base: command === 'build' ? `/${repo}/` : '/',
  plugins: [
    react(),
    svgr({
      include: '**/*.svg',
      svgrOptions: {
        exportType: 'named',
        ref: true,
        svgo: false,
        titleProp: true,
      },
    }),
  ],
  resolve: {
    alias: {
      'rc-virtual-keyboard': path.resolve(__dirname, 'src'),
      '@docs': path.resolve(__dirname, 'docs-app'),
    },
  },
  server: {
    host: '0.0.0.0',
    port: 9527
  },
  preview: {
    host: '0.0.0.0',
  },
  build: {
    outDir: 'docs-dist',
    emptyOutDir: true,
    chunkSizeWarningLimit: 900,
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes('node_modules')) {
            if (id.includes('tesseract.js')) {
              return 'vendor-ocr';
            }
          }
        },
      },
    },
  },
}));
