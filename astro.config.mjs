import { defineConfig } from 'astro/config';
import mdx from '@astrojs/mdx';
import sitemap from '@astrojs/sitemap';
import tailwindcss from '@tailwindcss/vite';
import { fileURLToPath } from 'node:url';
import path from 'node:path';

const root = path.dirname(fileURLToPath(import.meta.url));

export default defineConfig({
  output: 'static',
  // No production URL yet (owner, 2026-11-01): the site isn't live. Sitemap skips output until `site` is set.
  integrations: [mdx(), sitemap()],
  vite: {
    plugins: [tailwindcss()],
    resolve: {
      alias: { '@': path.resolve(root, 'src') },
    },
    server: { host: '0.0.0.0', port: 3004, strictPort: true },
    preview: { host: '0.0.0.0', port: 3005, strictPort: true },
  },
});
