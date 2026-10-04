import type { PortableTextBlock } from '@portabletext/types';
import type { Project } from '../../data/projects';
import type {MarketingCopy} from '../../data/marketing';
export type ContentBlock = PortableTextBlock | { _type: string; _key?: string; [key: string]: unknown };
export interface EditorialImage { src: string; alt: string; width: number; height: number; caption?: string; srcset: string }
export interface Seo { metaTitle?: string; metaDescription?: string; canonicalUrl?: string; ogTitle?: string; ogDescription?: string; ogImage?: EditorialImage; noIndex: boolean }
export interface ContentItem { title: string; description: string }
export interface Venture extends ContentItem { positioning: string; image?: EditorialImage; url?: string; ctaLabel?: string; status?: string }
export interface Faq { question: string; answer: string }
export interface RelatedLink { title: string; href: string }
export interface CmsProject extends Project { id: string; href: string; body: ContentBlock[]; gallery: EditorialImage[]; image?: EditorialImage; seo: Seo; related: RelatedLink[]; projectType?: string; clientName?: string; externalUrl?: string; status?: string; publishedAt?: string; showClientName: boolean }
export interface Service { id: string; title: string; slug: string; category: 'ai' | 'xr'; headline: string; introduction: string; shortDescription: string; overviewHeading?: string; overviewCopy?: string; useCases: ContentItem[]; capabilities: ContentItem[]; technologies: string[]; faqs: Faq[]; featuredProjects: CmsProject[]; related: RelatedLink[]; seo: Seo; publishedAt?: string; productionCapabilities: string[]; deliveryHeading?: string; deliveryIntroduction?: string; deliveryApproach?: string; workIntroduction?: string }
export interface Insight { id: string; title: string; slug: string; excerpt: string; body: ContentBlock[]; coverImage?: EditorialImage; author: string; publishedAt?: string; updatedAt?: string; category?: string; related: RelatedLink[]; seo: Seo }
export interface Settings { companyName: string; contactEmail: string; contactCta: string; locationDescription: string; defaultSeoTitle: string; defaultMetaDescription: string; defaultOgImage?: EditorialImage; socialLinks: {label: string; url: string}[] }
export interface Homepage { heroEyebrow: string; heroHeading: string; heroIntroduction: string; primaryCtaLabel: string; primaryCtaDestination: string; secondaryCtaLabel: string; workIntroduction: string; aiHeading: string; aiIntroduction: string; xrHeading: string; xrIntroduction: string; buildIntroduction: string; processIntroduction: string; productsIntroduction: string; finalCtaHeading: string; finalCtaCopy: string; aiCapabilities: string[]; xrCategories: ContentItem[]; outcomes: ContentItem[]; ventures: Venture[]; featuredProjects: CmsProject[]; seo: Seo }
export interface Commercial { industries: (ContentItem & {services:string[]})[]; processSteps: ContentItem[]; about: {title:string; introduction:string; delivery:string; evidence:string}; team: {name:string; role:string; biography:string; image?:EditorialImage}[] }
export interface SiteContent { settings: Settings; homepage: Homepage; projects: CmsProject[]; services: Service[]; insights: Insight[]; commercial: Commercial; marketing: MarketingCopy }
