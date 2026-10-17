import test from "node:test";
import assert from "node:assert/strict";
import {readFileSync} from "node:fs";
const read=path=>readFileSync(new URL("../"+path,import.meta.url),"utf8");
const app=read("app/page.tsx");
const config=read("next.config.ts");

test("public route rewrites keep the existing client-side view mapping",()=>{
  const mappings={learn:"/explore",kids:"/kids",atlas:"/food-atlas",journal:"/journal",visit:"/visit-prep",privacy:"/privacy"};
  for(const [view,path] of Object.entries(mappings)){
    assert.ok(app.includes(view+':"'+path+'"'),"missing app view "+view);
    assert.ok(config.includes('source: "'+path+'", destination: "/"'),"missing shell rewrite "+path);
  }
  assert.match(app,/const viewPaths:Record<View,string>/);
  assert.match(app,/const pathViews/);
});

test("private and medical API endpoints are not rewritten to the public shell",()=>{
  for(const route of ["/api/admin","/api/foods","/api/profile","/api/entries","/account","/auth","/admin"]){
    assert.ok(!config.includes('source: "'+route),route+" must not be rewritten to the public shell");
  }
  assert.match(config,/source: "\/api\/auth\/:path\*\/", destination: "\/api\/auth\/:path\*"/);
  assert.doesNotMatch(config,/source: "\/api\/[^"]+", destination: "\/"/);
});
