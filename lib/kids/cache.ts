import {cleanState,isZone,mergeLearning,zones,type KidsZone,type Snapshot} from './domain';
export type Entry={state:unknown;revision:number;pending:boolean;conflict?:Snapshot};
export type Entries=Partial<Record<KidsZone,Entry>>;
export type JourneyCache={generation:number;entries:Entries};
export function generation(value:unknown):number{
 if(!Number.isSafeInteger(value)||Number(value)<0||Number(value)>2147483646)throw Error('Invalid journey generation');return value as number;
}
export function snapshot(value:unknown,expected?:KidsZone):Snapshot{
 const raw=value as Partial<Snapshot>|null;
 if(!raw||!isZone(raw.zone)||(expected&&raw.zone!==expected)||!Number.isSafeInteger(raw.revision)||Number(raw.revision)<0||Number(raw.revision)>2147483647)throw Error('Invalid learning snapshot');
 return {zone:raw.zone,revision:raw.revision!,state:cleanState(raw.zone,raw.state)};
}
export function decodeCache(input:unknown):JourneyCache{
 const result:JourneyCache={generation:0,entries:{}};
 if(!input||typeof input!=='object'||Array.isArray(input))return result;
 const raw=input as Record<string,unknown>;try{result.generation=generation(raw._generation??0)}catch{return result}
 for(const zone of zones){try{const e=raw[zone] as Entry;if(!e||typeof e!=='object')continue;result.entries[zone]={state:cleanState(zone,e.state),revision:snapshot({...e,zone}).revision,pending:e.pending===true}}catch{}}
 return result;
}
export function reconcile(cache:JourneyCache,remoteGeneration:number,values:unknown[]):JourneyCache{
 generation(remoteGeneration);
 // A guardian reset replaces all older learning evidence; it must never be unioned back.
 const entries:Entries=remoteGeneration===cache.generation?{...cache.entries}:{};
 for(const raw of values){const cloud=snapshot(raw);if(cloud.revision<1)continue;const local=entries[cloud.zone];
  if(local?.pending&&JSON.stringify(local.state)===JSON.stringify(cloud.state)){entries[cloud.zone]={state:cloud.state,revision:cloud.revision,pending:false};continue}
  if(local?.pending&&local.revision!==cloud.revision){const merged=mergeLearning(cloud.zone,local.state,cloud.state);entries[cloud.zone]=merged===null?{...local,conflict:cloud}:{state:merged,revision:cloud.revision,pending:true}}
  else entries[cloud.zone]=local?.pending?local:{state:cloud.state,revision:cloud.revision,pending:false};
 }
 return {generation:remoteGeneration,entries};
}
export function savedEntry(current:Entry,sent:Entry,cloud:Snapshot):Entry{
 if(cloud.revision!==sent.revision+1)throw Error('Unexpected saved revision');
 return {state:current.state,revision:cloud.revision,pending:JSON.stringify(current.state)!==JSON.stringify(sent.state)};
}
