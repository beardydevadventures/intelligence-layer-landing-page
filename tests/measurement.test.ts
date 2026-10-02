import test from 'node:test';
import assert from 'node:assert/strict';
import {measurementId,safePageUrl,conversionCollector} from '../src/lib/measurement';
test('measurement configuration and URL cleaning reject unsafe input',()=>{
 assert.equal(measurementId('G-ABC123'),'G-ABC123'); assert.equal(measurementId('G-abc<script>'),'');
 assert.equal(safePageUrl('https://example.com/start-a-project/?email=private#secret'),'https://example.com/start-a-project/');
 assert.equal(safePageUrl('javascript:alert(1)'),'');
});
test('conversions require consent, discard form data and deduplicate success and identical events',()=>{
 const sent: unknown[]=[]; const collector=conversionCollector((...args)=>sent.push(args),'https://example.com/?private=yes');
 const event=(name:string)=>new CustomEvent('conversion',{detail:{event:name,email:'private@example.com',path:'sensitive'}});
 collector.receive(event('project_enquiry_success')); assert.equal(sent.length,0);
 collector.consent(true); const click=event('start_project_click'); collector.receive(click); collector.receive(click);
 collector.receive(event('project_enquiry_success')); collector.receive(event('project_enquiry_success')); collector.receive(event('unknown'));
 assert.equal(sent.length,2); assert.doesNotMatch(JSON.stringify(sent),/private|sensitive|email/);
 collector.consent(false); collector.receive(event('start_project_click')); assert.equal(sent.length,2);
});
