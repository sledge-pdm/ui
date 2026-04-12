/// <reference types="vitest/config" />
import { defineConfig } from 'vite';
import solidPlugin from 'vite-plugin-solid';

// https://vite.dev/config/
export default defineConfig({
  plugins: [solidPlugin()],
  define: {
    'process.env': {},
  },
  publicDir: './public',
});
