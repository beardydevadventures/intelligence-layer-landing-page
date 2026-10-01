// Project identifiers are public configuration. Tokens never belong here or in Studio.
export const apiVersion = '2026-10-01';
export function cmsConfig(env: Record<string, string | undefined>) {
 const projectId = env.SANITY_PROJECT_ID || env.SANITY_STUDIO_PROJECT_ID || '';
 const dataset = env.SANITY_DATASET || env.SANITY_STUDIO_DATASET || 'production';
 return { projectId, dataset, apiVersion, useCdn: false, perspective: 'published' as const };
}
