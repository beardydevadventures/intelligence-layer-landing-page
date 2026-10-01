import { toHTML } from '@portabletext/to-html';
import type { PortableTextBlock } from '@portabletext/types';
import { record, safeUrl, text } from './helpers';
import type { ContentBlock, EditorialImage } from './types';
export const escapeHtml = (value: unknown) => text(value).replace(/[&<>"']/g, c => ({'&':'&amp;', '<':'&lt;', '>':'&gt;', '"':'&quot;', "'":'&#39;'}[c]!));
export function renderRichText(body: ContentBlock[]): string {
 return toHTML(body as PortableTextBlock[], {onMissingComponent: false, components: {
  marks: {link: ({value, children}) => {const url = safeUrl(value?.href); return url ? `<a href="${escapeHtml(url)}">${children}</a>` : children;}},
  types: {
   editorialImage: ({value}) => {const image = value.image as EditorialImage; return `<figure><img src="${escapeHtml(image.src)}" srcset="${escapeHtml(image.srcset)}" sizes="(max-width: 900px) 100vw, 800px" alt="${escapeHtml(image.alt)}" width="${image.width}" height="${image.height}" loading="lazy" decoding="async" />${image.caption ? `<figcaption>${escapeHtml(image.caption)}</figcaption>` : ''}</figure>`;},
   callout: ({value}) => `<aside class="content-callout">${text(value.title) ? `<p><strong>${escapeHtml(value.title)}</strong></p>` : ''}<p>${escapeHtml(value.text)}</p></aside>`,
   videoEmbed: ({value}) => {const media = record(value.media), embedUrl = safeUrl(media.embedUrl), src = safeUrl(media.src); return embedUrl ? `<div class="video-frame"><iframe src="${escapeHtml(embedUrl)}" title="${escapeHtml(media.title)}" loading="lazy" allow="fullscreen; picture-in-picture" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen></iframe></div>` : `<video controls preload="none" width="1600" height="900" aria-label="${escapeHtml(media.title)}"><source src="${escapeHtml(src)}" type="${escapeHtml(media.type)}" /></video>`;},
  },
 }});
}
