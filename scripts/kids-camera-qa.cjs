const assert=require('node:assert/strict');
const {chromium}=require(process.env.PLAYWRIGHT_MODULE||'playwright');
(async()=>{
 const browser=await chromium.launch({headless:true,executablePath:process.env.QA_CHROMIUM_PATH,args:['--no-sandbox','--disable-dev-shm-usage']});
 try{
 const page=await browser.newPage({viewport:{width:390,height:844}});
 await page.addInitScript(()=>{
  window.cameraCalls=0;window.stoppedTracks=0;window.rejectCamera=false;window.deferCamera=false;
  Object.defineProperty(navigator,'mediaDevices',{configurable:true,value:{getUserMedia:async()=>{
   window.cameraCalls++;if(window.rejectCamera)throw new DOMException('Denied','NotAllowedError');
   if(window.deferCamera)await new Promise(resolve=>window.resolveCamera=resolve);
   const canvas=document.createElement('canvas');canvas.width=640;canvas.height=480;
   const stream=canvas.captureStream(15);const redraw=setInterval(()=>{canvas.getContext('2d').fillRect(0,0,640,480)},60);for(const track of stream.getTracks()){const stop=track.stop.bind(track);track.stop=()=>{window.stoppedTracks++;clearInterval(redraw);stop()}}
   return stream;
  }}});
 });
 await page.route('https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@*/vision_bundle.mjs',route=>route.fulfill({contentType:'text/javascript',body:`
export const FilesetResolver={forVisionTasks:async()=>({})};
export const PoseLandmarker={createFromOptions:async()=>({detectForVideo:()=>{window.poseFrames=(window.poseFrames||0)+1;const p=Array.from({length:33},()=>({x:.5,y:.5,visibility:1}));p[11]={x:.4,y:.4,visibility:1};p[12]={x:.6,y:.4,visibility:1};p[15]={x:window.poseMoving?(window.poseFrames%2?.1:.25):.1,y:.3,visibility:1};p[16]={x:.8,y:.3,visibility:1};p[23]={x:.4,y:.7,visibility:1};p[24]={x:.6,y:.7,visibility:1};return {landmarks:[p]}},close:()=>{window.poseClosed=(window.poseClosed||0)+1}})};
`}));
 await page.goto((process.env.BASE_URL||'http://127.0.0.1:3001')+'/kids?lang=en');
 const hub=page.locator('#kids-adventure-hub');
 await hub.locator('nav').first().getByRole('button',{name:/Move Adventures/}).click();
 const move=page.getByRole('region',{name:'Movement adventures'});
 await move.getByRole('button',{name:/Butterfly Garden/}).click();
 await move.getByRole('button',{name:'Camera preview (optional)',exact:true}).click();
 const enable=move.getByRole('button',{name:'Enable camera with guardian consent',exact:true});
 assert(await enable.isDisabled());assert.equal(await page.evaluate(()=>window.cameraCalls),0);
 await move.getByRole('checkbox').check();await page.evaluate(()=>window.rejectCamera=true);await enable.click();
 await move.getByRole('status').filter({hasText:'Camera unavailable'}).waitFor();
 await page.evaluate(()=>window.rejectCamera=false);await enable.click();await move.locator('video').waitFor();
 await page.waitForFunction(()=>document.querySelector('video')?.srcObject!==null);
 await move.getByRole('button',{name:'Start motion tracking',exact:true}).click();
 await move.getByRole('button',{name:'Start moving',exact:true}).click();
 await page.waitForFunction(()=>window.poseFrames>=8);
 assert((await move.innerText()).includes('0 / 6'),'stationary pose cannot earn movement');
 await page.evaluate(()=>window.poseMoving=true);
 await page.waitForFunction(()=>document.querySelector('section[aria-label="Movement adventures"]').innerText.includes('1 / 6'));
 await move.getByRole('button',{name:'Pause',exact:true}).click();
 assert.equal(await page.evaluate(()=>window.stoppedTracks),1,'pause releases camera');await page.waitForFunction(()=>window.poseClosed>=1);
 await move.getByRole('button',{name:'Play without camera',exact:true}).click();
 assert.equal(await page.evaluate(()=>window.stoppedTracks),1);await page.waitForFunction(()=>window.poseClosed>=1);assert.equal(await move.locator('video').count(),0);
 await move.getByRole('button',{name:'Camera preview (optional)',exact:true}).click();await enable.click();await move.locator('video').waitFor();
 await hub.locator('nav').first().getByRole('button',{name:/Aqua World/}).click();
 assert.equal(await page.evaluate(()=>window.stoppedTracks),2);
 await hub.locator('nav').first().getByRole('button',{name:/Move Adventures/}).click();await move.getByRole('button',{name:/Butterfly Garden/}).click();
 await move.getByRole('button',{name:'Camera preview (optional)',exact:true}).click();await move.getByRole('checkbox').check();
 await page.evaluate(()=>window.deferCamera=true);await enable.click();await page.waitForFunction(()=>!!window.resolveCamera);
 await move.getByRole('button',{name:'Play without camera',exact:true}).click();await page.evaluate(()=>window.resolveCamera());
 await page.waitForFunction(()=>window.stoppedTracks===3);assert.equal(await move.locator('video').count(),0);
 await move.getByRole('button',{name:'All games',exact:false}).click();
 for(const [name,goal] of [['Butterfly Garden',6],['Forest Adventure',8],['Dance with Ilama',8],['Swim Like a Fish',6],['Growing Sunflower',5],['Harvest Dance',6],['Mirror Me',6],['Family Movement Party',6]]){
  await move.getByRole('button',{name:new RegExp(name)}).click();await move.getByRole('button',{name:'Start moving',exact:true}).click();
  for(let n=0;n<goal;n++)await move.getByRole('button',{name:'✓ I did the move',exact:true}).click();
  assert(await move.getByRole('heading',{name:'Adventure complete! 🌟',exact:true}).isVisible(),name+' completes manually');
  await move.getByRole('button',{name:'Back to games',exact:true}).click();
 }
 await hub.locator('nav').first().getByRole('button',{name:/Aqua World/}).click();
 const aqua=page.getByRole('region',{name:'Aqua World',exact:true});
 for(const habitat of ['Nile','Sea']){await aqua.getByRole('button',{name:habitat==='Nile'?'🏞️ Nile':'🌊 Sea',exact:true}).click();const fish=aqua.locator('button').filter({hasText:/Nile tilapia|Catfish|Nile perch|Sardine|Mullet|Mackerel/});for(let n=0;n<await fish.count();n++)await fish.nth(n).click()}
 await page.waitForFunction(()=>JSON.parse(localStorage.getItem('ilama-journey-v2:guest')||'{}').hub?.state.achievements?.includes('aqua'));
 assert.match(await hub.getByRole('group',{name:'Adventure achievement passport'}).innerText(),/Aqua World.*Discovery saved/);
 await page.reload();await page.locator('#kids-adventure-hub').waitFor();await page.waitForFunction(()=>/Aqua World.*Discovery saved/.test(document.querySelector('[aria-label="Adventure achievement passport"]')?.textContent||''));
 for(const path of ['progress','child-profile','family','kids/profiles','kids/snapshots?childId=noor']){const response=await page.request.get((process.env.BASE_URL||'http://127.0.0.1:3001')+'/api/'+path);assert.equal(response.status(),401,path+' denies unauthenticated access')}
 const privatePage=await browser.newPage();let childAnalytics=0;await privatePage.addInitScript(()=>localStorage.setItem('ilama-bloom-analytics-consent','yes'));await privatePage.route('**/api/analytics',route=>{childAnalytics++;return route.fulfill({json:{ok:true}})});await privatePage.goto((process.env.BASE_URL||'http://127.0.0.1:3001')+'/kids?lang=en');await privatePage.getByRole('region',{name:'Family journey space'}).waitFor();await privatePage.waitForTimeout(200);assert.equal(childAnalytics,0,'child space never emits analytics even with prior public-site consent');await privatePage.close();
 const restricted=await browser.newPage({viewport:{width:390,height:844}});const storageErrors=[];restricted.on('pageerror',e=>storageErrors.push(e.message));
 await restricted.addInitScript(()=>{for(const name of ['getItem','setItem','removeItem'])Object.defineProperty(Storage.prototype,name,{value:()=>{throw new DOMException('Blocked','SecurityError')}})});
 await restricted.goto((process.env.BASE_URL||'http://127.0.0.1:3001')+'/kids?lang=ar');
 await restricted.getByRole('region',{name:'مساحة رحلة الأسرة'}).getByRole('status').filter({hasText:'التخزين على الجهاز غير متاح'}).waitFor();
 await restricted.locator('#kids-adventure-hub').locator('nav').first().getByRole('button',{name:/عالم المياه/}).click();await restricted.getByRole('region',{name:'اكتشاف الأسماك'}).getByRole('button',{name:/البلطي النيلي/}).click();assert.deepEqual(storageErrors,[]);await restricted.close();
 console.log('PASS synthetic pose stationary/moving detection and detector cleanup; camera consent, rejection/retry, pause cleanup, mode cleanup, unmount cleanup, late permission cleanup; eight manual movement games, aquatic passport persistence; 5 API authorization checks; Arabic play with browser storage blocked; no child analytics with prior consent');
 }finally{await browser.close()}
})().catch(e=>{console.error(e);process.exit(1)});
