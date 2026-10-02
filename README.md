> Current Phase 1 release boundary: the continuation is preparation only. Historical production setup below is not permission to deploy or publish. See [release checklist](RELEASE-CHECKLIST.md), [Guy's editing handover](CMS-HANDOVER.md), [HubSpot setup](HUBSPOT-SETUP.md) and [measurement setup](MEASUREMENT.md) for current evidence and pending acceptance.

# Intelligence Layer

Astro static website for AI automation and immersive technology. Page layout, routing, semantic HTML, animation and SEO generation stay in code; editable marketing and editorial content lives in Sanity.

## Phase 1 sales-ready branch

The current route and acceptance record is in `PHASE-1.md`. Commercial navigation includes Services, Industries, Work, About and Start a Project. Existing AI/XR and project URLs are preserved. Four core service pages and a seven-sector industry page use outcome-led copy; potential use cases are not past-client claims. The homepage follows positioning, services, sectors, process, work, delivery credibility, ventures and enquiry.

The **Page headings & enquiry copy** singleton groups remaining marketing headings, page introductions, CTA labels and enquiry/confirmation copy. Blank fields use the displayed defaults; no existing documents need to be overwritten. Homepage heading line breaks remain editable. Form controls, loading/error messages, navigation categories and technical labels remain in code. The new **Industries, process & About** singleton edits sector copy and service mappings, all six delivery stages, About text and team information. Only team entries explicitly approved for publication render. Matthew and Guy are named per the Phase 1 instruction, with no invented titles, biographies or credentials. Existing Site Settings, Homepage, Services and Projects retain their editing workflow. Draft preview includes the new content. The seed exporter now prepares twelve documents; `--missing` preserves all existing CMS documents. On an existing dataset it adds only the six missing Phase 1 documents. Review the generated file before import.

Activation after branch approval requires updating Studio separately, importing the missing documents and extending the existing published-only webhook filter to `_type in ["siteSettings", "homepage", "commercialContent", "marketingCopy", "service", "project", "insight"] && !(_id in path("drafts.**")) && !(_id in path("versions.**"))`. Do not publish or deploy just to test this branch. Verify Guy can log in, save a draft, review it and publish after release authorisation; confirm the host completes a successful rebuild and measure the elapsed time. Earlier publishing evidence does not verify the new content type or guarantee a 2–3 minute build.

### HubSpot enquiry activation

Set `PUBLIC_HUBSPOT_PORTAL_ID` and `PUBLIC_HUBSPOT_FORM_ID` to public identifiers for a dedicated enquiry form. No browser API token is used. The form must accept contact properties `firstname`, `lastname`, `company`, `email`, `phone`, and `message`; only email, company and first name should be required on the HubSpot side. Qualification answers are combined in `message`. Configure lead-owner notifications and review the form's consent and spam requirements in HubSpot. If it requires a CAPTCHA or consent payload, adapt the integration to those actual settings before enabling it. No marketing subscription is requested by the website.

The implementation uses [HubSpot's documented browser submission endpoint](https://developers.hubspot.com/docs/api-reference/legacy/marketing/forms/v3-legacy/submit-data-unauthenticated). A real accepted submission and CRM receipt must be verified before ILW-7 is Done. Missing or invalid identifiers disable online submission and present the working email route. Errors retain the visitor's input; success is shown only after an accepted response. Nothing is stored in local storage or placed in URL parameters.

### Measurement and launch

Start a Project clicks and confirmed enquiries emit `intelligence-layer:conversion` custom events with only an event name and pathname. The event hook is ready for an approved analytics collector; it does not itself collect analytics. Analytics provider/property, consent handling and Search Console verification remain release dependencies. `PUBLIC_GOOGLE_SITE_VERIFICATION` can supply the site's verification meta token when authorised. Do not fabricate identifiers or treat local events as measured conversions.

## Development

Use Node.js 24 LTS (or a compatible version meeting Sanity's engine requirements).

```sh
npm ci
# Copy .env.example to .env and set the project/dataset identifiers.
npm run dev
npm run build
npm test
```

The public site builds to `dist`. The Studio builds separately to `studio-dist`; never deploy Studio output over the public site output.

## CMS

The configured Sanity project is Intelligence Layer (`gr23tee8`), using the `production` dataset. Verify the dataset before the first import. Development Studio runs with `npm run cms:dev`, normally at `http://localhost:3333`. The editor Studio is deployed at **https://intelligence-layer.sanity.studio/**. Update it separately with `npm run cms:deploy`; the deployment ID is saved in `sanity.cli.ts`. Editors use that URL and their own Sanity login. Only invited project members with appropriate roles can edit or publish.

Required variable names:

- Public-site build: `SANITY_PROJECT_ID`, `SANITY_DATASET`.
- Studio: `SANITY_STUDIO_PROJECT_ID`, `SANITY_STUDIO_DATASET`.
- Studio published-page links: `SANITY_STUDIO_PUBLIC_SITE_URL`.
- Optional private-dataset build access: `SANITY_API_READ_TOKEN` (read-only, server/build environment only).

Never put tokens in Studio-prefixed or PUBLIC-prefixed variables, documents, screenshots, source files or Git. `.env` is ignored. Studio bundles only its public identifiers and published-site URL; the public website does not load the Studio or React runtime.

The official `@sanity/astro` integration is configured from the same identifiers as the organised build-time content client. All queries are in `src/lib/sanity/queries.ts`; public reads explicitly use `perspective: published` and `useCdn: false`. Static HTML includes the content and metadata without a browser API call.

### Initial migration

The developer performs this once, after authenticating with Sanity and inspecting the target dataset:

```sh
npx sanity login
npx sanity dataset list
npm run cms:seed
npx sanity dataset import cms-seed.ndjson production --missing
npm run cms:build
npm run cms:deploy
npm run build
```

`cms:seed` only exports the existing approved copy to an ignored NDJSON file. Import with `--missing` so existing document IDs are preserved. It exports twelve documents: Site Settings, Homepage, Industries/process/About, Page headings & enquiry copy, five services including VR Development, and the three approved project summaries. Nothing is imported by this command. It does not create invented articles, testimonials, metrics, client names, collaborators or future service pages.

### Drafts and preview

Choose a document in Studio, edit it and open **Draft content preview** beside the form. It reads the editor's displayed document, including unpublished changes, and authenticated image assets. It shows content, headings, media, FAQs and search appearance without exposing drafts on the public site. **Open published page** opens the current website, which changes only after publication and a successful rebuild. The preview is a content review rather than an exact full-page layout or click-to-edit Presentation overlay. Singleton documents cannot be duplicated, unpublished or deleted through normal Studio actions.

Full page Visual Editing is deferred because this site has no server deployment adapter. It can be added later with authenticated server-rendered preview routes without changing the static public publishing model.

### Publishing and rebuilds

Editors save drafts automatically and use Studio's **Publish** action. Published content reaches the website after a successful hosting build. Configure the hosting platform's secret build-hook URL in **Sanity Manage > Project gr23tee8 > API > Webhooks**:

- Dataset: `production`.
- Trigger: create, update and delete.
- Filter: `_type in ["siteSettings", "homepage", "commercialContent", "marketingCopy", "service", "project", "insight"] && !(_id in path("drafts.**")) && !(_id in path("versions.**"))`.
- Payload projection: `{ "_id": _id, "_type": _type }`.
- Draft events: disabled. Do not trigger rebuilds while typing drafts.
- Destination: the actual host's build-hook URL; keep it out of Git and CMS content. Use webhook signing if the host/receiver supports it. With a custom receiver, verify the signature before accepting requests.
- Worker deploy command: `npx wrangler deploy`. Its configured custom build runs `npm run build` and serves output directory `dist`. Set the build environment variables listed above.

The public destination is the existing Cloudflare Worker **`intelligence-layer-landing-page`**, at https://intelligence-layer-landing-page.connect-d5e.workers.dev/, in the Intelligence Layer business account. `wrangler.jsonc` serves Astro's static `dist` output with trailing slashes and the generated custom 404 page. This does not require an Astro server adapter.

In Workers Builds, use the connected repository `beardydevadventures/intelligence-layer-landing-page`, production branch `main`, build command **None**, deploy command `npx wrangler deploy`, and Node.js 24. Wrangler runs `npm run build` through its committed custom-build configuration before uploading, so the existing dashboard settings are sufficient. Set `SANITY_PROJECT_ID=gr23tee8` and `SANITY_DATASET=production` in the build environment. CMS source changes must reach the connected repository before a hook can build them. For a manual deployment from this checkout, `npm run deploy` builds before uploading.

In the Worker's **Settings > Builds > Deploy Hooks**, create a hook named **Sanity production publishing** targeting the production branch. Store its URL locally as `CLOUDFLARE_DEPLOY_HOOK_URL` in ignored `.env` for setup, then configure it as the Sanity webhook destination. The hook is connected to Sanity as Cloudflare Worker production publishing, with draft and release-version events disabled. Delivery was verified with an unchanged published homepage heading: Cloudflare returned HTTP 200. The CLI login still lacks Workers CI access, so build configuration and build logs are managed through the dashboard. Public production identifiers are also provided in committed .env.production so repository builds read the correct dataset without requiring a secret. [Cloudflare's deploy-hook instructions](https://developers.cloudflare.com/workers/ci-cd/builds/deploy-hooks/) describe the native CMS workflow.

Test by publishing a small change, checking the Sanity delivery log and Workers build log, then confirming the deployed HTML. A failed fetch stops a configured build so Cloudflare can retain the previous deployment. Malformed individual fields are normalised and critical homepage/VR copy has safe baseline defaults. Without project configuration, or before the first migration into a completely empty dataset, the approved baseline content remains available. Once any site documents exist, published project lists are authoritative; removing a project does not resurrect baseline work. Import the complete seed before enabling the build webhook.

Public datasets must contain publication-ready information only. Studio editing remains authenticated, but dataset visibility is a separate Sanity permission setting. Public-site queries never request private client or collaborator names. Use a private dataset and a build-only read token if stored attribution details need to remain confidential at the Content Lake level.

### Create a project

1. Open **Project / Case study**, create a document, enter title and generate a unique slug.
2. Describe Intelligence Layer's actual involvement. Add category, headline, description, technologies and platforms.
3. Upload genuine images with meaningful alternative text. Add optional gallery and captions. Large videos use YouTube, Vimeo or a hosted MP4/WebM URL, with title and optional poster.
4. Associate services. Select projects in Homepage or a Service document to control featured order.
5. Preview, then publish. After rebuilding, the project appears at `/work/{slug}/` and in the work listing. Reference relationships create service links.

Client/collaborator names are not rendered, even if an approval field is set. Future attribution requires explicit approval and a deliberate developer change. No independent studio portfolio work may be presented as Intelligence Layer work. Testimonials are prepared as a schema and are not displayed; future rendering must require `approvedForPublication === true`.

### Create an insight

Create an **Insight / Article** with title, unique slug, excerpt, author and publication date. Use structured paragraphs, H2-H4 headings, lists, links, editorial images, video references and callouts. HTML entry and H1 editing are unavailable. Associate relevant services/projects. Preview and publish; the rebuild creates `/insights/{slug}/`, adds it to the listing and emits Article/Breadcrumb JSON-LD. Empty or invalid articles are not emitted. An empty insights listing is noindex and excluded from the sitemap.

### Services and SEO

New service documents use either the `ai` or `xr` pillar, producing `/{pillar}/{slug}/` after publication/rebuild. The VR route retains its existing layout and baseline answers while using CMS overrides. Services select featured projects; related insights are linked automatically. No future service page is required until it has useful published content.

SEO fields are optional. Titles and descriptions fall back to page content or Site Settings. Social fields inherit page metadata and default imagery. Canonicals are generated from the fixed canonical domain and route; the advanced override should normally stay blank. **EXCLUDE this page from search engines** defaults off. When on, it emits noindex and removes that page from the sitemap. A canonical override pointing elsewhere also removes the source route from the sitemap. Metadata and JSON-LD remain developer-generated and server-rendered.

### Validation

```sh
npm test
npm run build
npm run cms:build
npx sanity schema validate
```

Tests cover malformed content, draft/version exclusion, attribution privacy, image transforms, safe rich text, video providers, relationships and SEO defaults. Studio field validation covers required titles, unique slugs, descriptions, approved URL formats and image alt text. The initial six documents have been imported into production and Studio is deployed. Draft-versus-published isolation is checked using an authenticated temporary draft that is removed after verification. Browser-based save/preview/publish interaction and live project-media upload checks still require an editor session. Browser visual QA and production HTTP 404 handling require the deployed environments.

Sanity CLI transitive dependency patches are scoped in `package.json` overrides. These address the advisories present in the current CLI tree without downgrading Sanity. Re-evaluate/remove overrides when upstream packages include compatible fixes; current `npm audit` reports zero vulnerabilities.
