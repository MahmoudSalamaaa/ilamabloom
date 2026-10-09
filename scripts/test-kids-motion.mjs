import {strict as assert} from "node:assert";
import {readFileSync} from "node:fs";
import {test} from "node:test";
import ts from "typescript";
const files=["app/KidsWorld.tsx","app/FarmWorld.tsx","app/EgyptAdventures.tsx","app/AquaWorld.tsx","app/DiscoveryLab.tsx","app/MoveAdventures.tsx","app/PoseMotionTracker.tsx","app/motionLogic.ts"];
for(const file of files){test("TSX syntax "+file,()=>{const src=readFileSync(file,"utf8");const parsed=ts.createSourceFile(file,src,ts.ScriptTarget.Latest,true,file.endsWith(".tsx")?ts.ScriptKind.TSX:ts.ScriptKind.TS);assert.equal(parsed.parseDiagnostics.length,0,parsed.parseDiagnostics.map(d=>ts.flattenDiagnosticMessageText(d.messageText," ")).join("; "))})}
test("Kids integration imports movement tracker",()=>{const kids=readFileSync("app/KidsWorld.tsx","utf8");const moves=readFileSync("app/MoveAdventures.tsx","utf8");assert.match(kids,/import MoveAdventures/);assert.match(kids,/<MoveAdventures ar=\{ar\}/);assert.match(moves,/PoseMotionTracker/);assert.match(moves,/getUserMedia/);});
test("Movement includes eight unique game IDs",()=>{const src=readFileSync("app/MoveAdventures.tsx","utf8");const ids=[...src.matchAll(/\{id:"(butterfly|forest|dance|fish|flower|harvest|mirror|family)"/g)].map(m=>m[1]);assert.equal(new Set(ids).size,8)});
test("Camera must not record or upload",()=>{const src=readFileSync("app/MoveAdventures.tsx","utf8")+readFileSync("app/PoseMotionTracker.tsx","utf8");assert.doesNotMatch(src,/MediaRecorder|fetch\s*\(|XMLHttpRequest|sendBeacon|canvas\.toBlob|toDataURL/);});
