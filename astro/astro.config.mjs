import { defineConfig } from 'astro/config';
import react from '@astrojs/react';
import tailwindcss from '@tailwindcss/vite';
import { fileURLToPath } from 'node:url';
import path from 'node:path';

const root = path.dirname(fileURLToPath(import.meta.url));

export default defineConfig({
  output: 'static',
  // Share the Next app's public/ (client logos, llms.txt, agents.md) instead of copying it.
  publicDir: path.resolve(root, '../public'),
  integrations: [react()],
  vite: {
    plugins: [tailwindcss()],
    resolve: {
      alias: { '@': path.resolve(root, '../src') },
      // Shared components in ../src would otherwise resolve these from the Next app's
      // node_modules: two Reacts, and hooks fail.
      dedupe: ['react', 'react-dom', 'lucide-react', '@base-ui/react'],
    },
    server: { host: '0.0.0.0', port: 3004, strictPort: true },
    preview: { host: '0.0.0.0', port: 3004, strictPort: true },
  },
});
