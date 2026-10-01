import { useEffect, useState } from 'react';
import { useClient } from 'sanity';
import { PortableText } from '@portabletext/react';
import type { PortableTextBlock } from '@portabletext/types';
import { editorialImage, items, list, portableText, record, routeFor, safeUrl, text } from '../src/lib/sanity/helpers';
import type { EditorialImage } from '../src/lib/sanity/types';
interface Props {document: {displayed: Record<string, unknown> | null}}
export function ContentPreview({document}: Props) {
 const doc = record(document.displayed), client = useClient({apiVersion: '2026-10-01'});
 const [images, setImages] = useState<Record<string, unknown>>({});
 const serialized = JSON.stringify(doc);
 useEffect(() => {
  let active = true;
  const refs = [...serialized.matchAll(/"_ref":"(image-[^"]+)"/g)].map(match => match[1]);
  if (!refs.length) {setImages({}); return;}
  client.fetch<unknown[]>('*[_type == "sanity.imageAsset" && _id in $ids]{_id,url,metadata{dimensions{width,height}}}', {ids: refs}).then(result => {if (active) setImages(Object.fromEntries(result.map(value => {const r = record(value); return [text(r._id), r];})));}).catch(() => {if (active) setImages({});});
  return () => {active = false;};
 }, [serialized, client]);
 const withAssets = (value: unknown): unknown => {
  if (Array.isArray(value)) return value.map(withAssets);
  if (!value || typeof value !== 'object') return value;
  const r = record(value), asset = record(r.asset), ref = text(asset._ref);
  return Object.fromEntries(Object.entries({...r, ...(ref && images[ref] ? {asset: images[ref]} : {})}).map(([k,v]) => [k, withAssets(v)]));
 };
 const resolved = record(withAssets(doc));
 const title = text(doc.heroHeading, text(doc.headline, text(doc.title, text(doc.companyName, 'Draft content'))));
 const publicPath = doc._type === 'homepage' || doc._type === 'siteSettings' ? '/' : routeFor({...doc, slug: record(doc.slug).current});
 const publicUrl = safeUrl(`${process.env.SANITY_STUDIO_PUBLIC_SITE_URL || 'https://intelligencelayer.com.au'}${publicPath}`);
 const renderImage = (image?: EditorialImage) => image && <figure><img src={image.src} alt={image.alt} style={{width:'100%',height:'auto'}} />{image.caption && <figcaption>{image.caption}</figcaption>}</figure>;
 return <div style={{background:'#f7f8fa',color:'#071126',padding:'2rem',fontFamily:'Arial,sans-serif',lineHeight:1.6,maxWidth:900,margin:'auto'}}>
  <p style={{fontSize:13,color:'#5d6678'}}>Draft content preview. Changes here are not public until published and the website rebuild completes. This checks content, not the full website layout.</p>
  {publicPath && <a href={publicUrl} target="_blank" rel="noreferrer">Open published page</a>}
  <h1 style={{lineHeight:1.05,fontSize:42,letterSpacing:'-.04em'}}>{title}</h1>
  <p>{text(doc.heroIntroduction, text(doc.introduction, text(doc.shortDescription, text(doc.excerpt))))}</p>
  {renderImage(editorialImage(resolved.coverImage))}
  {doc._type === 'homepage' && <>
   <h2>{text(doc.aiHeading)}</h2><p>{text(doc.aiIntroduction)}</p><ul>{list(doc.aiCapabilities).map((v,i) => <li key={i}>{text(v)}</li>)}</ul>
   <h2>{text(doc.xrHeading)}</h2><p>{text(doc.xrIntroduction)}</p>
   <h2>What could we build together?</h2><p>{text(doc.buildIntroduction)}</p>
  </>}
  {['xrCategories','outcomes','useCases','capabilities','ventures'].map(key => items(doc[key]).map((item,i) => <section key={`${key}-${i}`}><h2>{item.title}</h2><p>{item.description}</p></section>))}
  <PortableText value={portableText(resolved.body) as PortableTextBlock[]} components={{types: {
   editorialImage: ({value}) => renderImage(value.image as EditorialImage),
   callout: ({value}) => <aside><strong>{text(value.title)}</strong><p>{text(value.text)}</p></aside>,
   videoEmbed: ({value}) => <p><a href={text(record(value.media).src)}>{text(record(value.media).title)}</a></p>,
  }}} />
  {text(doc.deliveryHeading) && <><h2>{text(doc.deliveryHeading)}</h2><p>{text(doc.deliveryIntroduction)}</p><p>{text(doc.deliveryApproach)}</p><ul>{list(doc.productionCapabilities).map((v,i) => <li key={i}>{text(v)}</li>)}</ul></>}
  {list(doc.faqs).map((value,i) => {const faq = record(value); return <section key={i}><h2>{text(faq.question)}</h2><p>{text(faq.answer)}</p></section>;})}
  {doc._type === 'homepage' && <><h2>{text(doc.finalCtaHeading)}</h2><p>{text(doc.finalCtaCopy)}</p></>}
  {doc._type === 'siteSettings' && <><p>{text(doc.locationDescription)}</p><p>{text(doc.contactEmail)}</p><p>{text(doc.contactCta)}</p></>}
  <p>{text(doc.attributionNote)}</p>
  <hr /><h2>Search appearance</h2><p><strong>{text(record(doc.seo).metaTitle, title)}</strong><br />{text(record(doc.seo).metaDescription, text(doc.excerpt, text(doc.introduction, text(doc.heroIntroduction))))}</p>
  {record(doc.seo).noIndex === true && <p style={{color:'#a00'}}>This page is excluded from search indexing.</p>}
 </div>;
}
