// ILAMA Kids detached release quality gate. This is a static check, not a browser test.
import fs from "node:fs";
import assert from "node:assert/strict";
import ts from "typescript";

const names=["app/KidsWorld.tsx","app/FarmWorld.tsx","app/FarmCanvas.tsx","app/EgyptAdventures.tsx","app/KidsDiscoveryLab.tsx","app/KidsWeatherLab.tsx"];
const files=Object.fromEntries(names.map(name=>[name,fs.readFileSync(name,"utf8")]));
let count=0;
const check=(label,ok)=>{assert.ok(ok,label);count++;console.log("✓ "+label)};
for(const [name,content] of Object.entries(files)){
 const ast=ts.createSourceFile(name,content,ts.ScriptTarget.Latest,true,ts.ScriptKind.TSX);
 const diagnostics=ast.parseDiagnostics;
 check(name+" TSX parses",diagnostics.length===0);
 if(diagnostics.length)for(const d of diagnostics)console.error(ts.flattenDiagnosticMessageText(d.messageText,"\n"));
}
const kids=files["app/KidsWorld.tsx"],farm=files["app/FarmWorld.tsx"],canvas=files["app/FarmCanvas.tsx"],egypt=files["app/EgyptAdventures.tsx"];
check("Farm and Egypt discovery integrated",kids.includes('import FarmWorld from "./FarmWorld"')&&kids.includes('import EgyptAdventures from "./EgyptAdventures"')&&kids.includes("<FarmWorld ")&&kids.includes("<EgyptAdventures "));
check("Canvas world with requestAnimationFrame",canvas.includes("requestAnimationFrame")&&canvas.includes("getContext(\"2d\")"));
check("Accessible keyboard movement and touch navigation",canvas.includes("onPointerDown={click}")&&canvas.includes("onKeyDown={keys}")&&canvas.includes("tabIndex={0}"));
check("Motion preference and manual pause",canvas.includes("prefers-reduced-motion")&&canvas.includes("setPaused"));
check("Zoom controls and bounded world",canvas.includes("setZoomLabel")&&canvas.includes("clamp("));
check("Farm planting, watering, harvesting",farm.includes("setFarm")&&farm.includes("harvest")&&farm.includes("water:Math.min"));
check("Farm save guarded by hydrated key",farm.includes("loadedKey===key")&&farm.includes("setLoadedKey(key)"));
check("Garden harvest links to kitchen",farm.includes("setPlate")&&farm.includes("Make my dish"));
check("Fish habitat and nutrition variation",farm.includes("Nile tilapia")&&farm.includes("Sardine")&&farm.includes("Omega-3 and vitamin D amounts vary"));
check("No penalties, natural break",farm.includes("No penalties. Take a break")&&canvas.includes("No timer or penalties"));
check("Egypt passport saves only discovered ids",egypt.includes("setStamps")&&egypt.includes("loadedKey===key"));
check("Governorates represented exactly 27 times",([...egypt.matchAll(/^\["[a-z]+","/gm)].length===27));
check("Egypt distractors have distinct food labels",egypt.includes("const used=new Set([place.foodEn])")&&egypt.includes("!used.has(p.foodEn)"));
check("Egypt question is about featured food, not exclusive ownership",egypt.includes("Which food or crop did we discover at this stop?"));
const discovery=files["app/KidsDiscoveryLab.tsx"],weatherLab=files["app/KidsWeatherLab.tsx"];
check("Food origins and Nile-to-table interactive choices",discovery.includes('choose("plant")')&&discovery.includes('choose("animal")')&&discovery.includes('game==="river"'));
check("Age bands without collecting birth date",discovery.includes('"3-5"')&&discovery.includes('"6-8"')&&discovery.includes('"9-12"')&&!discovery.includes("birthDate"));
check("Discovery stamps saved after hydration",discovery.includes("loaded===key")&&discovery.includes("setLoaded(key)"));
check("Weather experiment has three scenarios",([...weatherLab.matchAll(/answer:"(?:water|light|drain)"/g)].length===3));
check("Weather supports reduced motion and offline family activity",weatherLab.includes("prefers-reduced-motion")&&weatherLab.includes("Optional family experiment"));
check("No game timer, leaderboard or punitive points",![discovery,weatherLab].some(s=>/setInterval|leaderboard|streak|deductPoints|negativeScore/i.test(s)));
check("No vet games or child-facing clinic promotion",!names.some(name=>/veterinar|animal clinic|pet diagnosis|clinic discount|medical coupon|streak|leaderboard|in-app purchase/i.test(files[name])));
const approved=new Set(["ilama-family.webp","ilamo.webp","ilama.webp","grandpa.webp","grandma.webp"]);
for(const [name,content] of Object.entries(files)){
 const found=[...content.matchAll(/\/kids\/([\w-]+\.(?:webp|png|jpg|jpeg))/g)].map(x=>x[1]);
 check(name+" uses only approved art",found.every(file=>approved.has(file)));
}
console.log("ILAMA Kids engine static checks passed: "+count+". Run npm run build and real browser QA before publishing.");
