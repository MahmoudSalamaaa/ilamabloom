const assert=require('node:assert/strict');
const {chromium}=require(process.env.PLAYWRIGHT_MODULE||'playwright');
(async()=>{
 const browser=await chromium.launch({headless:true});
 try{
  const context=await browser.newContext();
  const base=process.env.BASE_URL||'http://127.0.0.1:3001';
  const send=(body,headers={})=>context.request.post(base+'/api/analytics',{data:body,headers});
  for(const path of ['/kids?lang=ar','/parent/export','/%6bids','/#kids','/account','/api/kids']){
   const response=await send({event:'page_view',anonymousId:'qa-private-count',path});
   assert.equal(response.status(),200,path);assert.deepEqual(await response.json(),{ok:true});
   assert.equal(response.headers()['cache-control'],'no-store');
  }
  assert.equal((await send({event:'page_view',anonymousId:'qa',path:'/kids'},{origin:'https://other.invalid'})).status(),403);
  assert.equal((await send({event:'page_view',anonymousId:'qa',path:'/kids'},{'sec-fetch-site':'cross-site'})).status(),403);
  assert.equal((await send({event:'camera',anonymousId:'qa',path:'/kids'})).status(),400);
  assert.equal((await send({event:'page_view',anonymousId:'qa',path:'x'.repeat(25000)})).status(),413);
  for(const endpoint of ['/api/child-profile','/api/progress'])assert.equal((await context.request.post(base+endpoint,{data:{}})).status(),401);
  assert.equal((await context.request.delete(base+'/api/child-profile',{headers:{origin:'https://other.invalid'}})).status(),403);
  await context.addInitScript(()=>localStorage.setItem('ilama-bloom-analytics-consent','yes'));
  let emitted=0;
  await context.route('**/api/analytics',route=>{emitted++;return route.fulfill({json:{ok:true}})});
  for(const path of ['/kids?lang=en','/parent?lang=ar','/account','/auth/sign-in']){
   const page=await context.newPage();await page.goto(base+path);await page.waitForTimeout(300);
   assert.equal(emitted,0,'browser emitted analytics from '+path);await page.close();
  }
  const fresh=await browser.newContext({viewport:{width:1440,height:900}});
  const page=await fresh.newPage();await page.goto(base+'/?lang=en');
  await page.getByRole('dialog',{name:'Privacy choice'}).waitFor();
  await page.getByRole('navigation',{name:'Primary navigation'}).getByRole('button',{name:'Kids',exact:true}).click();
  await page.getByRole('region',{name:'Family journey space'}).waitFor();
  await page.getByRole('dialog',{name:'Privacy choice'}).waitFor({state:'hidden'});
  await page.goBack();await page.getByRole('dialog',{name:'Privacy choice'}).waitFor();
  await fresh.close();
  await context.close();console.log('PASS real HTTP privacy suppression, encoded/hash routes, no-store, cross-site denial, bounded bodies and legacy unauthenticated writes');
 }finally{await browser.close()}
})().catch(error=>{console.error(error);process.exitCode=1});
