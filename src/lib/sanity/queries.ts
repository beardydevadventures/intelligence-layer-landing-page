import {marketingKeys} from '../../data/marketing';
// Explicit projections intentionally exclude client and collaborator names.
const image = `{alt, caption, crop, hotspot, asset->{url, metadata{dimensions{width, height}}}}`;
const seo = `seo{metaTitle, metaDescription, canonicalUrl, ogTitle, ogDescription, noIndex, ogImage${image}}`;
const relation = `{_type, title, category, "slug": slug.current}`;
const body = `body[]{..., _type == "editorialImage" => {"image": ${image}}, _type == "block" => { ..., markDefs[]{..., _type == "internalLink" => {"target": target->${relation}}}}}`;
export const siteQuery = `{
 "marketing": *[_type == "marketingCopy" && _id == "marketingCopy"][0]{${marketingKeys.join(', ')}},
 "commercial": *[_type == "commercialContent" && _id == "commercialContent"][0]{industries, processSteps, aboutTitle, aboutIntroduction, aboutDelivery, aboutEvidence, team[]{name, role, biography, approvedForPublication, image${image}}},
 "settings": *[_type == "siteSettings" && _id == "siteSettings"][0]{companyName, contactEmail, contactCta, locationDescription, defaultSeoTitle, defaultMetaDescription, defaultOgImage${image}, socialLinks},
 "homepage": *[_type == "homepage" && _id == "homepage"][0]{heroEyebrow, heroHeading, heroIntroduction, primaryCtaLabel, primaryCtaDestination, secondaryCtaLabel, workIntroduction, aiHeading, aiIntroduction, xrHeading, xrIntroduction, buildIntroduction, processIntroduction, productsIntroduction, finalCtaHeading, finalCtaCopy, aiCapabilities, xrCategories, outcomes, ventures, "featuredProjectIds": featuredProjects[]._ref, ${seo}},
 "projects": *[_type == "project" && !(_id in path("drafts.**"))] | order(featured desc, title asc){_id, title, "slug": slug.current, category, headline, shortDescription, tags, featured, technologies, platforms, projectType, projectStatus, attributionNote, externalUrl, publishedAt, coverImage${image}, gallery[]${image}, video, videoPoster${image}, ${body}, "related": services[]->${relation}, ${seo}},
 "services": *[_type == "service" && !(_id in path("drafts.**"))] | order(title asc){_id, title, "slug": slug.current, category, headline, introduction, shortDescription, overviewHeading, overviewCopy, useCases, capabilities, technologies, faqs, productionCapabilities, deliveryHeading, deliveryIntroduction, deliveryApproach, workIntroduction, publishedAt, "featuredProjectIds": featuredProjects[]._ref, "related": *[_type == "insight" && ^._id in relatedServices[]._ref]${relation}, ${seo}},
 "insights": *[_type == "insight" && !(_id in path("drafts.**"))] | order(publishedAt desc){_id, title, "slug": slug.current, excerpt, author, publishedAt, updatedAt, category, coverImage${image}, ${body}, "related": (relatedServices[]->${relation} + relatedProjects[]->${relation}), ${seo}}
}`;
