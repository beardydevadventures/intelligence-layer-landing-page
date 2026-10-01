# Commercial site implementation

## Audit and homepage
The original homepage gave cybersecurity, automation, digital solutions and spatial computing equal prominence. Products preceded work, selected work was a coming-soon placeholder, and metadata was limited to a homepage title and description.

The homepage now follows: Hero, Selected Work, AI & Automation, XR & Spatial Computing, What We Can Build, How We Work, Products & Ventures, Contact. The process now has six steps including Prototype. Supporting platforms, cloud and security expertise appears below the outcome-led content. The logo, font system, original product mock-ups, navy surfaces and SceneCanvas remain.

## Files and routes
- `src/pages/index.astro`: revised homepage.
- `src/pages/xr/vr-development/index.astro`: `/xr/vr-development/`, including buyer questions, platforms and shared project cards.
- `src/pages/404.astro`: generated `404.html`; configure the production host to return it with HTTP 404 for missing paths.
- `src/layouts/SiteLayout.astro`: shared header/footer, metadata, JSON-LD and keyboard-accessible menu. Navigation remains available without JavaScript.
- `src/components/ProjectCard.astro`: reusable project card with optional image/video support.
- `src/components/ContactSection.astro`: shared project CTA.
- `src/components/Logo.astro`: home link works from every route.
- `src/data/projects.ts`: typed project data, including media hooks and independent-concept disclosure.
- `src/data/site.ts`: canonical site identity and Organization data.
- `src/pages/sitemap.xml.ts`, `public/robots.txt`: indexable routes and public crawler access.
- `astro.config.ts`, `src/styles/global.css`: canonical site/trailing slash configuration and responsive additions to the existing visual system.

## SEO and answer content
Unique titles/descriptions, canonicals, Open Graph and Twitter summary metadata are shared through the layout. Homepage JSON-LD includes Organization and WebSite. The VR page includes Organization, Service and BreadcrumbList. Buyer questions are visible semantic HTML; no FAQ rich-result strategy is used. Only the 404 is noindex. All commercial copy and project evidence descriptions are available without JavaScript. Reduced-motion handling and idle-loaded SceneCanvas remain.

The canonical domain is configured as `https://intelligencelayer.com.au`; confirm this matches the production host's preferred hostname before deployment. Robots allows public crawlers, including Googlebot, Bingbot and OAI-SearchBot. No separate training-crawler policy was added.

## Validation
`npm.cmd run build` passes Astro checks and static build with zero errors, warnings or hints. Generated HTML was checked for a single H1, parseable JSON-LD, valid internal navigation targets and expected indexability. No separate lint or test scripts exist in package.json. A browser was unavailable in this session, so visual QA, mobile interaction testing and measured Core Web Vitals remain to be verified in a browser. Production HTTP 404 behaviour depends on hosting configuration.

## Media and future work
The VR page explains multidisciplinary production capacity and Intelligence Layer's responsibility for the client relationship, project direction and delivery. Its capability list describes skills assembled for each experience, without implying permanent staffing. No delivery businesses or individual specialists are named.

Portfolio entries must reflect Intelligence Layer involvement in conception, direction, development or delivery. Independent work by other studios must not be added as Intelligence Layer case studies. Optional `collaborators` and `showCollaborators` fields exist in the project type but are unset and not rendered. Future attribution requires explicit approval and a deliberate presentation change.

Provide genuine Diamond Easy, AI Digital Twin and Brisbane 2032 Digital Twin captures or videos, with descriptive alt text and video posters. Add image `{ src, alt, width, height }` or video `{ src, type, title }` fields in `src/data/projects.ts`; cards automatically render them. No fabricated project artwork or screenshots were added. Existing product mock-ups are preserved.

Future work/service/insight routes are intentionally deferred. The AI CTA currently opens an email enquiry; switch it to `/ai/ai-automation/` when that page is published. For new routes, use SiteLayout and shared project data, extend the sitemap and provide page-specific schema. Project pages can add CreativeWork/Article and BreadcrumbList; add VideoObject only when genuine video metadata exists. No FoVR changes were made.


## Sanity CMS implementation

Sanity Studio is configured as a separate app for project `gr23tee8`, initially targeting the `production` dataset. Public Astro pages stay static. The official Astro integration shares configuration with the typed build-time content layer in `src/lib/sanity/`. Queries, normalisation, responsive image transforms, safe Portable Text rendering and SEO helpers are organised there.

Editable content includes singleton Site Settings and Homepage, structured Services, Projects, Insights, FAQ objects and an optional Testimonial schema. Developers retain layouts, headings, route patterns, animation, structured data and technical SEO. Optional client/collaborator approval fields do not automatically expose names; the public queries omit those fields. Testimonials are not displayed.

Homepage, contact, shared layout, project cards and the VR route now use normalised CMS content. Shared service templates support future `/ai/{slug}/` and `/xr/{slug}/` routes from published documents. `/work/`, `/work/{slug}/`, `/insights/` and `/insights/{slug}/` are generated from published content. Sitemaps honour indexing controls and canonical overrides; project/article pages emit CreativeWork/Article and breadcrumbs. Related references generate useful internal links and reject unavailable targets.

Studio includes an authenticated draft-content review view, media selection, validation and publishing. It does not provide full-page Presentation overlays; those remain deferred until an appropriate server preview deployment exists. The public site and Studio build independently, and no Studio/React editor runtime is added to public page rendering.

`npm run cms:seed` creates an ignored six-document NDJSON migration export from approved existing content. A completely empty dataset retains approved baseline site content until migration. Once CMS documents exist, published project lists are authoritative. Fetch failures stop deployment builds; individual malformed fields are normalised or rejected. CMS drafts and release versions do not become public pages.

Validation: content safeguards have dedicated automated tests; public-site build, Studio build and Studio schema validation were exercised. The real GROQ query succeeds against the supplied production dataset, which has now been seeded with the six approved documents. Compatible scoped CLI dependency patches leave the npm audit clean. Browser UI checks, actual draft-save/publish verification and live media upload checks require an authenticated editor environment.

Activation completed: authenticated the Sanity CLI, imported the six-document seed using `--missing`, and deployed Studio at https://intelligence-layer.sanity.studio/. The deployment ID is persisted for future updates, and Studio builds deploy from `studio-dist` separately from public `dist`. All six imported documents validate without warnings, and authenticated draft isolation is checked without publishing test content. The public host is the existing Cloudflare Worker intelligence-layer-landing-page in the business account. Static asset deployment configuration is prepared and passes a Wrangler dry run. The Sanity production publishing webhook is connected to the dashboard-created Workers Builds hook. A same-value homepage update verified HTTP 200 delivery, with drafts and release versions excluded. Public production project/dataset identifiers are committed in .env.production; all secret URLs and tokens remain ignored. The CLI lacks Workers CI access, so dashboard build logs are needed to verify cloud builds. See `README.md` for editor access, environment names, preview, publishing, content creation and SEO guidance.

Publishing verification: the saved Workers Builds hook is connected in Sanity and both delivery tests returned HTTP 200 without changing visible homepage copy. The dashboard had no build command, so Wrangler now runs npm run build through its custom-build configuration before uploading. After the corrected rebuild, the live Worker serves the CMS homepage, Diamond Easy project and VR Development page with HTTP 200 and structured metadata. An unknown route returns HTTP 404 with the site's custom error page. All 14 content tests pass; Astro reports zero errors, warnings or hints. Browser visual QA remains outstanding.
