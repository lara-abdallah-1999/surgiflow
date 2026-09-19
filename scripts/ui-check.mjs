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
const routes = process.argv.slice(2); const failures = []; const paths = routes.length ? routes : ['/', '/patients', '/pre-op/SRG-2048', '/accounting?case=SRG-2048', '/surgery/SRG-2048', '/post-op/SRG-2048', '/planning', '/schedule'];
for (const width of (process.env.UI_CHECK_WIDTHS ?? "1440,390,320").split(",").map(Number)) {
 await call('Emulation.setDeviceMetricsOverride',{width,height:900,deviceScaleFactor:1,mobile:false});
 for(const path of paths){
  await call('Page.navigate',{url:'http://127.0.0.1:5173'+path});
  for(let attempt=0;attempt<30;attempt++){await new Promise(resolve=>setTimeout(resolve,200));if(await evaluate('Boolean(document.querySelector("#root")?.childElementCount)'))break;}
  await new Promise(resolve=>setTimeout(resolve,150));
  const metrics=await evaluate("({ title:document.title, text:document.body.innerText.slice(0,120), width:innerWidth, docWidth:document.documentElement.scrollWidth, overflows:[...document.querySelectorAll('.workspace-page *')].filter(e=>e.getBoundingClientRect().width>0&&e.getBoundingClientRect().right>innerWidth+2&&!e.closest('.fixed,.absolute')).slice(0,8).map(e=>({tag:e.tagName,cls:e.className,right:Math.round(e.getBoundingClientRect().right)})) })");
  if(metrics.docWidth>width || metrics.overflows.length || !metrics.text) failures.push({width,path,...metrics});
  const name=width+'-'+path.replace(/[^a-z0-9]/gi,'_');
  const screenshot=await call('Page.captureScreenshot',{format:'png'});await writeFile('.ui-checks/'+name+'.png',Buffer.from(screenshot.data,'base64'));
  console.log(JSON.stringify({width,path,...metrics}));
 }
}
console.log(JSON.stringify({runtimeErrors:errors,layoutFailures:failures.length}));socket.close();if(errors.length || failures.length) process.exitCode=1;
