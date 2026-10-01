import {site} from '../../data/site';
import type {Seo, Settings} from './types';
export function pageSeo(seo: Seo, settings: Settings, title?: string, description?: string, path = '/') {
 return {title: seo.metaTitle || title || settings.defaultSeoTitle, description: seo.metaDescription || description || settings.defaultMetaDescription, canonical: seo.canonicalUrl || new URL(path, site.url).href, ogTitle: seo.ogTitle, ogDescription: seo.ogDescription, ogImage: seo.ogImage || settings.defaultOgImage, noindex: seo.noIndex};
}
export function breadcrumbs(items: {name: string; path: string}[]) {return {'@type':'BreadcrumbList', itemListElement: items.map((item,i) => ({'@type':'ListItem', position:i+1, name:item.name, item:new URL(item.path, site.url).href}))};}
