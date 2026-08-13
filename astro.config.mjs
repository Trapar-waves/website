import { defineConfig } from 'astro/config';
import tailwindcss from '@tailwindcss/vite';
import sitemap from '@astrojs/sitemap';

export default defineConfig({
  output: 'static',
  site: 'https://trapar-waves.github.io/website',
  base: '/website',
  vite: {
    plugins: [tailwindcss()],
  },
  integrations: [sitemap()],
});
