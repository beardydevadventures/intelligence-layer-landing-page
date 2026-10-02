import {getContent} from './content';
// Access the same cached published snapshot as the existing site.
export async function getCommercialContent() {return (await getContent()).commercial;}
