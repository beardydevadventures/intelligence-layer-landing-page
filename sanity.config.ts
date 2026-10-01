import { defineConfig } from 'sanity';
import { structureTool } from 'sanity/structure';
import { schemaTypes } from './sanity/schema';
import { ContentPreview } from './sanity/ContentPreview';
const projectId = process.env.SANITY_STUDIO_PROJECT_ID || process.env.SANITY_PROJECT_ID;
if (!projectId) throw new Error('Set SANITY_STUDIO_PROJECT_ID before starting or building Sanity Studio.');
const singletons = new Set(['siteSettings','homepage']);
export default defineConfig({
 name: 'intelligence-layer', title: 'Intelligence Layer Content', projectId,
 dataset: process.env.SANITY_STUDIO_DATASET || process.env.SANITY_DATASET || 'production',
 plugins: [structureTool({
  structure: S => S.list().title('Content').items([
   S.listItem().title('Site settings').id('siteSettings').child(S.document().schemaType('siteSettings').documentId('siteSettings')),
   S.listItem().title('Homepage').id('homepage').child(S.document().schemaType('homepage').documentId('homepage')),
   S.divider(), ...S.documentTypeListItems().filter(item => !singletons.has(item.getId() || '')),
  ]),
  defaultDocumentNode: (S, {schemaType}) => S.document().views(singletons.has(schemaType) || ['project','service','insight'].includes(schemaType) ? [S.view.form(), S.view.component(ContentPreview).title('Draft content preview')] : [S.view.form()]),
 })],
 schema: {types: schemaTypes, templates: templates => templates.filter(t => !singletons.has(t.schemaType))},
 document: {
  actions: (actions, {schemaType}) => singletons.has(schemaType) ? actions.filter(action => !['delete','duplicate','unpublish'].includes(action.action || '')) : actions,
  newDocumentOptions: options => options.filter(option => !singletons.has(option.templateId)),
 },
});
