import {milestoneIds} from './journeys';
/** Only learning state crosses the API. No camera frames, body metrics or free-form notes. */
export const zones = ['world','hub','farm','egypt','aqua','discover','food','weather','quests','kitchen','movement'] as const;
export type KidsZone = typeof zones[number];
export const ageBands = ['under-8','8-12','13-17'] as const;
export type AgeBand = typeof ageBands[number];
export type KidsProfile = {id:string;nickname:string;age_band:AgeBand;consent_at:string;progress_epoch?:number};
export type Snapshot = {zone:KidsZone;state:unknown;revision:number};
export class KidsError extends Error { constructor(public status:number,message:string){super(message)} }
const object=(v:unknown):Record<string,unknown> => v!==null&&typeof v==='object'&&!Array.isArray(v)?v as Record<string,unknown>:{};
const integer=(v:unknown,max:number)=>typeof v==='number'&&Number.isFinite(v)?Math.max(0,Math.min(max,Math.floor(v))):0;
const list=(v:unknown,allowed:readonly string[],max=allowed.length):string[]=>Array.isArray(v)?[...new Set(v.filter((x):x is string=>typeof x==='string'&&allowed.includes(x)))].slice(0,max):[];
const crops=['tomato','carrot','lettuce'];
const ingredients=['tomato','carrot','cucumber','apple','banana','orange','bread','rice','lentils','egg','fish','yogurt'];
export const egyptIds=['cairo','giza','alex','dak','shar','gharb','mon','beh','kafr','dam','port','ism','suez','qali','fay','beni','min','asy','soh','qena','lux','asw','red','mat','north','south','wadi'];
export const fishIds=['tilapia','catfish','sardine','mullet','mackerel','perch'];
export const moveIds=['butterfly','forest','dance','fish','flower','harvest','mirror','family'];
export const discoveryIds=['colors','protein','hydration','wash','plant','roots','sun','seasons','nile','delta','aswan','fish','reef','compost','family'];
export const questIds=['seed','fish','egypt'];
export const isZone=(v:unknown):v is KidsZone=>typeof v==='string'&&zones.includes(v as KidsZone);
export const validId=(v:unknown):v is string=>typeof v==='string'&&/^[a-zA-Z0-9_-]{1,80}$/.test(v);
export function cleanState(zone:KidsZone,input:unknown):unknown {
 const x=object(input);
 switch(zone){
 case 'world':return list(input,['garden','market','kitchen','body','family']);
 case 'hub':{const allowed=['farm','egypt','aqua','discover','move'];return {zone:allowed.includes(String(x.zone))?x.zone:'farm',visited:list(x.visited,allowed),achievements:list(x.achievements,allowed),milestones:list(x.milestones,milestoneIds)}}
 case 'farm':return {plots:Array.from({length:6},(_,i)=>{const p=object(Array.isArray(x.plots)?x.plots[i]:null);return crops.includes(String(p.crop))?{crop:p.crop,water:integer(p.water,p.crop==='tomato'?3:2)}:null}),harvest:Object.fromEntries(crops.map(id=>[id,integer(object(x.harvest)[id],999)])),visits:integer(x.visits,999)};
 case 'egypt':return list(input,egyptIds);
 case 'aqua':return list(input,fishIds);
 case 'discover':return list(input,discoveryIds);
 case 'food':return list(input,['origins','river']);
 case 'weather':return {completed:list(x.completed,['water','light','drain']),experiments:integer(x.experiments,1),observations:list(x.observations,['dry','dark','flooded','balanced'])};
 case 'quests':return Object.fromEntries(questIds.map(id=>[id,integer(x[id],3)]));
 case 'kitchen':return Array.isArray(input)?input.slice(-8).flatMap(v=>{const p=object(v),items=list(p.ingredients,ingredients,5);return typeof p.id==='number'&&Number.isSafeInteger(p.id)&&p.id>0&&items.length?[{id:p.id,ingredients:items}]:[]}):[];
 case 'movement':return list(input,moveIds);
 }
}
export function mergeLearning(zone:KidsZone,local:unknown,remote:unknown):unknown|null {
 const a=cleanState(zone,local),b=cleanState(zone,remote);
 if(['world','egypt','aqua','discover','food','movement'].includes(zone))return cleanState(zone,[...(a as string[]),...(b as string[])]);
 if(zone==='quests'){const x=a as Record<string,number>,y=b as Record<string,number>;return Object.fromEntries(questIds.map(id=>[id,Math.max(x[id],y[id])]))}
 if(zone==='hub'){const x=a as Record<string,unknown>,y=b as Record<string,unknown>;return cleanState(zone,{zone:x.zone,visited:[...(x.visited as string[]),...(y.visited as string[])],achievements:[...(x.achievements as string[]),...(y.achievements as string[])],milestones:[...(x.milestones as string[]),...(y.milestones as string[])]})}
 if(zone==='weather'){const x=a as {completed:string[];experiments:number;observations:string[]},y=b as typeof x;return cleanState(zone,{completed:[...x.completed,...y.completed],experiments:Math.max(x.experiments,y.experiments),observations:[...x.observations,...y.observations]})}
 // Inventories and saved recipes can be edited or deleted. Never silently merge them.
 return null;
}
export function parseProfile(body:unknown){
 const x=object(body);
 if(typeof x.nickname!=='string'||!x.nickname.trim()||x.nickname.length>40||/[\u0000-\u001f]/.test(x.nickname)||!ageBands.includes(x.ageBand as AgeBand)||x.consent!==true)throw new KidsError(400,'A nickname, age band and guardian consent are required');
 if(x.id!==undefined&&!validId(x.id))throw new KidsError(400,'Invalid profile ID');
 return {id:x.id as string|undefined,nickname:x.nickname.trim(),ageBand:x.ageBand as AgeBand};
}
export function parseSnapshot(body:unknown){
 const x=object(body);
 if(!validId(x.childId)||!isZone(x.zone)||!Number.isSafeInteger(x.revision)||Number(x.revision)<0||Number(x.revision)>2147483646||x.state===undefined)throw new KidsError(400,'Invalid learning snapshot');
 const generation=x.generation??0;
 if(!Number.isSafeInteger(generation)||Number(generation)<0||Number(generation)>2147483646)throw new KidsError(400,'Invalid journey generation');
 if(JSON.stringify(x.state).length>20000)throw new KidsError(413,'Learning state is too large');
 return {childId:x.childId,zone:x.zone,revision:x.revision as number,generation:generation as number,state:cleanState(x.zone,x.state)};
}
export function checkOrigin(request:Request){
 const origin=request.headers.get('origin');
 if(request.headers.get('sec-fetch-site')==='cross-site'||(origin&&origin!==new URL(request.url).origin))throw new KidsError(403,'Cross-site write denied');
}
export async function readBody(request:Request){
 checkOrigin(request);
 if(Number(request.headers.get('content-length'))>24000)throw new KidsError(413,'Request is too large');
 const reader=request.body?.getReader();if(!reader)throw new KidsError(400,'JSON is required');
 let size=0;const chunks:Uint8Array[]=[];
 try{while(true){const {done,value}=await reader.read();if(done)break;size+=value.byteLength;if(size>24000){await reader.cancel();throw new KidsError(413,'Request is too large')}chunks.push(value)}}finally{reader.releaseLock()}
 const bytes=new Uint8Array(size);let offset=0;for(const c of chunks){bytes.set(c,offset);offset+=c.length}
 try{return JSON.parse(new TextDecoder().decode(bytes)) as unknown}catch{throw new KidsError(400,'Invalid JSON')}
}
