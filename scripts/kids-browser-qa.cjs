// Install playwright and axe-core in your QA environment before running.
const {chromium}=require(process.env.PLAYWRIGHT_MODULE||'playwright');
const fs=require('fs'),assert=require('assert');
(async()=>{
 const browser=await chromium.launch({executablePath:process.env.QA_CHROMIUM_PATH||undefined,args:['--no-sandbox','--disable-gpu','--disable-dev-shm-usage','--no-zygote'],headless:true});
 const reports=[];
 for(const lang of ['en','ar'])for(const width of [320,375,390,768,1440]){
  const context=await browser.newContext({viewport:{width,height:900},reducedMotion:'reduce'});
  const page=await context.newPage(),errors=[];page.on('pageerror',e=>errors.push(e.message));
  await page.goto((process.env.BASE_URL||'http://127.0.0.1:3001')+'/kids?lang='+lang);await page.waitForTimeout(1200);
  assert.equal(await page.locator('main').getAttribute('dir'),lang==='ar'?'rtl':'ltr');
  assert.equal(await page.locator('main').getAttribute('lang'),lang);
  assert.equal(new URL(page.url()).pathname,'/kids');
  const overflow=await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth+1);assert(!overflow,'overflow '+lang+' '+width);
  for(const name of ['ilama-family','ilamo','ilama','grandpa','grandma']){
   const img=page.locator(`img[src="/kids/${name}.webp"]`);await img.scrollIntoViewIfNeeded();await img.evaluate(i=>i.decode());assert(await img.evaluate(i=>i.naturalWidth>0));
  }
  await page.addScriptTag({path:process.env.AXE_PATH||require.resolve('axe-core/axe.min.js')});
  const axe=await page.evaluate(()=>axe.run(document,{runOnly:{type:'tag',values:['wcag2a','wcag2aa','wcag21aa']}}));
  reports.push({lang,width,errors,violations:axe.violations.map(v=>({id:v.id,impact:v.impact,nodes:v.nodes.map(n=>({target:n.target,summary:n.failureSummary}))}))});
  if(width===390){
   const help=page.locator('button[aria-controls="ilama-how-to-play"]');await help.click();assert.equal(await help.getAttribute('aria-expanded'),'true');await help.click();assert(await page.locator('#ilama-how-to-play').isHidden());
   const q=page.getByRole('button',{name:lang==='ar'?'أنجزنا المهمة':'Quest complete',exact:true});await q.click();assert(await page.getByRole('button',{name:lang==='ar'?'✓ المهمة محفوظة':'✓ Quest saved',exact:true}).isDisabled());
   await page.reload();await page.waitForTimeout(500);assert(await page.getByRole('button',{name:lang==='ar'?'✓ المهمة محفوظة':'✓ Quest saved',exact:true}).isDisabled());
   for(const age of (lang==='ar'?['٤–٥','٦–٩','١٠–١٢','١٣–١٦','العائلة']:['4-5','6-9','10-12','13-16','Family'])){const b=page.getByRole('button',{name:age,exact:true});await b.click();assert.equal(await b.getAttribute('aria-pressed'),'true'); const tabs=page.locator('[class*=gameTabs] button');for(let i=0;i<await tabs.count();i++){await tabs.nth(i).click();assert.equal(await tabs.nth(i).getAttribute('aria-pressed'),'true');assert(!await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth+1));}}
  }
  if(process.env.QA_SCREENSHOTS&&(width===390||width===1440))await page.screenshot({path:`qa-${lang}-${width}.png`,fullPage:true});
  assert.equal(errors.length,0,errors.join('\n'));await context.close();
 }
 const context=await browser.newContext({viewport:{width:390,height:844}});const page=await context.newPage();
 await page.route('**/api/learning-missions',r=>r.fulfill({status:503,body:'{}'}));
 await page.route('**/api/learning-games',r=>r.fulfill({status:200,contentType:'application/json',body:JSON.stringify({games:[{key:'invalid'}]})}));
 await page.route('**/api/foods',r=>r.fulfill({status:503,body:'{}'}));
 await page.goto((process.env.BASE_URL||'http://127.0.0.1:3001')+'/kids?lang=en');await page.waitForTimeout(700);
 assert(await page.getByText('Extra missions are unavailable;', {exact:false}).isVisible());
 const choices=page.getByRole('group',{name:'Answer choices'}).getByRole('button');await choices.nth(0).click();for(let i=0;i<await choices.count();i++)assert(await choices.nth(i).isDisabled());
 assert(await page.getByText('Correct answer: Baladi bread.',{exact:false}).isVisible());await page.getByRole('button',{name:'Next mission',exact:false}).click();assert(await choices.nth(0).isEnabled());
 await choices.nth(1).click();await page.reload();await page.waitForTimeout(500);assert(await page.evaluate(()=>localStorage.getItem('ilama-kids-guest-progress-v1')!==null));
 await page.evaluate(()=>{Storage.prototype.setItem=()=>{throw new Error('storage blocked')}});await page.getByRole('button',{name:'Quest complete',exact:true}).click();assert(await page.getByText('saving progress on this device is unavailable.',{exact:false}).isVisible());assert(await page.getByRole('button',{name:'Quest complete',exact:true}).isEnabled());
 await context.close();
 console.log('PASS fallback APIs, mission answer lock, explanation, reset, persistence and storage failure');
 fs.writeFileSync('qa-results.json' ,JSON.stringify(reports,null,2));console.log(JSON.stringify(reports.map(r=>({lang:r.lang,width:r.width,errors:r.errors.length,violations:r.violations.length}))));await browser.close();
 assert(reports.every(r=>r.violations.length===0),'Accessibility violations');
})().catch(e=>{console.error(e);process.exit(1)});
