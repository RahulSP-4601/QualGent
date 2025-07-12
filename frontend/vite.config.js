import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
  plugins: [react()],
  optimizeDeps: {
    // avoid pre-bundling problems by disabling native esbuild
    esbuildOptions: {
      target: 'esnext',
      supported: {
        'top-level-await': true
      },
    },
  },
  resolve: {
    alias: {
      esbuild: path.resolve(__dirname, 'node_modules/esbuild-wasm')
    }
  }
});
