import { createClient } from '@sanity/client';
import { cmsConfig } from '../../../sanity.shared';
import { normalizeContent } from './normalize';
import { siteQuery } from './queries';
import {list, record} from './helpers';
import type { SiteContent } from './types';
let snapshot: Promise<SiteContent> | undefined;
async function loadContent(): Promise<SiteContent> {
  const config = cmsConfig({SANITY_PROJECT_ID: import.meta.env.SANITY_PROJECT_ID, SANITY_DATASET: import.meta.env.SANITY_DATASET});
  if (!config.projectId) return normalizeContent({}, false);
  // Build-only module. Published perspective is explicit even when a read token is set.
  const client = createClient({...config, token: import.meta.env.SANITY_API_READ_TOKEN || undefined, timeout: 15000, maxRetries: 2});
  try {
   const data = record(await client.fetch<unknown>(siteQuery));
   if (!data.settings && !data.homepage && !['projects','services','insights'].some(key => list(data[key]).length)) {
    console.warn('Sanity dataset has no site content yet. Using the approved baseline until the initial migration is imported.');
    return normalizeContent({}, false);
   }
   return normalizeContent(data, true);
  }
  catch { throw new Error('Sanity content fetch failed. Check project/dataset, build access and network. The previous deployment should remain active; this build will not publish stale fallback content.'); }
}
export function getContent(): Promise<SiteContent> {
 return import.meta.env.DEV ? loadContent() : snapshot ??= loadContent();
}
