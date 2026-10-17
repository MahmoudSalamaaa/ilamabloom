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

test("Google Fonts are imported once without duplicate Cairo requests",()=>{
  const globalImports=globals.split("\n").filter(line=>line.startsWith("@import url(")&&line.includes("fonts.googleapis.com/css2"));
  assert.equal(globalImports.length,1,"one canonical Google Fonts request in globals.css");
  assert.ok(!system.includes("fonts.googleapis.com/css2"),"system.css must not duplicate font loading");
  const fontUrl=globalImports[0].match(/["']([^"']+)["']/);
  assert.ok(fontUrl,"Google Fonts URL must be quoted");
  const url=new URL(fontUrl[1]);
  const families=url.searchParams.getAll("family");
  assert.equal(families.filter(f=>f.startsWith("Cairo:")).length,1,"Cairo family must be requested once");
  const cairo=families.find(f=>f.startsWith("Cairo:"))||"";
  for(const weight of ["400","500","600","700"])assert.ok(cairo.includes(weight),"missing legacy Cairo weight "+weight);
  assert.equal(url.searchParams.get("display"),"swap");
});

test("shared chrome selectors cannot accumulate more cross-file overrides",()=>{
  // These existing collisions require visual migration, not blind deletion.
  const count=(css,selector)=>[...css.matchAll(/(?:^|[{}])\s*([^{}]+)\s*\{/gm)]
    .filter(match=>match[1].trim()===selector).length;
  const baseline={
    ".nav":[14,1],
    ".mobileNav":[15,2],
    ".brandLogo":[16,1],
    ".globalLang":[13,1],
    ".skipLink":[5,1],
  };
  for(const [selector,[maxGlobal,maxSystem]] of Object.entries(baseline)){
    assert.ok(count(globals,selector)<=maxGlobal,selector+" duplicated again in globals.css");
    assert.ok(count(system,selector)<=maxSystem,selector+" duplicated again in system.css");
  }
});

test("topic search input uses valid font longhands rather than an invalid shorthand",()=>{
  assert.doesNotMatch(globals,/font:500 1\.05rem inherit;/);
  assert.match(globals,/font-size:1\.05rem;font-weight:500;font-family:inherit;/);
});
