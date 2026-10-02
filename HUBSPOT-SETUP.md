# ILW-43 — HubSpot enquiry setup and evidence

## Current state

The website has a real HubSpot Forms submission adapter, not a mock success path. `src/lib/enquiry.ts` posts to the configured HubSpot form; only an accepted HTTP response leads to confirmation. The three tests use stub responses exclusively. No real lead or notification has been verified.

The current environment has no HubSpot connector, portal ID or form ID. The website therefore disables online submission and offers the existing contact email. Do not mark ILW-43 Done until the real receipt and notification evidence below is recorded.

## Required owner input

- Public account/portal ID and form ID, available in the form's embed code.
- Correct form destination and CRM owner/location.
- Internal notification recipients.
- Form consent, CAPTCHA and spam settings. Any requirement must be implemented rather than bypassed. The current custom form does not implement a CAPTCHA or marketing consent.

No private API key is required by the browser submission adapter. Do not add a HubSpot token to a `PUBLIC_` variable, Sanity document or Git.

## Configuration after owner review

Matthew confirmed on 3 October 2026 that this must reuse the **Cybersecurity Check** form. Its sibling repository has embed support, but no configured portal/form IDs in its local files; its deployment reads GitHub variables. Obtain the live form URL/embed or approved deployment variables. Do not create a replacement form. Check compatibility before enabling: the reused form must accept contact properties `firstname`, `lastname`, `company`, `email`, optional `phone`, and `message`. First name, company and email are collected as required fields. Last name is omitted for a single-word name. Service, problem, budget, timeline and preferred contact method are combined in `message`. Check the actual form's required fields against this mapping before enabling it.

Set `PUBLIC_HUBSPOT_PORTAL_ID` and `PUBLIC_HUBSPOT_FORM_ID` in an ignored local/staging environment first. The identifiers are public configuration; no secret is exposed. Verify origin/CORS behaviour in a browser. Configure the actual recipients and CRM routing in HubSpot only when the permitted reversible configuration is understood. Irreversible production configuration changes and site deployment remain prohibited.

## Acceptance evidence to record in Jira

1. Submit a clearly labelled test enquiry from local/staging with an authorised test email.
2. Record timestamp, tested origin, form ID and the resulting CRM record location/identifier. Avoid placing private lead details in Jira.
3. Verify organisation and full qualification message arrived, including optional phone where supplied.
4. Verify the intended internal recipient actually received the notification; a configured rule alone is insufficient.
5. Test missing required fields, invalid email, Phone preference without a number, HTTP rejection, rate limit, network failure and retry. Confirm input remains available after failure and confirmation appears only after acceptance.
6. Confirm the success conversion event fires once for the accepted submission, and that no marketing subscription is created by this enquiry payload.

Never present a stub test or HTTP response alone as verified CRM delivery. Do not merge or deploy to complete this test without separate release authorisation.
