import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

// https://vitejs.dev
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      // Sets up an absolute root macro shortcut directly to your client source folder
      '@': path.resolve(__dirname, './src'),
    },
  },
});
