import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
  plugins: [react()],
  // Add preview and server configurations for port binding
  preview: {
    port: parseInt(process.env.PORT || '3000'),
    host: '0.0.0.0',
  },
  server: {
    port: parseInt(process.env.PORT || '3000'),
    host: true,
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: [
            'react',
            'react-dom',
            'react-router-dom',
            'recharts',
            'lucide-react'
          ],
          ui: [
            '@radix-ui/react-accordion',
            '@radix-ui/react-alert-dialog',
            '@radix-ui/react-dialog',
            '@radix-ui/react-dropdown-menu',
            '@radix-ui/react-tabs'
          ]
        }
      }
    },
    chunkSizeWarningLimit: 1000
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'src'),
      '@components': path.resolve(__dirname, 'src/components'),
      '@utils': path.resolve(__dirname, 'src/utils'),
    },
  }
});
