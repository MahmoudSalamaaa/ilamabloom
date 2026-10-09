const assert=require('node:assert/strict'),fs=require('node:fs');
const {chromium}=require(process.env.PLAYWRIGHT_MODULE||'playwright');
(async()=>{const browser=await chromium.launch({headless:true});const results=[];try{
for(const lang of ['en','ar'])for(const width of [320,390,768,1440]){
 const page=await browser.newPage({viewport:{width,height:1000},reducedMotion:'reduce'});
 await page.goto((process.env.BASE_URL||'http://127.0.0.1:3001')+'/kids?lang='+lang);await page.locator('[data-kids-world]').waitFor();
 const inspect=async stage=>{
  const issues=await page.evaluate(()=>{const root=document.querySelector('[data-kids-world]'),width=innerWidth;
   return [...root.querySelectorAll('button,a,input,select,canvas')].filter(el=>el.getClientRects().length&&getComputedStyle(el).visibility!=='hidden').flatMap(el=>{const r=el.getBoundingClientRect();return r.width>0&&(r.left< -1||r.right>width+1)?[{text:el.getAttribute('aria-label')||el.textContent.slice(0,70),left:r.left,right:r.right}]:[]});
  });assert.deepEqual(issues,[],lang+'/'+width+'/'+stage+' clipped interactive controls');
 };
 await inspect('farm');
 const nav=page.locator('[class*="navLinks"]');const navItems=nav.locator('a,button');assert.equal(await navItems.count(),6);
 for(const item of await navItems.all()){const box=await item.boundingBox();assert(box.height>=43,'navigation target too small')}
 const canvas=await page.locator('canvas').first().boundingBox();assert(canvas.width<=900&&canvas.height<=510,'farm canvas overwhelms viewport');
 if(process.env.QA_SCREENSHOTS){await page.screenshot({path:'/tmp/kids-design-'+lang+'-'+width+'.png'});await page.locator('#kids-adventure-hub').screenshot({path:'/tmp/hub-design-'+lang+'-'+width+'.png'})}
 const destinations=page.locator('#kids-adventure-hub nav').first().locator('button');
 for(let i=1;i<5;i++){await destinations.nth(i).click();await inspect('destination-'+i)}
 results.push({lang,width,controlsWithinViewport:true,allSixNavigationTargets:true,canvasWidth:canvas.width,canvasHeight:canvas.height});await page.close();console.log('PASS layout '+lang+' '+width);
}
if(process.env.QA_REPORT)fs.writeFileSync(process.env.QA_REPORT,JSON.stringify(results,null,2)+'\n');
}finally{await browser.close()}})().catch(error=>{console.error(error);process.exitCode=1});
