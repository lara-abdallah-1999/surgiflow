import assert from 'node:assert/strict';
import { createCopilotServer } from '../server/index.mjs';
import { mkdir, writeFile } from 'node:fs/promises';
const targets = await (await fetch('http://127.0.0.1:9223/json')).json();
const target = targets.find(t => t.type === 'page' && (t.url === 'about:blank' || t.url.startsWith('http://127.0.0.1:5173')));
if (!target) throw Error('Isolated browser page not found');
const socket = new WebSocket(target.webSocketDebuggerUrl);
await new Promise(resolve => socket.addEventListener('open', resolve, {once:true}));
let serial = 0; const pending = new Map(); const errors = [];
socket.addEventListener('message', event => { const data=JSON.parse(event.data); if(data.id){const request=pending.get(data.id);pending.delete(data.id); data.error ? request.reject(data.error) : request.resolve(data.result);} if(data.method==='Runtime.exceptionThrown') {const error=data.params.exceptionDetails.exception?.description ?? data.params.exceptionDetails.text;errors.push(error);console.error(error);} });
const call = (method,params={}) => new Promise((resolve,reject)=>{ const id=++serial;pending.set(id,{resolve,reject});socket.send(JSON.stringify({id,method,params})); });
const evaluate = async expression => {const result=await call('Runtime.evaluate',{expression,awaitPromise:true,returnByValue:true});if(result.exceptionDetails)throw Error(result.exceptionDetails.exception?.description);return result.result.value;};
await call('Runtime.enable');await call('Page.enable');await mkdir('.ui-checks',{recursive:true});

const pause=()=>new Promise(resolve=>setTimeout(resolve,200));
const click=async text=>{let found=false;for(let attempt=0;attempt<30&&!found;attempt++){found=await evaluate('(()=>{const button=[...document.querySelectorAll("button")].find(b=>b.innerText.includes('+JSON.stringify(text)+'));if(!button)return false;button.click();return true;})()');if(!found)await pause();}assert.ok(found,text);await pause();};
const go=async path=>{await evaluate('history.pushState({},"",'+JSON.stringify(path)+');window.dispatchEvent(new PopStateEvent("popstate"));');await pause();};
const record=()=>evaluate('(async()=>{const {useSurgeryStore}=await import("/src/store/surgeryStore.ts");return useSurgeryStore.getState().surgeries.find(s=>s.id==="SRG-2048");})()');

// Explicit test fixture only. No mock-provider path exists in the application.
const provider = { configured: false, respond: async ({ input, onDelta, signal }) => {
  const message = input.filter(item => item.role === 'user').at(-1)?.content ?? '';
  const initial = JSON.parse(input.find(item => item.call_id === 'current_workspace' && item.output).output);
  if (message.includes('Find') && !input.some(item => item.call_id === 'search')) return { output: [{ type: 'function_call', name: 'searchPatients', arguments: '{"query":"102845"}', call_id: 'search' }] };
  if (message.includes('Find') && !input.some(item => item.call_id === 'open')) return { output: [{ type: 'function_call', name: 'openSurgeryCase', arguments: '{"caseId":"SRG-2048"}', call_id: 'open' }] };
  if (message.includes('handoff') && !input.some(item => item.call_id === 'draft')) return { output: [{ type: 'function_call', name: 'generateHandoff', arguments: '{}', call_id: 'draft' }] };
  if (message.includes('Slow')) { await new Promise(resolve => setTimeout(resolve, 1500)); if (signal.aborted) throw new DOMException('Aborted', 'AbortError'); }
  onDelta('TEST TRANSPORT ONLY: ');
  await new Promise(resolve => setTimeout(resolve, 40));
  onDelta(initial.workflow?.nextAction?.title ?? 'Patient candidate found.');
  return { output: [] };
} };
const backend = createCopilotServer({ provider });
await new Promise(resolve => backend.listen(8787, '127.0.0.1', resolve));
const waitText = async text => { for(let i=0;i<50;i++){ if(await evaluate('Boolean(document.body?.innerText.includes('+JSON.stringify(text)+'))')) return; await pause(); } throw Error('Missing browser text: '+text); };
const send = async text => {
  await evaluate('(()=>{const t=document.querySelector("#ai-copilot-message");Object.getOwnPropertyDescriptor(HTMLTextAreaElement.prototype,"value").set.call(t,'+JSON.stringify(text)+');t.dispatchEvent(new Event("input",{bubbles:true}));})()');await pause();
  await evaluate('document.querySelector("#ai-copilot-message").closest("form").requestSubmit()');await pause();
};
try {
  await call('Emulation.setDeviceMetricsOverride',{width:320,height:800,deviceScaleFactor:1,mobile:false});
  await call('Page.navigate',{url:'http://127.0.0.1:5173/'});
  for(let i=0;i<50;i++){if(await evaluate(`Boolean(document.querySelector('button[aria-label="Open Surgery Copilot"]'))`))break;await pause();}
  await evaluate(`document.querySelector('button[aria-label="Open Surgery Copilot"]').click()`);
  await waitText('AI unavailable');await waitText('OPENAI_API_KEY');
  assert.equal(await evaluate('document.querySelector("[role=dialog]").getBoundingClientRect().right <= innerWidth+1'),true);
  provider.configured = true;await click('Check connection');await waitText('OpenAI');
  await send('Find the patient MRN 102845');await waitText('Patient candidate found.');
  const match=await evaluate(`(()=>{const buttons=[...document.querySelectorAll('section[aria-label="AI Surgery Copilot"] button')];const b=buttons.find(b=>b.innerText.includes('Open Sarah'));if(!b)return false;b.click();return true;})()`);assert.ok(match);
  await waitText('Equipment Scan');assert.equal(await evaluate('location.pathname'),'/surgery/SRG-2048');
  await evaluate(`document.querySelector('button[aria-label="Open Surgery Copilot"]').click()`);await waitText('Ask SurgiFlow AI');await waitText('OpenAI');
  const before=await record();
  await send('Draft a handoff');await waitText('Review unsaved handoff');await click('Review unsaved handoff');await waitText('Review and edit');
  assert.equal((await record()).surgeonNotes,before.surgeonNotes);assert.ok(await evaluate('document.querySelector("#copilot-draft").value.includes("TEST TRANSPORT ONLY")'));
  await evaluate('(async()=>{const {useSurgeryStore}=await import("/src/store/surgeryStore.ts");useSurgeryStore.getState().updateSurgery("SRG-2048",{paidAmount:1});})()');
  await waitText('The case records or destination note changed');
  assert.ok(await evaluate('[...document.querySelectorAll("button")].find(b=>b.innerText.includes("Save reviewed draft")).disabled'));
  await click('Discard');
  await send('Slow answer');
  await evaluate('(async()=>{const {useSurgeryStore}=await import("/src/store/surgeryStore.ts");useSurgeryStore.getState().updateSurgery("SRG-2048",{paidAmount:2});})()');
  await waitText('Cancelled because the workspace changed');await waitText('Live workspace changes');
  assert.ok(await evaluate(`document.querySelector('select[aria-label="AI speech language"]').innerText.includes('العربية')`));
  const overflows=await evaluate('[...document.querySelectorAll("[role=dialog] *")].filter(e=>{const r=e.getBoundingClientRect();return r.width>0 && r.right>innerWidth+2 && getComputedStyle(e).position!=="fixed"}).map(e=>({tag:e.tagName,cls:e.className,right:e.getBoundingClientRect().right}))');
  assert.deepEqual(overflows,[]);
  const screenshot=await call('Page.captureScreenshot',{format:'png'});await writeFile('.ui-checks/copilot-320.png',Buffer.from(screenshot.data,'base64'));
  assert.deepEqual(errors,[]);
  console.log('PASS: missing-key UI, streaming/tool results, verified case navigation, reviewed draft without mutation, stale-response cancellation, Arabic labels, and 320px drawer layout.');
} finally { socket.close();backend.closeAllConnections();await new Promise(resolve=>backend.close(resolve)); }
