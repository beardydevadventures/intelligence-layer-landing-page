import test from 'node:test';
import assert from 'node:assert/strict';
import {normalizeContent} from '../src/lib/sanity/normalize';
import {editorialImage,portableText,safeUrl,video} from '../src/lib/sanity/helpers';
import {renderRichText} from '../src/lib/sanity/rich-text';
import {pageSeo} from '../src/lib/sanity/seo';
import {siteQuery} from '../src/lib/sanity/queries';
import {defaultMarketingCopy,marketingKeys} from '../src/data/marketing';
const project = {_id:'project-one',_type:'project',slug:'one',title:'Real project',shortDescription:'Approved involvement.',featured:true,platforms:['Meta Quest']};
const image = {alt:'Spatial crafting interface',caption:'Real project capture',asset:{url:'https://cdn.sanity.io/images/gr23tee8/production/example-1600x900.png',metadata:{dimensions:{width:1600,height:900}}}};
const paragraph = {_type:'block',_key:'p',style:'normal',children:[{_type:'span',_key:'s',text:'Useful article content',marks:[]}],markDefs:[]};
test('offline baseline does not resurrect retired projects or founder names', () => {
 const result=normalizeContent({},false); assert.equal(result.projects.length,0); assert.equal(result.services[0].headline,'Custom Virtual Reality Development'); assert.equal(result.homepage.featuredProjects.length,0); assert.deepEqual(result.commercial.team,[]); assert.doesNotMatch(JSON.stringify(result),/Diamond Easy|Brisbane 2032|Matthew Aisthorpe/);
});
test('configured content is authoritative and does not republish removed projects', () => {
 const result=normalizeContent({},true); assert.equal(result.projects.length,0); assert.equal(result.homepage.featuredProjects.length,0); assert.equal(result.services[0].slug,'vr-development');
});
test('drafts, release versions, invalid slugs and duplicate paths never become public pages', () => {
 const result=normalizeContent({projects:[project,{...project,_id:'drafts.two',slug:'two'},{...project,_id:'versions.release.three',slug:'three'},{...project,slug:'../admin'},project]},true);
 assert.equal(result.projects.length,1); assert.equal(result.projects[0].href,'/work/one/');
});
test('malformed CMS fields preserve primary page content and usable contact links', () => {
 const result=normalizeContent({settings:{contactEmail:'x\nBcc:other@example.com'},homepage:{heroHeading:null,primaryCtaDestination:'javascript:alert(1)'},services:[{_id:'vr',slug:'vr-development',category:'xr',title:null,introduction:[],headline:{},useCases:[null],faqs:[{}]}]},true);
 assert.equal(result.homepage.primaryCtaDestination,'#contact'); assert.ok(result.homepage.heroHeading); assert.equal(result.settings.contactEmail,'connect@intelligencelayer.com.au'); assert.ok(result.services[0].introduction); assert.ok(result.services[0].headline); assert.ok(result.services[0].faqs.length);
});
test('unapproved attribution and testimonials never reach public content objects', () => {
 const result=normalizeContent({projects:[{...project,clientName:'Private Client',showClientName:true,collaborators:['Private Studio'],showCollaborators:true}],testimonials:[{quote:'Unapproved',approvedForPublication:false}]},true);
 assert.doesNotMatch(JSON.stringify(result),/Private Client|Private Studio|Unapproved/);
 assert.doesNotMatch(siteQuery,/clientName|collaborators|testimonial/);
});
test('featured relationships preserve editor order and discard missing references', () => {
 const result=normalizeContent({projects:[project,{...project,_id:'project-two',slug:'two'}],homepage:{featuredProjectIds:['project-two','missing','project-one']},services:[{slug:'vr-development',category:'xr',featuredProjectIds:['project-one']}]},true);
 assert.deepEqual(result.homepage.featuredProjects.map(p=>p.slug),['two','one']); assert.equal(result.services[0].featuredProjects[0].slug,'one');
});
test('topic links only target published, valid pages', () => {
 const result=normalizeContent({projects:[{...project,related:[{_type:'service',slug:'vr-development',category:'xr',title:'VR Development'},{_type:'insight',slug:'missing',title:'Missing'}]}]},true);
 assert.deepEqual(result.projects[0].related,[{title:'VR Development',href:'/xr/vr-development/'}]);
});
test('editorial images require alt text and dimensions and include responsive CDN transforms', () => {
 const result=editorialImage(image)!; assert.match(result.src,/w=1600/); assert.match(result.src,/auto=format/); assert.match(result.srcset,/480w/); assert.equal(result.width,1600); assert.equal(result.height,900); assert.equal(editorialImage({...image,alt:''}),undefined); assert.equal(editorialImage({...image,asset:{url:'javascript:alert(1)'}}),undefined);
});
test('Portable Text safely renders HTML-looking text and rejects arbitrary HTML, H1 and unsafe links', () => {
 const blocks=portableText([{...paragraph,style:'h1',children:[{_type:'span',text:'<script>alert(1)</script>',marks:['bad']}],markDefs:[{_type:'link',_key:'bad',href:'javascript:alert(1)'}]},{_type:'rawHtml',html:'<iframe />'},{_type:'callout',title:'<img onerror=x>',text:'<b>Safe text</b>'}]);
 const html=renderRichText(blocks); assert.doesNotMatch(html,/<script|<iframe|<h1|javascript:|<img onerror/); assert.match(html,/&lt;script&gt;/); assert.match(html,/&lt;b&gt;/);
});
test('video playback is restricted to supported providers and hosted video files', () => {
 assert.equal(video({provider:'youtube',url:'https://www.youtube.com/watch?v=dQw4w9WgXcQ',title:'Project demonstration'})?.embedUrl,'https://www.youtube-nocookie.com/embed/dQw4w9WgXcQ');
 assert.equal(video({provider:'vimeo',url:'https://evil.example/123',title:'Video'}),undefined);
 assert.equal(video({provider:'file',url:'https://example.com/video.mp4',title:'Project video'})?.type,'video/mp4'); assert.equal(safeUrl('//evil.example'),'');
});
test('SEO defaults inherit content and noindex requires an explicit boolean', () => {
 const result=normalizeContent({homepage:{seo:{noIndex:'true'}}},true); const metadata=pageSeo(result.homepage.seo,result.settings,'Content title','Content description','/example/'); assert.equal(metadata.title,'Content title'); assert.equal(metadata.canonical,'https://intelligencelayer.com.au/example/'); assert.equal(metadata.noindex,false);
});
test('insights require meaningful content and resolve service relationships', () => {
 const result=normalizeContent({insights:[{_id:'insight',slug:'vr-guide',title:'VR guide',excerpt:'An informed guide.',body:[paragraph],related:[{_type:'service',slug:'vr-development',category:'xr',title:'VR Development'}]},{slug:'empty',title:'Empty',excerpt:'Empty article.',body:[]}]},true);
 assert.equal(result.insights.length,1); assert.equal(result.insights[0].related[0].href,'/xr/vr-development/');
});

test('image crops retain correct dimensions and broken destinations fall back safely', () => {
 const cropped=editorialImage({...image,crop:{left:0.25,right:0.25,top:0,bottom:0}})!;
 assert.equal(cropped.width,800); assert.equal(cropped.height,900); assert.match(cropped.src,/rect=/);
 const result=normalizeContent({homepage:{primaryCtaDestination:'/missing/'}},true); assert.equal(result.homepage.primaryCtaDestination,'#contact');
});
test('incomplete new service documents cannot create empty landing pages', () => {
 const result=normalizeContent({services:[{slug:'ai-agents',category:'ai',title:'AI Agents',introduction:null,shortDescription:[]}]},true); assert.ok(!result.services.some(s=>s.slug==='ai-agents')); assert.equal(result.services.length,5);
});
test('commercial edits are published-only, validated and respect explicit team removal',()=>{
 const result=normalizeContent({commercial:{industries:[{title:'Mining',description:'Sector-specific copy',services:['digital-twins','missing']}],team:[{name:'Approved person',approvedForPublication:true,role:'Approved role'},{name:'Private person',approvedForPublication:false}],aboutTitle:'An edited About heading',processSteps:[{title:'Only one',description:'Incomplete'}]}},true);
 assert.equal(result.commercial.about.title,'An edited About heading');assert.equal(result.commercial.processSteps.length,6);assert.deepEqual(result.commercial.industries[0].services,['digital-twins']);assert.equal(result.commercial.team.length,1);assert.doesNotMatch(JSON.stringify(result.commercial),/Private person/);assert.equal(normalizeContent({commercial:{team:[]}},true).commercial.team.length,0);
});
test('all v1 commercial routes can be used by the editable primary CTA',()=>{
 for(const route of ['/services/','/industries/','/about/','/start-a-project/']) assert.equal(normalizeContent({homepage:{primaryCtaDestination:route}},true).homepage.primaryCtaDestination,route);
});
test('existing documents and malformed marketing copy retain sensible defaults',()=>{
 const result=normalizeContent({marketing:{enquiryHeading:null,homepageServicesHeading:{bad:true},serviceCtaLabel:'',enquiryIntroduction:42}},true);
 assert.deepEqual(result.marketing,defaultMarketingCopy);assert.equal(result.services.length,5);
});
test('every editable marketing field is projected and accepts a nonempty editor override',()=>{
 const overrides=Object.fromEntries(marketingKeys.map(key=>[key,`Edited ${key}`]));
 const result=normalizeContent({marketing:overrides},true);
 assert.deepEqual(result.marketing,overrides);
 for(const key of marketingKeys) assert.ok(siteQuery.includes(key));
});
