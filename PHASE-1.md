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

- ILW-7: real enquiry delivery endpoint/provider and its data handling policy. Never report an enquiry as received without a successful delivery response.
- ILW-9: Guy's editor membership and independent editing verification; production rebuild timing cannot be re-tested without a production publish/deploy, which is excluded from this task.
- ILW-11: approved analytics property/provider, Search Console access/verification, and conversion collection destination.
- About: approved individual biographies are not supplied. Existing delivery statements provide factual credibility; optional team content must remain empty until supplied.

No production deployment, CMS publication, or merge is part of this implementation.
