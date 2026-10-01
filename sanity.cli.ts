import { defineCliConfig } from 'sanity/cli';
export default defineCliConfig({
 api: {projectId: process.env.SANITY_STUDIO_PROJECT_ID || process.env.SANITY_PROJECT_ID, dataset: process.env.SANITY_STUDIO_DATASET || process.env.SANITY_DATASET || 'production'},
 deployment: {appId: 'gbkw0gj0rq2k4db5iv6rjq63'},
});
