import type { APIRoute } from 'astro';
import { site } from '../data/site';
// Include only published, indexable routes. Extend alongside future service/work pages.
export const GET: APIRoute = () => new Response(`<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${['/', '/xr/vr-development/'].map(path => `<url><loc>${site.url}${path}</loc></url>`).join('')}</urlset>`, { headers: { 'Content-Type': 'application/xml; charset=utf-8' } });
