// ILAMA Kids character-world release gate. Run: npm run check:kids
import fs from "node:fs";
import assert from "node:assert/strict";
import {createHash} from "node:crypto";
const component=fs.readFileSync("app/KidsWorld.tsx","utf8");
const css=fs.readFileSync("app/KidsWorld.module.css","utf8");
const app=fs.readFileSync("app/IlamaApp.tsx","utf8");
let failures=0;
const checks=[
["KidsWorld rendered by app",app.includes('from "./KidsWorld"')],
["Five distinct adventures",["garden","market","kitchen","body","family"].every(id=>component.includes('id:"'+id+'"'))],
["Approved family artwork",["ilama-family.webp","ilamo.webp","ilama.webp","grandpa.webp","grandma.webp"].every(name=>component.includes("/kids/"+name))],
["Garden planting",component.includes("gardenPlots")&&component.includes("setGardenSeeds")],
["Fruit market hunt",component.includes("marketShelf")&&component.includes("marketFinds")],
["Interactive plate builder",component.includes("basketItems")&&component.includes("setBasket")],
["Movement adventure",component.includes("moveFigure")&&component.includes("progressTrack")],
["Family story",component.includes("storyPage")&&component.includes("storyControls")],
["Arabic/English and RTL",component.includes('dir={ar?"rtl":"ltr"}')&&component.includes('lang={ar?"ar":"en"}')],
["Guest stars persisted after hydration",component.includes("if(!hydrated)return")&&component.includes("localStorage.setItem(storageKey")],
["Account-specific progress cache",component.includes('userId?"ilama-world-stars-v2:"+userId:guestStorageKey')&&app.includes("userId={session?.user?.id}")],
["Kids navigation destinations",["Food Atlas","Stories","Activities","For Parents"].every(x=>component.includes(x))],
["Remote save before reward",component.includes('await saveProgress("world:"+id,1)')&&component.includes("setEarned(old=>")],
["Duplicate-save guard",component.includes("saving.current")&&component.includes("earned.includes(id)")],
["Accessible feedback and pressed states",component.includes('role="status"')&&component.includes("aria-pressed")],
["Reduced motion",css.includes("prefers-reduced-motion:reduce")],
["Mobile responsive layout",css.includes("@media(max-width:480px)")&&css.includes("@media(max-width:720px)")],
["Keyboard focus",css.includes(":focus-visible")],
["Coherent character hero and discovery strip",component.includes("heroArt")&&component.includes("discoveryStrip")],
["No unreachable placeholder branches",!component.includes("false&&")],
["No legacy editorial styles imported",!component.includes("KidsEditorial")],
];
for(const [name,pass] of checks){if(pass)console.log("PASS",name);else{console.error("FAIL",name);failures++}}
const classes=[...component.matchAll(/styles\.([A-Za-z][A-Za-z0-9]*)/g)].map(x=>x[1]);
for(const name of new Set(classes)){if(!css.includes("."+name)){console.error("FAIL missing CSS module class",name);failures++}}
const approvedAssets=JSON.parse(fs.readFileSync("scripts/kids-assets.manifest.json","utf8"));
// Approved original family art is a hard prerequisite for release.
for(const name of ["ilama-family","ilamo","ilama","grandpa","grandma"]){
 const path="public/kids/"+name+".webp";
 try{
  const data=fs.readFileSync(path);
  assert.ok(data.length>=30 && data.length<=5*1024*1024,"Invalid artwork file size");
  assert.equal(data.toString("ascii",0,4),"RIFF");
  assert.equal(data.toString("ascii",8,12),"WEBP");
  assert.equal(data.readUInt32LE(4)+8,data.length,"Truncated or malformed RIFF payload");
  const expected=approvedAssets.assets.find(x=>x.name===name+".webp");
  assert.ok(expected,"Missing approved manifest entry");
  assert.equal(data.length,expected.bytes,"Unexpected artwork byte length");
  assert.equal(createHash("sha256").update(data).digest("hex"),expected.sha256,"Artwork does not match approved source");
  const format=data.toString("ascii",12,16);
  assert.ok(["VP8 ","VP8L","VP8X"].includes(format),"Unsupported WebP format");
  console.log("PASS approved artwork",name);
 }catch{console.error("FAIL approved artwork missing or invalid:",path);failures++}
}
if(failures){console.error(failures+" release checks failed");process.exitCode=1}else console.log("Kids structural release checks passed; manual visual and interactive QA still required.");
