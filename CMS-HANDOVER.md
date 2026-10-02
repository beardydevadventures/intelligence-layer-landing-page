# Guy's content editing handover

Preparation for ILW-46. Matthew confirmed on 3 October 2026 that Guy has access. Independent edit/preview/publish acceptance has not yet been performed. This branch's new schema has not been activated in production. A real publish can trigger the existing production build hook, so the acceptance exercise requires separate release authorisation. Do not perform it against the current live Studio before that approval.

## Where to edit

| Studio document | Content |
| --- | --- |
| Homepage | Hero, AI/XR introductions, categories, outcomes, featured work, ventures and final CTA |
| Page headings & enquiry copy | Homepage section headings, listing/About headings, shared button labels, enquiry instructions, confirmation and fallback copy |
| Industries, process & About | Sector challenges/service mappings, six process steps, About copy, Matthew/Guy names and approved optional biographies |
| Service | Individual service offering, use cases, capabilities, FAQs, featured projects and SEO |
| Project / Case study | Approved project copy, media and related services |
| Insight / Article | Meaningful articles, author, dates, media and relationships |
| Site settings | Company/contact/location, shared contact copy, social links, default SEO and sharing image |

Marketing words are editable; layout, navigation routes, structured data generation, animation, form field names, validation/error states, analytics controls and technical configuration remain developer-managed. Blank optional fields fall back to the approved baseline. Team roles/biographies must be approved; no credentials or client claims should be inferred. Client/collaborator names and testimonials are not displayed by this release.

## Edit → preview → publish

1. Sign in with your own Sanity account to the approved Studio/environment; confirm project `gr23tee8` and intended dataset with Matthew. Production uses `production`.
2. Choose the document above. Edit one agreed field. Changes are saved as a **draft** automatically; they do not immediately change the public website. Read field descriptions and validation messages. Do not change an existing slug casually because that changes its URL.
3. Open **Draft content preview** beside the form. Review words, headings, image alt text, FAQs and search appearance. This is a content preview, not an exact full website layout. For Page headings & enquiry copy, it displays effective default values when fields are blank.
4. **Open published page** opens the current website, not the draft. If you need layout approval, request a developer preview build before publication.
5. When approved for this environment, choose **Publish**. Publication updates Sanity; the website updates only after the host rebuild succeeds. Do not expect an immediate public change or repeatedly republish to force it.
6. Matthew checks the webhook delivery and host build. After successful completion, refresh the public page and confirm the exact text. On failure, retain the last website deployment and investigate; do not delete content or credentials as a workaround.

## Acceptance exercise (pending)

Matthew chooses a harmless existing text field and records the original and approved new wording. Guy independently signs in, edits it, confirms draft preview and publishes only when authorised. Record the following in ILW-46:

- Guy's account/access confirmed (no passwords or tokens).
- Field/document, original text and approved change; draft remains absent from the published website before publication.
- Draft preview screenshot and Guy's confirmation that he can repeat the workflow unaided.
- Publication time, webhook delivery status, host build URL/status and completion time.
- Public URL and observed text after rebuild; measured elapsed time rather than an assumed SLA.
- If a temporary exercise change is restored, use the same authorised publish/rebuild flow and record the result.

Nothing above has been signed off by Guy yet. A separate isolated dataset/host may be used for an authorised test without activating production; that environment still needs its own schema, IDs and build hook.
