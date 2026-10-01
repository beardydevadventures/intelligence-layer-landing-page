import { defineConfig } from 'astro/config';
import tailwindcss from '@tailwindcss/vite';
import sanity from '@sanity/astro';
import { loadEnv } from 'vite';
import { cmsConfig } from './sanity.shared';
const env = {...loadEnv(process.env.NODE_ENV || 'development', process.cwd(), ''), ...process.env};
const config = cmsConfig(env);
export default defineConfig({
 site: 'https://intelligencelayer.com.au', trailingSlash: 'always', output: 'static',
 integrations: config.projectId ? [sanity(config)] : [],
 vite: {plugins: [tailwindcss()]},
});
