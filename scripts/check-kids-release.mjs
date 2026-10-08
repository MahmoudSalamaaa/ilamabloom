// ILAMA Kids release gate. Run: node scripts/check-kids-release.mjs
import fs from "node:fs";
import assert from "node:assert/strict";
const component=fs.readFileSync("app/KidsEditorial.tsx","utf8");
const css=fs.readFileSync("app/KidsEditorial.module.css","utf8");
const required=[
 ["Arabic/English direction", 'dir={ar?"rtl":"ltr"}'],
 ["Family garden", "gardenFamily"],
 ["Ilamo and Ilama", "setBuddy"],
 ["Grandpa and Grandma adventures", "familyAdventure"],
 ["Four family stories", '"garden"|"recipe"|"market"|"colors"'],
 ["Age bands", '"4-5"'],
 ["Teens", '"13-16"'],
 ["Learning games", "gameTabs"],
 ["Food passport", "passport"],
 ["Progress persistence", "saveProgress"],
 ["Reward only after persistence", "if(!saved){setProgressNotice(true);return false}"],
 ["Guest local storage", "localStorage.setItem(GUEST_PROGRESS_KEY"],
 ["Atlas stamp after save", "if(await complete(key,1))setPassport"],
 ["Progress refresh merge", "sessionRewards.current.entries()"],
 ["Option selection accessibility", "aria-pressed={pick===String(i)}"],
 ["Saved game feedback", "completionNote"],
 ["Family story feedback only after save", 'if(await complete("family-story-"+familyStory,1))setFamilyTip(familyStory)'],
 ["Age change clears game selections", "setPick(null);setMulti([]);setPlate([])},[ageBand]"],
 ["Detective selection accessibility", "aria-pressed={pick===String(i)} key={o[0]}"],
 ["Completed family quest cannot resave", 'disabled={completed.includes("family-quest")}'],
 ["Bound remote game catalog", "d.games.slice(0,30).filter(validRemoteGame)"],
 ["Help disclosure", 'hidden={!showHelp}'],
 ["Mission feedback", "missionNotice"],
 ["Keyboard focus", ":focus-visible"],
];
let failures=0;
for(const [label,token] of required){
 const source=label==="Keyboard focus"?css:component;
 try{assert.ok(source.includes(token),label);console.log("PASS",label)}
 catch{console.error("FAIL",label);failures++}
}
for(const [label,token] of [["Mobile layout","@media(max-width:540px)"],["Reduced motion","prefers-reduced-motion:reduce"],["Hidden help",".page [hidden]{display:none!important}"]]){
 if(css.includes(token))console.log("PASS",label);else{console.error("FAIL",label);failures++}
}
// Approved original family art is a hard prerequisite for release.
for(const name of ["ilama-family","ilamo","ilama","grandpa","grandma"]){
 const path="public/kids/"+name+".webp";
 try{
  const header=fs.readFileSync(path).subarray(0,12);
  assert.equal(header.toString("ascii",0,4),"RIFF");
  assert.equal(header.toString("ascii",8,12),"WEBP");
  console.log("PASS approved artwork",name);
 }catch{console.error("FAIL approved artwork missing or invalid:",path);failures++}
}
if(failures){console.error(failures+" release checks failed");process.exitCode=1}else console.log("Kids structural release checks passed; manual visual and interactive QA still required.");
