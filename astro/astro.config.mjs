import { defineConfig } from 'astro/config';
import tailwindcss from '@tailwindcss/vite';
import { fileURLToPath } from 'node:url';
import path from 'node:path';

const root = path.dirname(fileURLToPath(import.meta.url));

export default defineConfig({
  output: 'static',
  // Share the Next app's public/ (client logos, llms.txt, agents.md) instead of copying it.
  publicDir: path.resolve(root, '../public'),
  vite: {
    plugins: [tailwindcss()],
    resolve: {
      alias: { '@': path.resolve(root, '../src') },
    },
    server: { host: '0.0.0.0', port: 3004, strictPort: true },
    preview: { host: '0.0.0.0', port: 3004, strictPort: true },
  },
});
