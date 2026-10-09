import {test,before,after} from 'node:test';
import assert from 'node:assert/strict';
import {PGlite} from '@electric-sql/pglite';
import {loadTypeScript} from './load-kids-test.mjs';
const domain=loadTypeScript('lib/kids/domain.ts'),repo=loadTypeScript('lib/kids/repository.ts'),games=loadTypeScript('lib/kids/gameplay.ts');
const db=new PGlite();
before(async()=>{await db.exec(repo.schema)});after(async()=>db.close());
const tx=fn=>db.transaction(sql=>fn(sql));
const profile=(user,id,nickname=id)=>tx(sql=>repo.saveProfile(sql,user,{nickname,ageBand:'8-12',consent:true},id));
const denied=status=>error=>error instanceof domain.KidsError&&error.status===status;

test('profile consent and input bounds are enforced',()=>{
 for(const body of [null,[],{nickname:'Noor',ageBand:'8-12',consent:false},{nickname:'x'.repeat(41),ageBand:'8-12',consent:true},{nickname:'x',ageBand:'adult',consent:true},{nickname:{},ageBand:'8-12',consent:true}])assert.throws(()=>domain.parseProfile(body),denied(400));
 assert.equal(domain.parseProfile({nickname:'  Noor  ',ageBand:'under-8',consent:true}).nickname,'Noor');
});
test('two owners and sibling profiles have independent PostgreSQL snapshots',async()=>{
 await profile('owner-a','child-a');await profile('owner-a','child-a2');await profile('owner-b','child-b');
 await tx(sql=>repo.saveSnapshot(sql,'owner-a',{childId:'child-a',zone:'egypt',revision:0,state:['dak','dak','unknown']}));
 assert.deepEqual((await tx(sql=>repo.snapshots(sql,'owner-a','child-a')))[0].state,['dak']);
 assert.deepEqual(await tx(sql=>repo.snapshots(sql,'owner-a','child-a2')),[]);
 assert.deepEqual(await tx(sql=>repo.snapshots(sql,'owner-b','child-b')),[]);
 await assert.rejects(tx(sql=>repo.snapshots(sql,'owner-b','child-a')),denied(404));
 await assert.rejects(tx(sql=>repo.saveSnapshot(sql,'owner-b',{childId:'child-a',zone:'egypt',revision:1,state:['alex']})),denied(404));
 await assert.rejects(tx(sql=>repo.deleteProfile(sql,'owner-b','child-a')),denied(404));
});
test('compare-and-swap rejects stale writes without losing farm stock',async()=>{
 await profile('revision-owner','revision-child');
 const first=await tx(sql=>repo.saveSnapshot(sql,'revision-owner',{childId:'revision-child',zone:'farm',revision:0,state:{harvest:{tomato:3}}}));
 assert.equal(first.snapshot.revision,1);
 const stale=await tx(sql=>repo.saveSnapshot(sql,'revision-owner',{childId:'revision-child',zone:'farm',revision:0,state:{harvest:{tomato:0}}}));
 assert.equal(stale.conflict,true);assert.equal(stale.snapshot.state.harvest.tomato,3);
 const next=await tx(sql=>repo.saveSnapshot(sql,'revision-owner',{childId:'revision-child',zone:'farm',revision:1,state:{harvest:{tomato:2}}}));
 assert.equal(next.snapshot.revision,2);assert.equal(next.snapshot.state.harvest.tomato,2);
});
test('profile update uses authenticated owner and parameterized nickname',async()=>{
 await profile('update-owner','update-child',"Noor');DROP TABLE x;--");
 const updated=await tx(sql=>repo.saveProfile(sql,'update-owner',{id:'update-child',nickname:'Noor',ageBand:'under-8',consent:true},'unused'));
 assert.equal(updated.nickname,'Noor');assert.equal(updated.age_band,'under-8');
 await assert.rejects(tx(sql=>repo.saveProfile(sql,'intruder',{id:'update-child',nickname:'X',ageBand:'8-12',consent:true},'unused')),denied(404));
 assert((await tx(sql=>repo.profiles(sql,'owner-a'))).length===2);
});
test('limit five profiles and deletion cascade are enforced',async()=>{
 for(let i=0;i<5;i++)await profile('limit-owner','limit-'+i);
 await assert.rejects(profile('limit-owner','limit-5'),denied(409));
 await tx(sql=>repo.saveSnapshot(sql,'limit-owner',{childId:'limit-0',zone:'aqua',revision:0,state:['tilapia']}));
 await tx(sql=>repo.deleteProfile(sql,'limit-owner','limit-0'));
 assert.equal((await db.query("SELECT * FROM ilama_kids_snapshots WHERE child_id='limit-0'")).rows.length,0);
 await profile('limit-owner','limit-new');assert.equal((await tx(sql=>repo.profiles(sql,'limit-owner'))).length,5);
});
test('legacy profile import runs once and deleted records do not reappear',async()=>{
 await db.exec("CREATE TABLE child_profiles(id text PRIMARY KEY,user_id text UNIQUE,nickname text,age_band text,consent_at timestamptz,created_at timestamptz,updated_at timestamptz)");
 await db.query("INSERT INTO child_profiles VALUES ('old-child','legacy-owner','Old nickname','8-12',now(),now(),now())");
 assert.equal((await tx(sql=>repo.profiles(sql,'legacy-owner')))[0].id,'old-child');
 assert.equal((await tx(sql=>repo.profiles(sql,'legacy-owner'))).length,1);
 await tx(sql=>repo.deleteProfile(sql,'legacy-owner','old-child'));
 assert.deepEqual(await tx(sql=>repo.profiles(sql,'legacy-owner')),[]);
 assert.equal((await db.query("SELECT id FROM child_profiles WHERE user_id='legacy-owner'")).rows.length,0);
});
test('learning snapshots strip unexpected private fields and nonfinite counters',()=>{
 const farm=domain.cleanState('farm',{plots:[{crop:'tomato',water:Infinity}],harvest:{tomato:Infinity},video:'sensitive',weight:55});
 assert.equal(farm.harvest.tomato,0);assert.equal(farm.plots[0].water,0);assert(!('weight' in farm));assert(!('video' in farm));
 assert.deepEqual(domain.cleanState('aqua',['tilapia','tilapia',{},'unknown']),['tilapia']);
 assert.deepEqual(domain.cleanState('quests',{seed:999,fish:-1,egypt:'3',name:'secret'}),{seed:3,fish:0,egypt:0});
 assert.throws(()=>domain.parseSnapshot({childId:'x',zone:'camera',revision:0,state:{}}),denied(400));
 assert.throws(()=>domain.parseSnapshot({childId:'x',zone:'farm',revision:0,state:'x'.repeat(21000)}),denied(413));
});
test('achievement unions preserve discoveries; inventories require an explicit choice',()=>{
 assert.deepEqual(domain.mergeLearning('egypt',['dak'],['alex']),['dak','alex']);
 assert.deepEqual(domain.mergeLearning('quests',{seed:3,fish:1},{seed:1,fish:2}),{seed:3,fish:2,egypt:0});
 assert.equal(domain.mergeLearning('farm',{},{}),null);assert.equal(domain.mergeLearning('kitchen',[],[]),null);
});
test('cross-site requests and streamed oversized bodies are rejected',async()=>{
 await assert.rejects(domain.readBody(new Request('https://www.ilamabloom.com/api/kids/profiles',{method:'POST',headers:{origin:'https://evil.invalid'},body:'{}'})),denied(403));
 await assert.rejects(domain.readBody(new Request('https://www.ilamabloom.com/api/kids/profiles',{method:'POST',body:'x'.repeat(24001)})),denied(413));
 await assert.rejects(domain.readBody(new Request('https://www.ilamabloom.com/api/kids/profiles',{method:'POST',body:'broken'})),denied(400));
 assert.deepEqual(await domain.readBody(new Request('https://www.ilamabloom.com/api/kids/profiles',{method:'POST',headers:{origin:'https://www.ilamabloom.com'},body:'{"consent":true}'})),{consent:true});
});
test('farm repeated events cannot double harvest or spend missing ingredients',()=>{
 let farm={plots:Array(6).fill(null),harvest:{},visits:0};for(let n=0;n<5;n++)farm=games.farmAction(farm,{kind:'plot',plot:0,crop:'tomato'});
 assert.equal(farm.harvest.tomato,1);farm=games.farmAction(farm,{kind:'plot',plot:0,crop:'tomato'});assert.equal(farm.harvest.tomato,1);assert.equal(farm.plots[0].water,0);
 assert.strictEqual(games.farmAction(farm,{kind:'cook',ingredients:['tomato','tomato']}),farm);
 const cooked=games.farmAction(farm,{kind:'cook',ingredients:['tomato']});assert.equal(cooked.harvest.tomato,0);assert.strictEqual(games.farmAction(cooked,{kind:'cook',ingredients:['tomato']}),cooked);
});
test('motion needs temporal movement; knees and seated arms both support march',()=>{
 const sample={leftHand:{x:.1,y:.3},rightHand:{x:.8,y:.3},leftKneeY:.7,rightKneeY:.7,lean:0,leftUp:true,rightUp:true,armsWide:true,leftReach:true,rightReach:true};
 for(const kind of ['reach','march','dance','swim','stretch','harvest','mirror','family']){assert.equal(games.moved(kind,sample,null),false);assert.equal(games.moved(kind,sample,sample),false)}
 assert.equal(games.moved('march',{...sample,leftKneeY:.75},sample),true);
 assert.equal(games.moved('march',{...sample,leftHand:{x:.2,y:.3}},sample),true);
 assert.equal(games.moved('swim',{...sample,leftHand:{x:.2,y:.3}},sample),true);
 assert.equal(games.moveGoal(6,'gentle'),3);assert.equal(games.moveGoal(6,'regular'),6);assert.equal(games.moveGoal(6,'extended'),8);
});
