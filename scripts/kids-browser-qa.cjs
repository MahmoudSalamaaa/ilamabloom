// ILAMA Kids interactive browser QA. Requires Playwright and axe-core in QA environment.
// Run against a locally built app: BASE_URL=http://127.0.0.1:3001 node scripts/kids-browser-qa.cjs
const assert=require("node:assert/strict");
const fs=require("node:fs");
const {chromium}=require(process.env.PLAYWRIGHT_MODULE||"playwright");
const base=process.env.BASE_URL||"http://127.0.0.1:3001";
const reports=[];
const names=["ilama-family","ilamo","ilama","grandpa","grandma"];
const titles={en:["Grow with Ilama","Food Explorer","Build a Happy Plate","My Amazing Body","Story Time"],ar:["ازرع مع إيلاما","مستكشف الطعام","كوّن طبقك المبهج","جسمي المدهش","وقت الحكاية"]};
(async()=>{
 const browser=await chromium.launch({headless:true,executablePath:process.env.QA_CHROMIUM_PATH||undefined,args:["--no-sandbox","--disable-dev-shm-usage"]});
 try{
 for(const lang of ["en","ar"])for(const width of [320,375,390,768,1440]){
  const context=await browser.newContext({viewport:{width,height:900},reducedMotion:"reduce"});
  try{
   const page=await context.newPage();page.setDefaultTimeout(15000);const errors=[];page.on("pageerror",e=>errors.push(e.message));
   await page.goto(base+"/kids?lang="+lang,{waitUntil:"domcontentloaded"});await page.locator('[data-kids-world="true"]').waitFor();
   const world=page.locator('[data-kids-world="true"]');
   assert.equal(await page.locator("main").count(),1,"nested main landmark");
   assert.equal(await world.getAttribute("dir"),lang==="ar"?"rtl":"ltr");
   assert.equal(await world.getAttribute("lang"),lang);assert.equal(await world.locator("nav").count(),1,"Kids navigation landmark");
   const overflow=await page.evaluate(()=>document.documentElement.scrollWidth>window.innerWidth+1);
   assert.equal(overflow,false,"horizontal overflow "+lang+" "+width);
   for(const name of names){const img=world.locator('img[src="/kids/'+name+'.webp"]').first();await img.scrollIntoViewIfNeeded();await img.evaluate(async el=>{await Promise.race([el.decode(),new Promise((_,reject)=>setTimeout(()=>reject(new Error("Image decode timed out")),10000))])});assert(await img.evaluate(el=>el.naturalWidth>0),"missing artwork "+name)}
   await page.addScriptTag({path:process.env.AXE_PATH||require.resolve("axe-core/axe.min.js")});
   const accessibility=await page.evaluate(async()=>{const result=await window.axe.run(document,{runOnly:{type:"tag",values:["wcag2a","wcag2aa","wcag21aa"]}});return result.violations.map(v=>({id:v.id,impact:v.impact,nodes:v.nodes.length}))});
   if(width===390){
    for(let index=0;index<5;index++){
     await page.getByRole("button",{name:new RegExp(titles[lang][index])}).first().click();
     if(index===0){const plots=world.locator('[class*="gardenPlots"] button');for(const i of [2,0,1])await plots.nth(i).click();assert.equal(await plots.locator(":disabled").count(),3,"all garden plots planted")}
     if(index===1){for(const fruit of (lang==="ar"?["تفاح","موز","فراولة"]:["Apple","Banana","Strawberry"]))await world.locator('[class*="marketShelf"] button').filter({hasText:fruit}).click()}
     if(index===2){const items=world.locator('[class*="basketItems"] button');for(let i=0;i<3;i++)await items.nth(i).click()}
     if(index===3){const move=world.locator('[class*="bodyGame"] [class*="rewardButton"]').first();for(let i=0;i<3;i++)await move.click()}
     if(index===4){const next=world.locator('[class*="storyControls"] [class*="rewardButton"]');await next.click();await next.click()}
     const id=["garden","market","kitchen","body","family"][index];const reward=world.locator('[data-reward-zone="'+id+'"]');await reward.click();assert(await reward.isDisabled(),"earned reward cannot be collected twice");
     assert.equal(await world.locator('[class*="navStars"] strong').innerText(),(index+1)+"/5","star "+index);assert.equal(await world.locator('[data-active-game]').getAttribute("data-active-game"),id);assert(await world.locator('[role="status"]').first().innerText(),"reward status announced");
    }
    await page.reload();await world.waitFor();await page.waitForFunction(()=>document.querySelector('[data-kids-world="true"] [class*="navStars"] strong')?.textContent?.trim()==="5/5");
    assert.equal(await world.locator('[class*="navStars"] strong').innerText(),"5/5","stars persist after reload");
   }
   if(width===390){
    const farm=world.locator('section[aria-label="'+(lang==="ar"?"استكشف مزرعة جدو وتيتا التفاعلية":"Explore Grandpa and Grandma's interactive farm")+'"]');
    assert.equal(await farm.locator("canvas").count(),1,"farm canvas exists");
    await farm.getByRole("button",{name:lang==="ar"?/حوض فارغ 1/:/Empty plot 1/}).click();
    for(let n=0;n<4;n++)await farm.getByRole("button",{name:lang==="ar"?/حوض 1،/:/Plot 1,/}).click();
    await farm.getByRole("button",{name:lang==="ar"?/مطبخ تيتا/:/Grandma's kitchen/}).first().click();
    assert((await farm.innerText()).includes(lang==="ar"?"طماطم: 1":"Tomato: 1"),"farm harvest appears in kitchen");
    const lab=world.locator('section[aria-label="'+(lang==="ar"?"معمل إيلاما للتغذية والطبيعة":"Ilama food and nature lab")+'"]');
    await lab.getByRole("button",{name:/3-5/}).click();
    for(const origin of ["plant","animal","plant"])await lab.getByRole("button",{name:origin==="plant"?(lang==="ar"?/نبات/:/Plant/):(lang==="ar"?/حيوان/:/Animal/)}).click();
    assert(await lab.getByText(lang==="ar"?/خلصت المغامرة/:/Adventure complete/).first().isVisible(),"food origin discovery completes");
    const weather=world.locator('section[aria-label="'+(lang==="ar"?"معمل النباتات والطقس":"Plant and weather science lab")+'"]');
    for(const choice of (lang==="ar"?[/كمية مياه مناسبة/,/ضوء مناسب/,/المياه الزيادة تتصرف/]:[/suitable amount of water/i,/Suitable light/,/excess water drain/]))await weather.getByRole("button",{name:choice}).click();
    assert(await weather.getByText(lang==="ar"?/اكتشاف جميل/:/Wonderful discovery/).first().isVisible(),"plant science game completes");
    const egypt=world.locator('section[aria-label="'+(lang==="ar"?"مغامرات محافظات مصر":"Egypt governorate adventures")+'"]');
    await egypt.getByRole("button",{name:lang==="ar"?/الدقهلية/:/Dakahlia/}).click();
    await egypt.getByRole("button",{name:lang==="ar"?/العب تحدي الطعام/:/Play the food challenge/}).click();
    await egypt.getByRole("button",{name:lang==="ar"?/الأرز والخضروات/:/Rice and vegetables/}).click();
    assert((await egypt.getByRole("status").first().innerText()).includes("1 / 27"),"Egypt stamp earned");
   }
   if(process.env.QA_SCREENSHOTS&&(width===390||width===1440))await page.screenshot({path:"qa-kids-"+lang+"-"+width+".png",fullPage:true});
   reports.push({lang,width,errors,accessibility});
   assert.equal(errors.length,0,errors.join("; "));
   assert.equal(accessibility.length,0,"axe violations: "+JSON.stringify(accessibility));
  }finally{await context.close()}
 }
 fs.writeFileSync("qa-kids-results.json",JSON.stringify(reports,null,2));
 console.log("PASS Kids world bilingual, five games, stars, approved artwork, responsive and WCAG checks",reports.length);
 }finally{await browser.close()}
})().catch(e=>{console.error(e);process.exitCode=1});
