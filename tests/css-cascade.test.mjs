import test from "node:test";
import assert from "node:assert/strict";
import {readFileSync} from "node:fs";
import {fileURLToPath} from "node:url";
import {dirname,resolve} from "node:path";

const root=resolve(dirname(fileURLToPath(import.meta.url)),"..");
const read=path=>readFileSync(resolve(root,path),"utf8");
const foundation=read("app/ui-foundation.css");
const globals=read("app/globals.css");
const system=read("app/system.css");
const layout=read("app/layout.tsx");

test("shared defaults are contained in a low-priority cascade layer",()=>{
  assert.match(foundation,/@layer\s+ilama-foundation\s*\{/);
  assert.ok(foundation.indexOf("@layer ilama-foundation")<foundation.indexOf("html{scroll-padding-top"));
  assert.match(foundation,/:focus-visible/);
});
test("new design tokens never shadow legacy variables",()=>{
  const tokens=[...foundation.matchAll(/(--[a-z][a-z0-9-]*)\s*:/g)].map(x=>x[1]);
  assert.ok(tokens.length>=5);
  assert.equal(new Set(tokens).size,tokens.length,"duplicate shared token");
  assert.ok(tokens.every(x=>x.startsWith("--ui-")),"shared token must use --ui- namespace");
  for(const token of tokens)assert.doesNotMatch(globals+"\n"+system,new RegExp(token+"\\s*:"));
});
test("shared foundation loads after existing styles",()=>{
  const imports=[...layout.matchAll(/import\s+["']\.\/([^"']+\.css)["']/g)].map(x=>x[1]);
  assert.deepEqual(imports.slice(0,3),["system.css","globals.css","ui-foundation.css"]);
});
test("new CSS avoids !important except reduced-motion accessibility",()=>{
  const at=foundation.indexOf("@media(prefers-reduced-motion:reduce)");
  assert.ok(at>0);
  assert.doesNotMatch(foundation.slice(0,at),/!important/);
  assert.match(foundation.slice(at),/animation-duration:.*!important/);
});
test("legacy CSS specificity debt does not grow during consolidation",()=>{
  assert.ok((globals.match(/!important/g)||[]).length<=2458,"globals.css !important budget exceeded");
  assert.ok((globals.match(/:root\s*\{/g)||[]).length<=11,"globals.css root definitions increased");
  assert.ok((system.match(/!important/g)||[]).length<=9,"system.css !important budget exceeded");
});
