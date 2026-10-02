# ILW-44 — Phase 1 QA evidence

## Executed coverage

Windows checkout, Node.js 24, local build using the existing published Sanity dataset. No production mutation. Browser inventory returns no apps or browsers; no screenshots, keyboard interaction, Lighthouse, screen-reader session or WebGL runtime measurements were obtained.

- 21 automated tests pass, including content safeguards, marketing fallback/override behaviour and enquiry payload/accepted-response/rejection/offline handling.
- Production build passes Astro checks with zero errors, warnings or hints.
- All 16 generated pages pass document language, main landmark, H1, form accessible-label, image alt, iframe title, positive-tabindex, unique-ID, link/anchor, metadata/schema and sitemap checks. These static checks are not a substitute for a screen reader or browser audit.
- Source review: skip links, named navigation, menu expanded state/Escape focus return, labelled form controls, focus outlines, retained input on failure, focus transfer on confirmation, static mobile/reduced-motion scene, motion-setting change listeners, page lifecycle cleanup, tab visibility/intersection pause and context-loss fallback.
- Existing Three.js warning: deferred scene is about 524 kB minified / 131 kB gzip. Main copy and CTAs are server-rendered; mobile/reduced-motion paths do not import the scene. No Core Web Vitals score has been measured.

## Small issues corrected

1. Work listing project cards jumped from H1 to H3. Cards now accept heading level 2 on the listing while retaining H3 under homepage/service H2 sections, with identical card typography.
2. No-JavaScript mobile navigation could obscure content because its expanded header remained fixed. It now participates in layout when JavaScript is absent; the JavaScript mobile menu remains fixed.
3. Existing venture mockups displayed “Updated just now” beside illustrative metrics. They now visibly identify the interface as sample data, preventing a live-data or business-results implication.

## Required browser matrix — not yet executed

| Browser/device | Viewports | Required checks | Result |
| --- | --- | --- | --- |
| Chrome desktop | 1440 × 900, 1024 × 768 | All commercial routes, navigation, keyboard, form states, animated hero | Not tested; no browser exposed |
| Edge desktop | 1440 × 900 | Same critical flows, WebGL fallback | Not tested; no browser exposed |
| Tablet | 768 × 1024 | Menu, layout, touch targets, hero fit | Not tested; no browser exposed |
| Mobile Chrome/Edge | 390 × 844, 320 × 568 | No overflow, menu, form, static mark, text zoom | Not tested; no browser exposed |
| Safari/macOS or iOS | Desktop and mobile where practical | Layout, form validation, fallback, reduced motion | Not tested; unavailable |

For each available configuration, test Tab/Shift+Tab/Enter/Escape, focus order/visibility, 200% zoom, missing fields/invalid email/Phone preference, rejected/offline/success submissions (with a staging mock for UI-only checks), no-JavaScript email/navigation access and Start a Project links. Confirm reduced motion both at load and after changing the preference, unsupported WebGL/context loss, resize, tab hiding and offscreen pause. Use Lighthouse and real-device measurements to identify regressions; distinguish lab scores from field Core Web Vitals.

Record substantive defects in separate Jira issues. Existing missing HubSpot configuration and measurement/CMS activation are tracked by ILW-43/45/46. ILW-44 remains In Progress until actual device/browser flow and hero checks are recorded.
