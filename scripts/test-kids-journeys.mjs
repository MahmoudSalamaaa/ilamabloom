import {test} from 'node:test';
import assert from 'node:assert/strict';
import {PGlite} from '@electric-sql/pglite';
import {loadTypeScript} from './load-kids-test.mjs';
const domain=loadTypeScript('lib/kids/domain.ts'),repo=loadTypeScript('lib/kids/repository.ts'),cache=loadTypeScript('lib/kids/cache.ts'),journeys=loadTypeScript('lib/kids/journeys.ts'),games=loadTypeScript('lib/kids/gameplay.ts'),{OptionalCamera}=loadTypeScript('lib/kids/camera.ts');

test('guardian reset protects old revision-zero and populated device writes in PostgreSQL',async()=>{
 const db=new PGlite();try{await db.exec(repo.schema);const tx=fn=>db.transaction(fn);
  for(const [owner,id] of [['owner','child'],['owner','sibling'],['other','foreign']])await tx(sql=>repo.saveProfile(sql,owner,{nickname:id,ageBand:'8-12',consent:true},id));
  await tx(sql=>repo.saveSnapshot(sql,'owner',{childId:'child',zone:'egypt',state:['dak'],revision:0,generation:0}));
  await tx(sql=>repo.saveSnapshot(sql,'owner',{childId:'sibling',zone:'aqua',state:['tilapia'],revision:0,generation:0}));
  await assert.rejects(tx(sql=>repo.clearSnapshots(sql,'other','child')),e=>e.status===404);
  assert.equal((await tx(sql=>repo.clearSnapshots(sql,'owner','child'))).generation,1);
  assert.deepEqual(await tx(sql=>repo.readJourney(sql,'owner','child')),{generation:1,snapshots:[]});
  for(const revision of [0,1]){const stale=await tx(sql=>repo.saveSnapshot(sql,'owner',{childId:'child',zone:'egypt',state:['dak'],revision,generation:0}));assert.deepEqual(stale,{reset:true,generation:1})}
  assert.equal((await tx(sql=>repo.snapshots(sql,'owner','sibling')))[0].state[0],'tilapia');
  const fresh=await tx(sql=>repo.saveSnapshot(sql,'owner',{childId:'child',zone:'egypt',state:['alex'],revision:0,generation:1}));assert.equal(fresh.snapshot.revision,1);
  assert.equal((await tx(sql=>repo.clearSnapshots(sql,'owner','child'))).generation,2);
  assert.deepEqual((await tx(sql=>repo.saveSnapshot(sql,'owner',{childId:'child',zone:'farm',state:{},revision:0,generation:1}))),{reset:true,generation:2});
 }finally{await db.close()}
});
test('existing learning profiles migrate to generation zero without losing consent or state',async()=>{
 const db=new PGlite();try{await db.exec("CREATE TABLE ilama_kids_profiles(id text PRIMARY KEY,user_id text,nickname text,age_band text,consent_at timestamptz,created_at timestamptz,updated_at timestamptz);INSERT INTO ilama_kids_profiles VALUES ('old','owner','Noor','8-12',now(),now(),now())");await db.exec(repo.schema);const p=(await db.query("SELECT nickname,progress_epoch,consent_at FROM ilama_kids_profiles WHERE id='old'")).rows[0];assert.equal(p.nickname,'Noor');assert.equal(p.progress_epoch,0);assert(p.consent_at)}finally{await db.close()}
});
test('cache generation change clears pending achievements and inventories instead of merging them back',()=>{
 const old={generation:0,entries:{egypt:{state:['dak'],revision:1,pending:true},farm:{state:{harvest:{tomato:3}},revision:0,pending:true}}};
 assert.deepEqual(cache.reconcile(old,1,[]),{generation:1,entries:{}});
 assert.deepEqual(cache.reconcile(old,1,[{zone:'egypt',state:['alex'],revision:1}]).entries.egypt.state,['alex']);
});
test('a lost save acknowledgement with identical inventory does not produce a false conflict',()=>{
 const state=domain.cleanState('farm',{harvest:{tomato:3}}),local={generation:0,entries:{farm:{state,revision:0,pending:true}}};
 const result=cache.reconcile(local,0,[{zone:'farm',state,revision:1}]);assert.equal(result.entries.farm.pending,false);assert.equal(result.entries.farm.revision,1);assert(!result.entries.farm.conflict);
});
test('same-generation learning union keeps pending discoveries while inventory mismatch stays explicit',()=>{
 const current={generation:2,entries:{egypt:{state:['dak'],revision:1,pending:true},farm:{state:domain.cleanState('farm',{harvest:{tomato:2}}),revision:1,pending:true}}};
 const next=cache.reconcile(current,2,[{zone:'egypt',state:['alex'],revision:2},{zone:'farm',state:{harvest:{tomato:3}},revision:2}]);assert.deepEqual(next.entries.egypt.state,['dak','alex']);assert.equal(next.entries.egypt.pending,true);assert(next.entries.farm.conflict);
});
test('cache decoding and server acknowledgement reject invalid shape, generation, zone and revision',()=>{
 assert.deepEqual(cache.decodeCache({egypt:{state:['dak','invalid'],revision:0,pending:true},_generation:1}).entries.egypt.state,['dak']);
 assert.deepEqual(cache.decodeCache({_generation:-1}),{generation:0,entries:{}});
 assert.throws(()=>cache.snapshot({zone:'unknown',revision:1,state:[]}));assert.throws(()=>cache.snapshot({zone:'aqua',revision:1,state:[]},'egypt'));
 for(const value of [-1,Infinity,'1',2147483647])assert.throws(()=>domain.parseSnapshot({childId:'child',zone:'egypt',revision:0,state:[],generation:value}));
 assert.throws(()=>cache.savedEntry({state:['dak'],revision:0,pending:true},{state:['dak'],revision:0,pending:true},{zone:'egypt',state:['dak'],revision:4}));
});
test('a later edit remains pending after an earlier successful save',()=>{
 const current={state:['dak','alex'],revision:0,pending:true},sent={state:['dak'],revision:0,pending:true};const next=cache.savedEntry(current,sent,{zone:'egypt',state:['dak'],revision:1});assert.equal(next.pending,true);assert.deepEqual(next.state,['dak','alex']);assert.equal(next.revision,1);
});
test('journey milestones use real completed learning evidence and no clock or check-off input',()=>{
 assert.deepEqual(journeys.observedMilestones({}),[]);assert.deepEqual(journeys.observedMilestones({hub:{milestones:journeys.milestoneIds}}),[]);
 assert.deepEqual(journeys.observedMilestones({farm:{plots:[{crop:'tomato',water:0}],harvest:{},visits:0}}),['seed-plant']);
 assert.deepEqual(journeys.observedMilestones({farm:{plots:[],harvest:{tomato:1},visits:0},kitchen:[{id:1,ingredients:['tomato']}]}),['seed-plant','seed-harvest','seed-meal']);
 assert.deepEqual(journeys.observedMilestones({aqua:['tilapia'],food:['river','origins'],egypt:['dak'],quests:{fish:3,egypt:3},movement:['butterfly'],weather:{completed:['water'],observations:['balanced']}}),journeys.milestoneIds.filter(id=>!id.startsWith('seed')));
});
test('saved milestones survive consuming the harvest and replaying a shorter step',()=>{
 const a=domain.cleanState('hub',{milestones:['seed-plant','seed-harvest']}),b=domain.cleanState('hub',{milestones:['seed-meal','invalid']});assert.deepEqual(domain.mergeLearning('hub',a,b).milestones,['seed-plant','seed-harvest','seed-meal']);
 let farm={plots:Array(6).fill(null),harvest:{tomato:1},visits:0};farm=games.farmAction(farm,{kind:'cook',ingredients:['tomato']});assert.equal(farm.harvest.tomato,0);assert.equal(farm.visits,1);assert.deepEqual(journeys.observedMilestones({farm}),['seed-plant','seed-harvest','seed-meal']);
});
test('toy plant conditions explain dry, dark, drainage and balanced settings without harming saved progress',()=>{
 assert.equal(games.simulatePlant(0,1,true),'dry');assert.equal(games.simulatePlant(1,0,true),'dark');assert.equal(games.simulatePlant(2,1,false),'flooded');assert.equal(games.simulatePlant(1,1,true),'balanced');assert.equal(games.simulatePlant(NaN,1,true),'dry');
 assert.deepEqual(domain.mergeLearning('weather',{observations:['dry'],completed:['water']},{observations:['balanced'],completed:['light']}),{completed:['water','light'],experiments:0,observations:['dry','balanced']});
});
function media(){const track=new EventTarget();track.readyState='live';track.stops=0;track.stop=()=>{track.stops++;track.readyState='ended'};return {track,stream:{getTracks:()=>[track],getVideoTracks:()=>[track]}}}
function deferred(){let resolve,reject;const promise=new Promise((yes,no)=>{resolve=yes;reject=no});return {promise,resolve,reject}}
test('camera consent and duplicate requests cannot acquire extra streams',async()=>{
 const d=deferred(),m=media(),states=[];let calls=0;const c=new OptionalCamera(()=>{calls++;return d.promise},s=>states.push(s),()=>{});await c.start(false);assert.equal(calls,0);const pending=c.start(true);await c.start(true);assert.equal(calls,1);d.resolve(m.stream);await pending;assert.equal(c.stream,m.stream);await c.start(true);assert.equal(calls,1);c.stop();assert.equal(m.track.stops,1);assert.equal(c.stream,null);assert.deepEqual(states,['loading','ready','off']);
});
test('cancelled and disposed permission results close their late stream without UI updates',async()=>{
 for(const dispose of [false,true]){const d=deferred(),m=media(),states=[];const c=new OptionalCamera(()=>d.promise,s=>states.push(s),()=>{}),pending=c.start(true);dispose?c.dispose():c.stop();const length=states.length;d.resolve(m.stream);await pending;assert.equal(m.track.stops,1);assert.equal(c.stream,null);assert.equal(states.length,length)}
});
test('camera timeout ignores late permission and closes its stream',async()=>{
 const d=deferred(),m=media(),states=[],c=new OptionalCamera(()=>d.promise,s=>states.push(s),()=>{},10),pending=c.start(true);await new Promise(r=>setTimeout(r,25));assert.equal(states.at(-1),'error');d.resolve(m.stream);await pending;assert.equal(m.track.stops,1);assert.equal(c.stream,null);c.dispose();
});
test('external device loss closes the stream, pauses play and detaches its listener',async()=>{
 const m=media(),states=[];let lost=0;const c=new OptionalCamera(async()=>m.stream,s=>states.push(s),()=>lost++);await c.start(true);m.track.dispatchEvent(new Event('ended'));assert.equal(lost,1);assert.equal(c.stream,null);assert.equal(m.track.stops,1);assert.equal(states.at(-1),'error');m.track.dispatchEvent(new Event('ended'));assert.equal(lost,1);c.dispose();
});
test('camera permission rejection allows a fresh retry',async()=>{
 const m=media(),states=[];let calls=0;const c=new OptionalCamera(async()=>{if(++calls===1)throw Error('denied');return m.stream},s=>states.push(s),()=>{});await c.start(true);assert.equal(states.at(-1),'error');await c.start(true);assert.equal(states.at(-1),'ready');c.dispose();assert.equal(m.track.stops,1);
});


test('meal ideas are bounded and use unique IDs when the clock repeats or overflows',()=>{
 let saved=[];for(let i=0;i<12;i++)saved=games.saveMealIdea(saved,['fish','rice','fish','unknown'],100);
 assert.equal(saved.length,8);assert.equal(new Set(saved.map(x=>x.id)).size,8);
 assert(saved.every(x=>JSON.stringify(x.ingredients)===JSON.stringify(['fish','rice'])));
 const wrapped=games.saveMealIdea([{id:Number.MAX_SAFE_INTEGER,ingredients:['fish']}],['lentils'],Number.MAX_SAFE_INTEGER);
 assert.deepEqual(wrapped.map(x=>x.id),[Number.MAX_SAFE_INTEGER,1]);
 assert.deepEqual(games.saveMealIdea(saved,[],100),saved);
});

test('snapshot revisions reject values beyond PostgreSQL integer range before writing',()=>{
 const valid={childId:'child',zone:'aqua',state:['tilapia'],generation:0};
 for(const revision of [-1,0.1,2147483647,Number.MAX_SAFE_INTEGER])assert.throws(()=>domain.parseSnapshot({...valid,revision}),e=>e.status===400);
 assert.equal(domain.parseSnapshot({...valid,revision:2147483646}).revision,2147483646);
 assert.throws(()=>cache.snapshot({zone:'aqua',state:[],revision:2147483648}));
});

test('story trail targets select the relevant food activity and quest',()=>{
 const nile=journeys.trails.find(x=>x.id==='nile'),egypt=journeys.trails.find(x=>x.id==='egypt');
 assert.equal(nile.steps.find(x=>x.id==='nile-story').destination.quest,'fish');
 assert.equal(nile.steps.find(x=>x.id==='nile-food').destination.food,'river');
 assert.equal(egypt.steps.find(x=>x.id==='egypt-story').destination.quest,'egypt');
 assert.equal(egypt.steps.find(x=>x.id==='egypt-origin').destination.food,'origins');
});
