export interface Enquiry {name:string; organisation:string; email:string; phone:string; service:string; problem:string; budget:string; timeline:string; contactMethod:string}
export function hubspotEndpoint(portal: string, form: string): string {
 return /^\d+$/.test(portal) && /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(form) ? `https://api.hsforms.com/submissions/v3/integration/submit/${portal}/${form}` : '';
}
export function enquiryPayload(enquiry: Enquiry, pageUri: string) {
 const parts = enquiry.name.trim().split(/\s+/);
 const message = [`Service: ${enquiry.service}`,`Problem or opportunity: ${enquiry.problem}`,`Approximate budget: ${enquiry.budget || 'Not specified'}`,`Desired timeline: ${enquiry.timeline || 'Not specified'}`,`Preferred contact: ${enquiry.contactMethod}`].join('\n');
 return {fields:[{name:'firstname',value:parts.shift() || ''},{name:'lastname',value:parts.join(' ')},{name:'company',value:enquiry.organisation.trim()},{name:'email',value:enquiry.email.trim()},{name:'phone',value:enquiry.phone.trim()},{name:'message',value:message}].filter(f=>f.value).map(f=>({objectTypeId:'0-1',...f})),context:{pageUri,pageName:'Start a project | Intelligence Layer'}};
}
export async function submitEnquiry(endpoint: string, enquiry: Enquiry, pageUri: string, fetcher: typeof fetch = fetch) {
 if (!endpoint || !endpoint.startsWith('https://api.hsforms.com/submissions/v3/integration/submit/')) throw new Error('Enquiry delivery is not configured.');
 const response = await fetcher(endpoint,{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(enquiryPayload(enquiry,pageUri)),signal:AbortSignal.timeout(20000)});
 if (!response.ok) throw new Error(response.status === 429 ? 'Please wait a moment before trying again.' : 'Your enquiry could not be confirmed. Please try again or email us.');
}
