import {createImageUrlBuilder} from '@sanity/image-url';
import type { ContentBlock, ContentItem, EditorialImage, RelatedLink, Seo } from './types';
export const record = (value: unknown): Record<string, unknown> => value && typeof value === 'object' && !Array.isArray(value) ? value as Record<string, unknown> : {};
export const text = (value: unknown, fallback = '') => typeof value === 'string' && value.trim() ? value.trim() : fallback;
export const list = (value: unknown): unknown[] => Array.isArray(value) ? value : [];
export const strings = (value: unknown) => list(value).map(v => text(v)).filter(Boolean);
export const slug = (value: unknown) => { const s = text(value); return /^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(s) ? s : ''; };
export function safeUrl(value: unknown, fallback = ''): string {
 const s = text(value);
 if (/^#[a-zA-Z][\w-]*$/.test(s) || /^\/(?!\/)[a-zA-Z0-9/_#?=&%.-]*$/.test(s)) return s;
 try { const url = new URL(s); if (['https:', 'http:'].includes(url.protocol) && !url.username && !url.password) return url.href; } catch { /* Invalid URLs stay out of HTML attributes. */ }
 return fallback;
}
export function contactEmail(value: unknown, fallback: string) { const s = text(value); return /^[^\s@<>]+@[^\s@<>]+\.[^\s@<>]+$/.test(s) ? s : fallback; }
export function editorialImage(value: unknown): EditorialImage | undefined {
 const raw = record(value), asset = record(raw.asset), dimensions = record(record(asset.metadata).dimensions);
 const src = safeUrl(asset.url), alt = text(raw.alt);
 if (!src || !alt || !src.startsWith('https://cdn.sanity.io/images/')) return;
 const originalWidth = Number(dimensions.width), originalHeight = Number(dimensions.height);
 if (!Number.isFinite(originalWidth) || !Number.isFinite(originalHeight) || originalWidth < 1 || originalHeight < 1) return;
 const c = record(raw.crop), validCrop = ['left','right','top','bottom'].every(key => typeof c[key] === 'number' && Number(c[key]) >= 0 && Number(c[key]) < 1) && Number(c.left)+Number(c.right)<1 && Number(c.top)+Number(c.bottom)<1;
 const crop = validCrop ? {left:Number(c.left),right:Number(c.right),top:Number(c.top),bottom:Number(c.bottom)} : undefined;
 const width = Math.max(1,Math.round(originalWidth*(1-(crop?.left ?? 0)-(crop?.right ?? 0)))), height = Math.max(1,Math.round(originalHeight*(1-(crop?.top ?? 0)-(crop?.bottom ?? 0))));
 const [, , projectId, dataset] = new URL(src).pathname.split('/');
 try {
  const builder = createImageUrlBuilder({projectId,dataset}).image({asset:{url:src},crop});
  const transform = (w: number) => builder.width(w).auto('format').fit('max').url();
  const sizes = [...new Set([480,800,1200,1600,Math.min(width,1920)].filter(w => w<=width))].sort((a,b)=>a-b);
  return {src:transform(Math.min(width,1600)),alt,width,height,caption:text(raw.caption)||undefined,srcset:sizes.map(w=>`${transform(w)} ${w}w`).join(', ')};
 } catch { return; }

}
export function seo(value: unknown): Seo {
 const r = record(value), canonical = safeUrl(r.canonicalUrl); return {metaTitle: text(r.metaTitle) || undefined, metaDescription: text(r.metaDescription) || undefined, canonicalUrl: canonical.startsWith('https://') ? canonical : undefined, ogTitle: text(r.ogTitle) || undefined, ogDescription: text(r.ogDescription) || undefined, ogImage: editorialImage(r.ogImage), noIndex: r.noIndex === true};
}
export const items = (value: unknown): ContentItem[] => list(value).map(record).map(r => ({title: text(r.title), description: text(r.description)})).filter(r => r.title && r.description);
export function routeFor(value: unknown): string {
 const r = record(value), s = slug(r.slug ?? record(r.slug).current);
 if (!s) return '';
 if (r._type === 'project') return `/work/${s}/`;
 if (r._type === 'insight') return `/insights/${s}/`;
 if (r._type === 'service' && ['ai', 'xr'].includes(text(r.category))) return `/${r.category}/${s}/`;
 return '';
}
export const relatedLinks = (value: unknown): RelatedLink[] => list(value).map(record).map(r => ({title: text(r.title), href: routeFor(r)})).filter(r => r.title && r.href);
export function video(value: unknown) {
 const r = record(value), url = safeUrl(r.url), title = text(r.title);
 if (!url || !title) return;
 const u = new URL(url);
 if (r.provider === 'file' && /\.(mp4|webm)$/i.test(u.pathname)) return {src: url, title, type: u.pathname.endsWith('.webm') ? 'video/webm' : 'video/mp4'};
 let embedUrl = '';
 if (r.provider === 'youtube' && ['youtube.com','www.youtube.com','youtu.be'].includes(u.hostname)) {
  const id = u.hostname === 'youtu.be' ? u.pathname.slice(1) : u.searchParams.get('v') || u.pathname.split('/').pop();
  if (id && /^[\w-]{11}$/.test(id)) embedUrl = `https://www.youtube-nocookie.com/embed/${id}`;
 }
 if (r.provider === 'vimeo' && ['vimeo.com','www.vimeo.com'].includes(u.hostname) && /^\/\d+$/.test(u.pathname)) embedUrl = `https://player.vimeo.com/video${u.pathname}`;
 if (embedUrl) return {src: url, title, type: 'text/html', embedUrl};
}
export function portableText(value: unknown): ContentBlock[] {
 return list(value).flatMap((item): ContentBlock[] => {
  const r = record(item), type = text(r._type);
  if (type === 'block') {
   const markDefs = list(r.markDefs).map(record).flatMap(m => {
    const href = m._type === 'internalLink' ? routeFor(m.target) : safeUrl(m.href);
    return href ? [{_key: text(m._key), _type: 'link', href}] : [];
   });
   const allowed = new Set(['strong', 'em', ...markDefs.map(m => m._key)]);
   const children = list(r.children).map(record).filter(c => c._type === 'span' && typeof c.text === 'string').map(c => ({_type: 'span' as const, _key: text(c._key), text: c.text as string, marks: strings(c.marks).filter(m => allowed.has(m))}));
   if (!children.length) return [];
   return [{_type: 'block', _key: text(r._key), style: ['normal','h2','h3','h4','blockquote'].includes(text(r.style)) ? text(r.style) : 'normal', children, markDefs, ...(r.listItem === 'bullet' || r.listItem === 'number' ? {listItem: r.listItem, level: Math.min(3, Math.max(1, Number(r.level) || 1))} : {})}];
  }
  if (type === 'editorialImage') { const image = editorialImage(r.image ?? r); return image ? [{_type: type, image}] : []; }
  if (type === 'videoEmbed') { const media = video(r); return media ? [{_type: type, media}] : []; }
  if (type === 'callout' && text(r.text)) return [{_type: type, title: text(r.title), text: text(r.text)}];
  return [];
 });
}
export const isoDate = (value: unknown) => { const s = text(value); return s && Number.isFinite(Date.parse(s)) ? new Date(s).toISOString() : undefined; };
