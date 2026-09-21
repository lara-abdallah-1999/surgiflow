import assert from 'node:assert/strict';
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
try {
 await call('Emulation.setDeviceMetricsOverride',{width:1440,height:900,deviceScaleFactor:1,mobile:false});
 await call('Page.navigate',{url:'http://127.0.0.1:5173/pre-op/SRG-2048'});
 for(let i=0;i<30;i++){await pause();if(await evaluate('Boolean(document.querySelector("#root")?.childElementCount)'))break;}
 await evaluate('(async()=>{const {useSurgeryStore}=await import("/src/store/surgeryStore.ts");useSurgeryStore.getState().updateSurgery("SRG-2048",{status:"Financially Cleared",paymentStatus:"Paid",cost:100,paidAmount:100});})()');await pause();
 await click('Patient entered OR section'); assert.equal((await record()).status,'Admitted');assert.ok((await record()).admittedAt);
 await click('Start Pre-Op');assert.equal((await record()).status,'Pre-Op');
 await go('/');
 await evaluate('(async()=>{const {useSurgeryStore}=await import("/src/store/surgeryStore.ts");useSurgeryStore.getState().updateSurgery("SRG-2048",{anesthesiaType:"General",anesthesiaTypeConfirmedAt:new Date().toISOString()});localStorage.setItem("pre-op-workspace-SRG-2048",JSON.stringify({completedTests:["cbc","coagulation","chemistry","ecg","imaging","clearance"],anesthesia:"General"}));})()');
 await go('/pre-op/SRG-2048');await pause();await click('Confirm Pre-Op Ready');
 assert.equal((await record()).status,'Ready');assert.equal(await evaluate('location.pathname'),'/pre-op/SRG-2048');assert.ok(await evaluate('document.body.innerText.includes("Pre-Op successful")'));
 console.log('PASS: OR admission, Start Pre-Op, and Confirm Ready remain in the workspace.');
 await go('/');await evaluate('(async()=>{const {useSurgeryStore}=await import("/src/store/surgeryStore.ts");useSurgeryStore.getState().updateSurgery("SRG-2048",{status:"Payment Pending",paymentStatus:"Pending",paidAmount:0,cost:100});})()');
 await go('/cashier?case=SRG-2048');await click('Use full balance');await click('Confirm payment');
 assert.equal((await record()).paymentStatus,'Paid');assert.ok(await evaluate('document.body.innerText.includes("Print receipt")'));
 console.log('PASS: Direct payment records the existing payment action and displays the printable receipt.');
 await go('/');await evaluate('(async()=>{const {useSurgeryStore}=await import("/src/store/surgeryStore.ts");useSurgeryStore.getState().updateSurgery("SRG-2048",{status:"Recovery",surgeryCompletedAt:new Date().toISOString(),recoveryAwakeningConfirmed:false,recoveryAwakeningObservations:[]});})()');
 await go('/surgery/SRG-2048');await click('Recovery');await evaluate('document.querySelector("#copilot-awakening details").open=true');
 await evaluate('(()=>{const t=document.querySelector("#copilot-awakening textarea");Object.getOwnPropertyDescriptor(HTMLTextAreaElement.prototype,"value").set.call(t,"Test observation: clinician review requested");t.dispatchEvent(new Event("input",{bubbles:true}));document.querySelector("#copilot-awakening input[type=checkbox]").click();})()');await pause();await click('Record observation');
 assert.equal((await record()).recoveryAwakeningObservations.length,1);assert.equal((await record()).recoveryAwakeningConfirmed,false);
 assert.ok(await evaluate('document.body.innerText.includes("review requested")'));await click('Record that clinician review occurred');assert.ok((await record()).recoveryAwakeningObservations[0].reviewedAt);
 console.log('PASS: Awakening observations and review records do not auto-confirm awakening.');
 const screenshot=await call('Page.captureScreenshot',{format:'png'});await writeFile('.ui-checks/recovery-observations.png',Buffer.from(screenshot.data,'base64'));
 assert.deepEqual(errors,[]); console.log('Workflow browser checks passed.');
} finally {socket.close();}

