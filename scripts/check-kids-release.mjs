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
if(failures){console.error(failures+" release checks failed");process.exitCode=1}else console.log("Kids structural release checks passed; manual visual and interactive QA still required.");
