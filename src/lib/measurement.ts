export function measurementId(value: unknown): string {
 return typeof value === 'string' && /^G-[A-Z0-9]+$/.test(value) ? value : '';
}
export function safePageUrl(value: string): string {
 try { const url = new URL(value); return ['https:','http:'].includes(url.protocol) ? url.origin + url.pathname : ''; } catch { return ''; }
}
export function conversionCollector(send: (name: string, parameters: Record<string,string>) => void, pageUrl: string) {
 let allowed = false;
 let successSent = false;
 const seen = new WeakSet<Event>();
 return {
  consent(value: boolean) { allowed = value; },
  receive(event: Event) {
   if (!allowed || seen.has(event)) return;
   seen.add(event);
   const detail = (event as CustomEvent).detail;
   if (!detail || !['start_project_click','project_enquiry_success'].includes(detail.event)) return;
   if (detail.event === 'project_enquiry_success' && successSent) return;
   if (detail.event === 'project_enquiry_success') successSent = true;
   send(detail.event, {page_location:safePageUrl(pageUrl)});
  },
 };
}
