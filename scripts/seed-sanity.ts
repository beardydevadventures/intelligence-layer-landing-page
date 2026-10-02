import {writeFile} from 'node:fs/promises';
import {defaultHomepage, defaultSettings, defaultVrService} from '../src/lib/sanity/defaults';
import {projects} from '../src/data/projects';
import {coreServices,industries,processSteps,aboutCopy} from '../src/data/commercial';
const array = <T extends object>(values: T[], type: string) => values.map((v,i) => ({_type:type, _key:`item-${i}`, ...v}));
const references = (ids: string[]) => ids.map((id,i) => ({_type:'reference', _key:`ref-${i}`, _ref:id}));
const {id: serviceId, ...vrFields} = defaultVrService;
const documents = [
 {_id:'commercialContent',_type:'commercialContent',industries:array(industries,'industry'),processSteps:array(processSteps,'contentItem'),aboutTitle:aboutCopy.title,aboutIntroduction:aboutCopy.introduction,aboutDelivery:aboutCopy.delivery,aboutEvidence:aboutCopy.evidence,team:array([{name:'Matthew Aisthorpe',approvedForPublication:true},{name:'Guy',approvedForPublication:true}],'teamMember')},
 ...coreServices.map(({id,...service})=>({_id:id,_type:'service',...service,slug:{_type:'slug',current:service.slug},useCases:array(service.useCases,'contentItem'),capabilities:array(service.capabilities,'contentItem'),faqs:array(service.faqs,'faq')})),
 {_id:'siteSettings', _type:'siteSettings', ...defaultSettings},
 {_id:'homepage', _type:'homepage', ...defaultHomepage, featuredProjects:references(projects.filter(p => p.featured).map(p => `project-${p.slug}`)), xrCategories:array(defaultHomepage.xrCategories,'contentItem'), outcomes:array(defaultHomepage.outcomes,'contentItem'), ventures:array(defaultHomepage.ventures,'contentItem')},
 {_id:serviceId, _type:'service', ...vrFields, slug:{_type:'slug',current:defaultVrService.slug}, capabilities:array(defaultVrService.capabilities,'contentItem'), useCases:array(defaultVrService.useCases,'contentItem'), faqs:array(defaultVrService.faqs,'faq'), featuredProjects:references(['project-diamond-easy','project-brisbane-digital-twin'])},
 ...projects.map(p => ({_id:`project-${p.slug}`, _type:'project', title:p.title, slug:{_type:'slug',current:p.slug}, category:p.category, headline:p.headline, shortDescription:p.description, tags:p.tags, featured:p.featured, technologies:p.technologies, platforms:p.platform, attributionNote:p.note, projectType:p.slug === 'brisbane-digital-twin' ? 'Independent concept' : 'Product', showClientName:false, showCollaborators:false, ...(p.platform.includes('VR') || p.platform.includes('Meta Quest') ? {services:references([defaultVrService.id])} : {})})),
];
await writeFile('cms-seed.ndjson',documents.map(doc => JSON.stringify(doc)).join('\n')+'\n');
console.log(`Exported ${documents.length} existing-content documents to cms-seed.ndjson. This command does not write to Sanity.`);
