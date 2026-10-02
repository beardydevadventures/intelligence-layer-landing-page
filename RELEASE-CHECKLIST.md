# Phase 1 release readiness

Prepared 3 October 2026 on `feature/ilw-phase-1-sales-ready`. **Not release-approved.** No merge, deployment, production CMS activation, DNS change or publication on Guy's behalf was performed. Matthew must separately authorise the release actions after the remaining acceptance evidence is reviewed.

## Current evidence and blockers

| Area | Local preparation/evidence | Outstanding release acceptance |
| --- | --- | --- |
| Commercial website | Sitemap, four offers, seven sectors, six-step process, About and enquiry journey implemented; prior ILW-2/4/5/6 Done | Visual acceptance for homepage/hero; real enquiry destination |
| CMS | Typed defaults/projections, protected singletons, schema/build pass; twelve-document local export | Activate reviewed schema/missing documents only when authorised; Guy independent test (access confirmed by Matthew) |
| Enquiry | Real HubSpot adapter, accepted-response-only success, error/input retention and email fallback; local tests | Portal/form IDs, exact consent/CAPTCHA settings, correct CRM record and notification recipient proof |
| Measurement | Optional opt-in GA4 collector and event tests; meta verification support | Approved GA4 ID configured; actual request/receipt checks, Enhanced measurement settings and sitemap acceptance pending (Search Console URL property verified per Matthew) |
| QA | 23 tests and generated-page checks; QA-PHASE-1.md matrix | Actual browser/device, keyboard/screen-reader, reduced-motion/WebGL and measured performance |
| Publishing | Published-only read model; existing host/static build configuration reviewed | New content types in production hook; actual Guy publish → rebuild → public HTML timing |

ILW-9/43/44/45/46 remain In Progress. Original ILW-3/7/8/11 and epic ILW-1 also remain open for corresponding acceptance gaps. Jira comments distinguish executed checks from unverified external steps.

## CMS configuration review

Published content was read successfully from existing project `gr23tee8`, dataset `production`, for the feature build. Studio build and schema validation prove local configuration/schema consistency, not membership or installed production schema. The local seed includes four singletons, five services and three projects. Never replace existing documents blindly; the documented future import must use `--missing` after review, preserving IDs and editor changes.

The future published-only webhook filter must cover `siteSettings`, `homepage`, `commercialContent`, `marketingCopy`, `service`, `project` and `insight`, excluding `drafts.**` and `versions.**`. The currently deployed hook/schema were not modified or reverified in this continuation. A previous unchanged-homepage delivery described in README does not verify these new types or Guy's workflow.

Build settings should align `SANITY_PROJECT_ID`/`SANITY_STUDIO_PROJECT_ID`, dataset names and the canonical Studio public-site URL. Keep read tokens and deploy-hook URLs in protected environments, never `PUBLIC_` variables or CMS content. HubSpot portal/form IDs, GA4 ID and Search Console verification token are public identifiers; no HubSpot API token is needed for the current form endpoint. Check the actual custom domain/redirects/TLS before release; local canonicals are not evidence of a live domain.

## Authorised release sequence and recovery

1. Resolve owner inputs in HUBSPOT-SETUP.md and MEASUREMENT.md; complete the available browser QA matrix. Review content and privacy wording, with no invented credibility claims.
2. Review branch/diff/commits and rerun the full suite below. Obtain explicit release authorisation before activating Studio/documents/hook or merging/deploying.
3. Record the current website and Studio deployment identifiers, webhook filter and content snapshot. Plan matching schema/content compatibility before activation; do not expose new production content to an incompatible old build.
4. Perform only the approved activation/merge/deploy steps, checking build logs and published-data reads. Have Guy perform the agreed handover test. Verify public pages, lead receipt/notification and analytics independently.
5. Owner verifies Search Console and submits sitemap after the public verification tag is present. Attach real evidence to the affected tickets; mark Done only when all criteria pass.
6. If release fails, restore the last known-good host deployment. Restore Studio/config only from recorded versions, and revert the specific content field from its recorded original when needed. Do not assume website rollback undoes Sanity content, HubSpot settings or analytics. Keep the feature branch and evidence for investigation.

## Validation commands

`npm test`, `npm run build` (includes Astro type/static checks), `npm run validate:site`, `npm run cms:build`, `npx sanity schema validate`, `npm run cms:seed` (local export only), `git diff --check`.

No standalone lint script exists. A passing suite does not replace manual acceptance. The deferred Three.js chunk still exceeds Vite's 500 kB advisory; mobile/reduced-motion fallbacks are implemented, but performance must be measured before signing off ILW-8/44. No Lighthouse or Core Web Vitals result is claimed.
