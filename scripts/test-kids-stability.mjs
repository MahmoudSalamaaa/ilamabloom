import {strict as assert} from "node:assert";
import {readFileSync} from "node:fs";
import {test} from "node:test";
import ts from "typescript";
const files=["app/KidsWorld.tsx","app/KidsAdventureHub.tsx","app/FarmWorld.tsx","app/EgyptAdventures.tsx","app/AquaWorld.tsx","app/DiscoveryLab.tsx","app/MoveAdventures.tsx","app/PoseMotionTracker.tsx","app/motionLogic.ts"];
for(const file of files){
test("TypeScript parser: "+file,()=>{const source=readFileSync(file,"utf8");const tree=ts.createSourceFile(file,source,ts.ScriptTarget.Latest,true,file.endsWith(".tsx")?ts.ScriptKind.TSX:ts.ScriptKind.TS);const errors=tree.parseDiagnostics.map(d=>ts.flattenDiagnosticMessageText(d.messageText," "));assert.deepEqual(errors,[])});
}
test("one navigable hub, five destinations",()=>{
const app=readFileSync("app/KidsWorld.tsx","utf8");const hub=readFileSync("app/KidsAdventureHub.tsx","utf8");
assert.match(app,/<KidsAdventureHub[^>]* ar=\{ar\}/);
for(const name of ["FarmWorld","EgyptAdventures","AquaWorld","DiscoveryLab","MoveAdventures"])assert.match(hub,new RegExp("<"+name+"\\b"));
assert.doesNotMatch(app,/<FarmWorld\b|<MoveAdventures\b/);
});
test("account switching cannot save previous account state",()=>{
for(const file of ["app/FarmWorld.tsx","app/KidsAdventureHub.tsx"]){const source=readFileSync(file,"utf8");assert.match(source,/loadedKey/);assert.match(source,/loadedKey===key|loadedKey!==storageKey/);}
});
test("camera remains optional and local",()=>{
const move=readFileSync("app/MoveAdventures.tsx","utf8");
const pose=readFileSync("app/PoseMotionTracker.tsx","utf8");
assert.match(move,/getUserMedia/);assert.match(move,/stopCamera/);assert.match(move,/ref=\{attachVideo\}/);assert.match(move,/video=\{videoNode\}/);assert.match(move,/completeMove/);
assert.doesNotMatch(move+pose,/MediaRecorder|sendBeacon|canvas\.toBlob|toDataURL|XMLHttpRequest/);
});
test("all approved illustrations referenced in kids world",()=>{
const src=readFileSync("app/KidsWorld.tsx","utf8");
for(const name of ["ilama-family.webp","ilamo.webp","ilama.webp","grandpa.webp","grandma.webp"])assert.ok(src.includes("/kids/"+name),name);
});

test("motion tracking requires temporal movement and cleans up model",()=>{const pose=readFileSync("app/PoseMotionTracker.tsx","utf8");assert.match(pose,/handDelta/);assert.match(pose,/previousHands\.current=hands/);assert.match(pose,/if\(disposed\)\{detector\.close\(\);detector=null;return;\}/);assert.match(pose,/previousHands\.current=null/);});
