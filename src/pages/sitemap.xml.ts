import type {APIRoute} from 'astro';
import {site} from '../data/site';
import {getContent} from '../lib/sanity/content';
import {escapeHtml} from '../lib/sanity/rich-text';
export const GET: APIRoute = async () => {
 const {homepage,projects,services,insights} = await getContent();
 const pages = [...['/services/','/industries/','/about/','/start-a-project/'].map(path=>({path,seo:{noIndex:false}})), {path:'/',seo:homepage.seo},{path:'/work/',seo:{noIndex:false}}, ...(insights.length ? [{path:'/insights/',seo:{noIndex:false}}] : []), ...projects.map(p => ({path:p.href,seo:p.seo})), ...services.map(s => ({path:`/${s.category}/${s.slug}/`,seo:s.seo})), ...insights.map(i => ({path:`/insights/${i.slug}/`,seo:i.seo}))];
 const urls = [...new Set(pages.filter(p => !p.seo.noIndex && (!('canonicalUrl' in p.seo) || !p.seo.canonicalUrl || p.seo.canonicalUrl === `${site.url}${p.path}`)).map(p => `${site.url}${p.path}`))];
 return new Response(`<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${urls.map(url => `<url><loc>${escapeHtml(url)}</loc></url>`).join('')}</urlset>`,{headers:{'Content-Type':'application/xml; charset=utf-8'}});
};
