# Measurement setup and verification

Prepared for ILW-45; not activated or verified in production. GA4 is the proposed collector, pending Matthew's property/provider confirmation. No measurement ID or Search Console token is configured locally.

## Configuration for an authorised release

Supply `PUBLIC_GA4_MEASUREMENT_ID=G-...` from the approved GA4 web stream. It is a public identifier, not an API secret. The component only runs on the canonical origin `https://intelligencelayer.com.au`; previews and localhost do not send events. An absent or invalid ID leaves measurement inactive and hides the preferences controls.

This is a basic opt-in implementation: no Google tag is loaded before consent. Visitors can keep analytics off or change their choice using Analytics preferences. Consent is stored locally; denial after activation disables collection and reloads to unload the tag. Existing analytics cookies may persist until expiry; withdrawal is not a deletion of prior data. If storage is unavailable the choice lasts for the current page only. Review the site's privacy wording before activation.

One collector owns these events:

| Event | Trigger | Counting |
| --- | --- | --- |
| `page_view` | First analytics opt-in or saved opt-in on a page | Once per document |
| `start_project_click` | Same-origin link to `/start-a-project/` | Each click; duplicate dispatch of the identical event is ignored |
| `project_enquiry_success` | HubSpot accepts the form submission | Once per document; errors do not count |

Payloads contain the event name and cleaned page URL only; page views also send a cleaned referrer. Query strings, fragments and form fields are omitted. No pre-consent events are replayed. Advertising consent is denied, Google signals/ad personalisation are disabled. Do not claim anonymous collection; the provider receives network metadata and may set analytics cookies after opt-in.

Disable **Enhanced measurement** on the GA4 stream to prevent automatic form/history/page-view events and unintended URL data. Do not install a second GA4/GTM collector. Mark `project_enquiry_success` as a key event in GA4. CTA clicks are a secondary intent measure, not leads.

Account-side acceptance, after separate release permission: inspect network requests with denied consent (none to Google); opt in (one page view); click one CTA (one click); submit an accepted HubSpot test lead (one success); test failed submission (no success); withdraw consent (future events stop). Record browser, date, property ID, DebugView/Realtime evidence and CRM correlation in Jira. Repeat on an authorised preview with a separately configured test property/origin if needed; do not bypass the canonical guard against the production property for local tests.

## Search Console

Use the URL-prefix property `https://intelligencelayer.com.au/` with HTML meta-tag verification, unless an existing verified property is available. Supply only the tag's content token as `PUBLIC_GOOGLE_SITE_VERIFICATION`. Domain-property verification requires DNS and is outside this task's authorisation. The owner must log in and verify after the token is present on the authorised public release, then submit `https://intelligencelayer.com.au/sitemap.xml` and record the accepted sitemap status and URL inspection evidence. Do not claim that generating the file connects Search Console.

Local checks cover canonical tags, metadata, robots, sitemap exclusions and generated page indexability. Live redirects, public-domain ownership, Search Console coverage and Google's indexing remain unverified.

References: [Google basic consent mode](https://developers.google.com/tag-platform/security/concepts/consent-mode), [manual page views](https://developers.google.com/analytics/devguides/collection/ga4/views), [Search Console ownership verification](https://support.google.com/webmasters/answer/9008080).
