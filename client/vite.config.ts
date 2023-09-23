import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';

export default defineConfig({
  plugins: [react()],
  root: 'src',
  server: {
    open: true,
    port: 3000,
  },
  build: {
    outDir: '../dist',
  },
});
