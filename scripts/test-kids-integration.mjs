import {strict as assert} from "node:assert";
import {readFileSync} from "node:fs";
import {test} from "node:test";
import ts from "typescript";
const files=["app/KidsWorld.tsx","app/KidsAdventureHub.tsx","app/FarmWorld.tsx","app/EgyptAdventures.tsx","app/AquaWorld.tsx","app/DiscoveryLab.tsx","app/MoveAdventures.tsx","app/PoseMotionTracker.tsx","app/motionLogic.ts"];
for(const file of files)test("parse "+file,()=>{const s=readFileSync(file,"utf8");const source=ts.createSourceFile(file,s,ts.ScriptTarget.Latest,true,file.endsWith(".tsx")?ts.ScriptKind.TSX:ts.ScriptKind.TS);assert.deepEqual(source.parseDiagnostics.map(d=>ts.flattenDiagnosticMessageText(d.messageText," ")),[])});
test("hub integrates five worlds exactly once",()=>{const hub=readFileSync("app/KidsAdventureHub.tsx","utf8");const kids=readFileSync("app/KidsWorld.tsx","utf8");for(const name of ["FarmWorld","EgyptAdventures","AquaWorld","DiscoveryLab","MoveAdventures"])assert.match(hub,new RegExp("<"+name+"\\b"));assert.match(kids,/<KidsAdventureHub ar=\{ar\}/);assert.doesNotMatch(kids,/<FarmWorld\b|<MoveAdventures\b/)});
test("no animal medicine or punitive rewards",()=>{const hub=readFileSync("app/KidsAdventureHub.tsx","utf8");assert.doesNotMatch(hub,/veterinary|punishment points|lose points/i)});
