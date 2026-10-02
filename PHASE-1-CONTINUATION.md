# Phase 1 continuation — 3 October 2026

Branch: `feature/ilw-phase-1-sales-ready`. Work proceeds ILW-9 → ILW-43 → ILW-44 → ILW-45 → ILW-46, with a separate commit and Jira evidence for each ticket. No merge, deployment, production CMS activation, DNS change or publication on Guy's behalf is authorised.

## ILW-9 — remaining editable content

Added **Page headings & enquiry copy**, a protected singleton with four editor groups: homepage sections, service/industry/About page headings, project enquiry, and process/calls to action. It covers the remaining meaningful marketing copy across the homepage, listing pages, About, service templates, shared CTAs and enquiry/confirmation page. Heading line breaks preserve the existing design. Industry links now use edited service names rather than hardcoded baseline names.

Existing Homepage, Services, Industries/process/About, Projects and Site Settings documents continue to work. Missing, blank or malformed new fields use typed defaults. Field limits and explanatory default text keep the editor understandable. Draft preview displays effective values including fallback text. The local migration now exports twelve documents; `--missing` leaves existing documents intact. README explains the extended published-only webhook filter.

Verification: 21 tests pass; Astro checks have zero errors/warnings/hints; the real published-data production build and all 16 generated-page checks pass; Studio builds; schema validation has zero errors/warnings; local seed export succeeds. No standalone lint script exists. Existing deferred Three.js chunk warning remains.

Limitation: browser inventory has no browser, so Studio interaction and frontend visual rendering could not be exercised. No new schema or documents were activated in production. Guy has not personally completed an acceptance test, and new content publish/rebuild timing is not verified. ILW-9 remains In Progress until those acceptance steps are performed after separate release authorisation.

## ILW-43 — HubSpot connection

Inspected the full Jira acceptance criteria and existing submission adapter. No mock success path is used in the website; tests alone use stub responses. Local production-mode configuration inspection confirms both portal/form identifiers are absent, and HubSpot remains unconnected. Existing validation, pending state, accepted-response success, retained-input error behaviour and email fallback remain intact. The three focused enquiry tests pass.

Added `HUBSPOT-SETUP.md` with exact field mapping, owner inputs, safe environment setup and CRM/notification evidence requirements. Actual configuration, lead receipt and notification verification are blocked on external input. ILW-43 remains open; no test lead, production change or deployment was made.

## ILW-44 — focused QA

Added `QA-PHASE-1.md` with executed static/source coverage and an explicit untested browser/device matrix. Fixed listing card heading levels, no-JavaScript mobile header flow and misleading live-update wording on illustrative venture mockups. Expanded generated-page checks for language/landmarks, accessible form labels, iframe titles and positive tabindex. The 21 tests, production build and all 16 generated-page checks pass; diff checks pass. Actual browser/device, keyboard/screen-reader, WebGL/reduced-motion and Lighthouse measurements remain unavailable. ILW-44 stays In Progress; no cross-browser or measured performance claim is made.

## ILW-45 - measurement preparation

Prepared a single optional GA4 collector behind a validated ID, canonical-origin guard and visitor opt-in. Events cover one page view per document, CTA clicks and accepted enquiry success, with consent gating, duplicate-success protection and URL/form-data minimisation. No configured property means no collector activation. Added account configuration and verification instructions in MEASUREMENT.md, including Enhanced measurement suppression and Search Console URL-prefix verification without DNS changes.

Verification: 23 local tests pass, Astro checks have zero diagnostics, production build and all 16 generated-page SEO/accessibility checks pass. These are local evidence, not GA4 receipt or Google ownership verification. Property choice/ID, Search Console token, real DebugView/network evidence, sitemap submission and live-domain checks remain owner/external steps. No production configuration was changed. ILW-45 remains In Progress.
