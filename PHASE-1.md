# ILW-1 implementation and acceptance record

## Information architecture (ILW-2)

| Page | Purpose | v1 decision |
| --- | --- | --- |
| Home | Explain offering, sectors, delivery and evidence; lead to enquiry | `/` |
| Services | Compare four outcome-led offers | `/services/` |
| Service detail | Explain problem, deliverables, outcomes, use cases and next step | Existing `/xr/vr-development/` retained; AI automation, enterprise agents, immersive experiences and digital twins use existing AI/XR route convention |
| Industries | Explain seven sectors with distinct problems and mapped services | `/industries/`; dedicated sector routes deferred until evidence warrants them |
| Work | Show existing approved work and project context | `/work/` and existing detail pages |
| About | Explain delivery responsibility and location without invented biographies | `/about/` |
| Start a Project | Qualify an enquiry and explain the next step | `/start-a-project/` |
| Insights | Published editorial content | Existing routes retained |

Header: Services, Industries, Work, About, Start a project. Footer repeats commercial navigation and contact email. Existing service URLs remain valid rather than changing indexed routes merely to match an example URL.

## Dependencies and execution

ILW-2 establishes routes. ILW-4/5/6 supply content for ILW-3. ILW-7 uses service categories. ILW-8 follows final hero layout. ILW-9 extends the existing CMS to the final content model. ILW-10 follows all routes and content. ILW-11 reviews everything.

Order: ILW-2, ILW-4, ILW-5, ILW-6, ILW-3, ILW-7, ILW-8, ILW-9, ILW-10, ILW-11.

## Decisions requiring business input

- ILW-7: HubSpot is the selected provider. Portal ID, form ID, accepted fields, consent/spam settings and a verified CRM receipt remain outstanding. Never report an enquiry as received without a successful delivery response.
- ILW-9: Guy's editor membership and independent editing verification; production rebuild timing cannot be re-tested without a production publish/deploy, which is excluded from this task.
- ILW-11: approved analytics property/provider, Search Console access/verification, and conversion collection destination.
- About: Matthew and Guy are named per the user's instruction. No roles, biographies, photographs or credentials have been invented; approved additions can be made in the CMS.

No production deployment, CMS publication, or merge is part of this implementation.

## Final review — 3 October 2026

| Ticket | Implementation and acceptance | Jira disposition |
| --- | --- | --- |
| ILW-2 | Page purposes, service/industry page decisions and navigation hierarchy documented; routes implemented | Done |
| ILW-3 | Homepage follows hero, services, sectors, process, work, credibility and final enquiry CTA; ventures preserved; final copy supplied | In Progress: desktop/mobile visual acceptance remains |
| ILW-4 | Four core offerings have problems, delivery, potential outcomes, use cases, buyer questions and project CTA; existing VR page preserved | Done |
| ILW-5 | Seven distinct sectors explain relevant challenges and mapped services; no past engagement claims | Done |
| ILW-6 | Discover, Define, Prototype, Build, Deploy, Improve are explained in a responsive numbered visual sequence with a following CTA | Done |
| ILW-7 | Accessible enquiry page, qualification form, validation, retained-input error state, accepted-response confirmation and email fallback implemented | In Progress: HubSpot configuration and receipt test |
| ILW-8 | Approved SVG drives hovering 3D layers; dark hero, smaller mark, capped pixel ratio, visibility pause and adaptive static fallbacks implemented | In Progress: visual and device performance acceptance |
| ILW-9 | CMS schema, published projection, normalisation, draft preview and local migration extended to sectors, process, About and team | In Progress: activation and independent editor/rebuild verification |
| ILW-10 | Commercial routes, unique metadata, single H1, canonical URLs, internal links, Service/Organization schema, FAQs, social thumbnail, robots and sitemap verified | Done |
| ILW-11 | Generated-page regression checks added; duplicate Wrangler build key fixed; release gate documented | In Progress: external and visual launch checks |

### Validation evidence

- `npm test`: 19 tests pass, covering CMS safeguards, commercial edits and HubSpot success/failure behaviour using stub responses.
- `npm run build`: succeeds using the real published Sanity snapshot; Astro checks 53 files with zero errors, warnings or hints and emits 16 HTML pages plus sitemap. Vite reports the deferred Three.js scene chunk over 500 kB (524,067 bytes minified; approximately 131 kB gzip). Mobile/reduced-motion paths avoid loading it. No measured Core Web Vitals claim is made.
- `npm run validate:site`: all 16 HTML pages pass unique titles, descriptions, H1 count, parseable Organization/Service JSON-LD, social metadata, local links/assets, fragment IDs and sitemap/indexing checks.
- `npm run cms:build`: succeeds. `npx sanity schema validate`: zero errors and warnings.
- `npm run cms:seed`: creates eleven local documents; nothing imported or published.
- `git diff --check`: passes. No standalone lint command exists; Astro's checks are the project's configured type/static checks.
- Source review covers desktop grids, tablet breakpoints, single-column mobile content/forms, menu semantics, keyboard focus, skip links, decorative canvas, reduced-motion and no-JavaScript navigation/email access.
- Browser inventory returns no available browser. Desktop/tablet/mobile rendering, actual WebGL behaviour, keyboard/screen-reader interaction, social crawler rendering and measured performance remain unverified. ILW-3/8/11 stay open for those acceptance checks.

### Release gate and follow-up

1. Review at 1440, 1024, 768, 390 and 320 CSS pixels; test mobile menu, tab order, form validation, reduced-motion changes and WebGL unavailable/context loss. Measure performance on an ordinary mobile device and desktop.
2. Connect HubSpot or supply the public portal/form identifiers. Verify field/consent/spam settings, a successful CRM receipt, lead-owner notification, rejected submission and offline behaviour. Do not enable a form merely because identifiers are syntactically valid.
3. After release authorisation, activate the new Studio schema and missing CMS documents, extend the published-only webhook, and have Guy verify draft/preview/publish and actual rebuild timing.
4. Select an analytics property/provider and consent approach; connect the PII-free click and confirmed-enquiry events and verify collection. Supply Search Console verification and submit the sitemap after release.
5. Add approved team roles/biographies and genuine project captures when available. The default social thumbnail is the existing mark; a dedicated sharing card is a useful future improvement.

ILW-1 remains open: the branch materially improves commercial understanding and the sales journey, but a live conversion, independent publishing and measurable launch readiness have not been verified. No merge, production deploy or published CMS mutation was performed.
