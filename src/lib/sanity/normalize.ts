import { defaultHomepage, defaultSettings, defaultVrService } from './defaults';
import { projects as baselineProjects } from '../../data/projects';
import { contactEmail, editorialImage, isoDate, items, list, portableText, record, relatedLinks, safeUrl, seo, slug, strings, text, video } from './helpers';
import type { CmsProject, Homepage, Insight, Service, Settings, SiteContent } from './types';
import {coreServices, industries, processSteps, aboutCopy} from '../../data/commercial';
import {defaultMarketingCopy,marketingKeys} from '../../data/marketing';
const published = (value: unknown) => !text(record(value)._id).startsWith('drafts.') && !text(record(value)._id).startsWith('versions.');
export function normalizeContent(value: unknown, configured = false): SiteContent {
 const raw = record(value), rawSettings = record(raw.settings), rawHome = record(raw.homepage);
 const settings = {...defaultSettings, socialLinks: []} as Settings;
 for (const key of ['companyName','contactCta','locationDescription','defaultSeoTitle','defaultMetaDescription'] as const) settings[key] = text(rawSettings[key], defaultSettings[key]);
 settings.contactEmail = contactEmail(rawSettings.contactEmail, defaultSettings.contactEmail);
 settings.defaultOgImage = editorialImage(rawSettings.defaultOgImage);
 settings.socialLinks = list(rawSettings.socialLinks).map(record).map(r => ({label: text(r.label), url: safeUrl(r.url)})).filter(r => r.label && r.url);
 const rawProjects = configured ? list(raw.projects).filter(published) : baselineProjects.map(p => ({...p, _id: `project-${p.slug}`, shortDescription: p.description, platforms: p.platform, attributionNote: p.note}));
 const projectSlugs = new Set<string>();
 const projects: CmsProject[] = rawProjects.flatMap(value => {
  const r = record(value), s = slug(r.slug), title = text(r.title), description = text(r.shortDescription);
  if (!s || !title || !description || projectSlugs.has(s)) return [];
  projectSlugs.add(s);
  return [{id: text(r._id, `project-${s}`), slug: s, title, category: text(r.category), headline: text(r.headline, title), description, tags: strings(r.tags), featured: r.featured === true, technologies: strings(r.technologies), platform: strings(r.platforms), href: `/work/${s}/`, body: portableText(r.body), gallery: list(r.gallery).map(editorialImage).filter((i): i is NonNullable<typeof i> => !!i), image: editorialImage(r.coverImage), video: video(r.video), poster: editorialImage(r.videoPoster)?.src, note: text(r.attributionNote) || undefined, seo: seo(r.seo), related: relatedLinks(r.related), projectType: text(r.projectType) || undefined, externalUrl: safeUrl(r.externalUrl) || undefined, status: text(r.projectStatus) || undefined, publishedAt: isoDate(r.publishedAt), showClientName: false}];
 });
 const byIds = (value: unknown) => strings(value).map(id => projects.find(p => p.id === id)).filter((p): p is CmsProject => !!p);
 const rawServices = list(raw.services).filter(published).map(record);
 const vr = rawServices.find(r => r.slug === 'vr-development' && r.category === 'xr');
 const serviceSources: Record<string, unknown>[] = [ {...defaultVrService, ...vr, _id: text(vr?._id, defaultVrService.id), title: text(vr?.title, defaultVrService.title), seo: {...defaultVrService.seo, ...record(vr?.seo)}}, ...coreServices.map(base => ({...base, _id:base.id, ...rawServices.find(r => r.slug === base.slug && r.category === base.category)})), ...rawServices.filter(r => !(r.slug === 'vr-development' && r.category === 'xr') && !coreServices.some(base => base.slug === r.slug && base.category === r.category)) ];
 const servicePaths = new Set<string>();
 const services: Service[] = serviceSources.flatMap(r => {
  const s = slug(r.slug), title = text(r.title), category = text(r.category);
  if (!s || !title || !['ai','xr'].includes(category) || servicePaths.has(`${category}/${s}`)) return [];
  servicePaths.add(`${category}/${s}`);
  const fallback = s === 'vr-development' && category === 'xr' ? defaultVrService : coreServices.find(base => base.slug === s && base.category === category);
  if (!fallback && (!text(r.introduction) || !text(r.shortDescription))) return [];
  const arr = (key: 'useCases' | 'capabilities') => items(r[key]).length ? items(r[key]) : fallback?.[key] ?? [];
  const chosenProjects = Array.isArray(r.featuredProjectIds) ? byIds(r.featuredProjectIds) : s === 'vr-development' ? projects.filter(p => p.platform.includes('Meta Quest') || p.platform.includes('VR')) : [];
  const faqs = list(r.faqs).map(record).map(f => ({question: text(f.question), answer: text(f.answer)})).filter(f => f.question && f.answer);
  return [{id: text(r._id, `service-${s}`), slug: s, title, category: category as 'ai' | 'xr', headline: text(r.headline, fallback?.headline ?? title), introduction: text(r.introduction, fallback?.introduction ?? ''), shortDescription: text(r.shortDescription, fallback?.shortDescription ?? ''), overviewHeading: text(r.overviewHeading) || undefined, overviewCopy: text(r.overviewCopy) || undefined, useCases: arr('useCases'), capabilities: arr('capabilities'), technologies: strings(r.technologies), faqs: faqs.length ? faqs : fallback?.faqs ?? [], featuredProjects: chosenProjects, related: relatedLinks(r.related), seo: seo(r.seo), publishedAt: isoDate(r.publishedAt), productionCapabilities: strings(r.productionCapabilities), deliveryHeading: text(r.deliveryHeading) || undefined, deliveryIntroduction: text(r.deliveryIntroduction) || undefined, deliveryApproach: text(r.deliveryApproach) || undefined, workIntroduction: text(r.workIntroduction) || undefined}];
 });
 const homepage = {...defaultHomepage, featuredProjects: [], seo: seo(rawHome.seo)} as Homepage;
 for (const key of ['heroEyebrow','heroHeading','heroIntroduction','primaryCtaLabel','secondaryCtaLabel','workIntroduction','aiHeading','aiIntroduction','xrHeading','xrIntroduction','buildIntroduction','processIntroduction','productsIntroduction','finalCtaHeading','finalCtaCopy'] as const) homepage[key] = text(rawHome[key], defaultHomepage[key]);
 homepage.primaryCtaDestination = safeUrl(rawHome.primaryCtaDestination, defaultHomepage.primaryCtaDestination);
 homepage.aiCapabilities = strings(rawHome.aiCapabilities).length ? strings(rawHome.aiCapabilities) : defaultHomepage.aiCapabilities;
 for (const key of ['xrCategories','outcomes'] as const) homepage[key] = items(rawHome[key]).length ? items(rawHome[key]) : defaultHomepage[key];
 homepage.ventures = list(rawHome.ventures).map(record).map(r => {
  const url = safeUrl(r.url);
  return {title:text(r.title),positioning:text(r.positioning),description:text(r.description),image:editorialImage(r.image),url:url.startsWith('https://') ? url : undefined,ctaLabel:text(r.ctaLabel) || undefined,status:text(r.status) || undefined};
 }).filter(r => r.title && r.description);
 homepage.featuredProjects = Array.isArray(rawHome.featuredProjectIds) ? byIds(rawHome.featuredProjectIds) : projects.filter(p => p.featured);
 const insightSlugs = new Set<string>();
 const insights: Insight[] = list(raw.insights).filter(published).flatMap(v => {
  const r = record(v), s = slug(r.slug), title = text(r.title), excerpt = text(r.excerpt), body = portableText(r.body);
  if (!s || !title || !excerpt || !body.length || insightSlugs.has(s)) return [];
  insightSlugs.add(s);
  return [{id: text(r._id), slug: s, title, excerpt, body, coverImage: editorialImage(r.coverImage), author: text(r.author, settings.companyName), publishedAt: isoDate(r.publishedAt), updatedAt: isoDate(r.updatedAt), category: text(r.category) || undefined, related: relatedLinks(r.related), seo: seo(r.seo)}];
 });
 // Remove references to unpublished or rejected content rather than emitting broken links.
 const routes = new Set(['/', '/work/', '/insights/', '/services/', '/industries/', '/about/', '/start-a-project/', ...projects.map(p => p.href), ...services.map(s => `/${s.category}/${s.slug}/`), ...insights.map(i => `/insights/${i.slug}/`)]);
 for (const item of [...projects, ...services, ...insights]) item.related = item.related.filter(link => routes.has(link.href));
 if (homepage.primaryCtaDestination.startsWith('#') && !new Set(['#contact','#work','#automation','#spatial','#build','#services','#industries','#credibility','#process','#products','#top','#main']).has(homepage.primaryCtaDestination)) homepage.primaryCtaDestination = '#contact';
 if (homepage.primaryCtaDestination.startsWith('/') && !routes.has(homepage.primaryCtaDestination.split(/[?#]/)[0])) homepage.primaryCtaDestination = '#contact';
 const rawCommercial=record(raw.commercial);
 const commercial = {
  industries: Array.isArray(rawCommercial.industries) ? list(rawCommercial.industries).map(record).map(r=>({title:text(r.title),description:text(r.description),services:strings(r.services).filter(s=>coreServices.some(service=>service.slug===s))})).filter(r=>r.title && r.description) : industries,
  processSteps: items(rawCommercial.processSteps).length === 6 ? items(rawCommercial.processSteps) : processSteps,
  about:{title:text(rawCommercial.aboutTitle,aboutCopy.title),introduction:text(rawCommercial.aboutIntroduction,aboutCopy.introduction),delivery:text(rawCommercial.aboutDelivery,aboutCopy.delivery),evidence:text(rawCommercial.aboutEvidence,aboutCopy.evidence)},
  team:Array.isArray(rawCommercial.team) ? list(rawCommercial.team).map(record).filter(r=>r.approvedForPublication === true).map(r=>({name:text(r.name),role:text(r.role),biography:text(r.biography),image:editorialImage(r.image)})).filter(r=>r.name) : [],
 };
 const rawMarketing=record(raw.marketing), marketing={...defaultMarketingCopy};
 for(const key of marketingKeys) marketing[key]=text(rawMarketing[key],defaultMarketingCopy[key]);
 return {settings, homepage, projects, services, insights, commercial, marketing};
}

