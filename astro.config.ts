import { defineConfig } from 'astro/config';
import tailwindcss from '@tailwindcss/vite';

export default defineConfig({
  site: 'https://intelligencelayer.com.au',
  trailingSlash: 'always',
  output: 'static',
  vite: { plugins: [tailwindcss()] },
});
