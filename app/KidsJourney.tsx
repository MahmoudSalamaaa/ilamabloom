'use client';
import {createContext,useCallback,useContext,useEffect,useMemo,useRef,useState,type Dispatch,type SetStateAction,type ReactNode} from 'react';
import {cleanState,mergeLearning,zones,type KidsProfile,type KidsZone} from '../lib/kids/domain';
import {decodeCache,reconcile,snapshot,generation as parseGeneration,savedEntry,type Entries,type JourneyCache} from '../lib/kids/cache';
import {observedMilestones,trails,type Destination} from '../lib/kids/journeys';
import styles from './KidsJourney.module.css';
type Status='local'|'loading'|'saving'|'saved'|'offline'|'conflict';
type Journey={ar:boolean;userId?:string;scope:string;gameKey:string;generation:number;ready:boolean;entries:Entries;set:(zone:KidsZone,fn:(previous:unknown)=>unknown)=>void;profiles:KidsProfile[];active:KidsProfile|null;select:(id:string)=>void;reload:()=>void;retry:()=>void;reset:()=>Promise<void>;exportData:()=>void;resolve:(zone:KidsZone,device:boolean)=>void;error:string;status:Status;profileError:boolean;notice:string;navigation:{scope:string;destination:Destination;sequence:number}|null;navigate:(destination:Destination)=>void};
const Context=createContext<Journey|null>(null);
const legacy:Partial<Record<KidsZone,string>>={world:'ilama-world-stars-v2:',hub:'ilama-kids-hub-v1:',farm:'ilama-farm-v1:',egypt:'ilama-egypt-passport-v1:',discover:'ilama-discoveries-v2:',food:'ilama-discovery-v1:',quests:'ilama-quest-passport-v1:',kitchen:'ilama-kitchen-studio-v1:'};
const readCache=(key:string,userId?:string,childId?:string):JourneyCache=>{
 let raw:unknown;try{raw=JSON.parse(localStorage.getItem(key)||'null')}catch{}
 const cached=decodeCache(raw);
 if(!childId)for(const zone of zones){if(cached.entries[zone])continue;const oldKey=zone==='world'&&!userId?'ilama-world-stars-v1':legacy[zone]?legacy[zone]+(userId||'guest'):null;if(oldKey)try{const old=localStorage.getItem(oldKey);if(old)cached.entries[zone]={state:cleanState(zone,JSON.parse(old)),revision:0,pending:false}}catch{}}
 return cached;
};
async function request(url:string,init:RequestInit={},signal?:AbortSignal){
 const controller=new AbortController(),abort=()=>controller.abort();
 if(signal?.aborted)abort();else signal?.addEventListener('abort',abort,{once:true});
 const timer=window.setTimeout(abort,9000);
 try{return await fetch(url,{...init,signal:controller.signal,cache:'no-store'})}finally{clearTimeout(timer);signal?.removeEventListener('abort',abort)}
}
export function KidsJourneyProvider({ar,userId,children}:{ar:boolean;userId?:string;children:ReactNode}){
 const [profiles,setProfiles]=useState<KidsProfile[]>([]),[activeId,setActiveId]=useState(''),[profilesLoaded,setProfilesLoaded]=useState(!userId),[profileError,setProfileError]=useState(false),[reloadIndex,setReloadIndex]=useState(0);
 const [entries,setEntries]=useState<Entries>({}),[ready,setReady]=useState(false),[loadedScope,setLoadedScope]=useState(''),[status,setStatus]=useState<Status>('loading'),[retryIndex,setRetryIndex]=useState(0),[queueTick,setQueueTick]=useState(0);
 const [generation,setGeneration]=useState(0),[instance,setInstance]=useState(0),[storageAvailable,setStorageAvailable]=useState(true),[resetNotice,setResetNotice]=useState(false);
 const [navigation,setNavigation]=useState<Journey['navigation']>(null);
 const navigationSequence=useRef(0);
 const navigationFrame=useRef<number|null>(null);
 const active=profiles.find(p=>p.id===activeId)||null;
 const scope=(userId||'guest')+(active?':'+active.id:''),cacheKey='ilama-journey-v2:'+scope;
 useEffect(()=>{setNavigation(null)},[scope,generation,instance]);
 const epoch=useRef(0),inFlight=useRef(false),saveRequests=useRef(new Set<AbortController>()),currentScope=useRef(scope);currentScope.current=scope;
 const cancelSaves=()=>{saveRequests.current.forEach(c=>c.abort());saveRequests.current.clear();inFlight.current=false};
 useEffect(()=>{let alive=true;const controller=new AbortController();setProfilesLoaded(!userId);setProfiles([]);setActiveId('');setProfileError(false);
  if(!userId)return()=>{alive=false;controller.abort()};
  void request('/api/kids/profiles',{},controller.signal).then(async r=>{if(!r.ok)throw Error('profiles');const data=await r.json();if(!Array.isArray(data.profiles))throw Error('profiles');if(!alive)return;
   const items=data.profiles.filter((p:KidsProfile)=>p&&typeof p.id==='string'&&typeof p.nickname==='string');setProfiles(items);let selected:string|null=null;try{selected=localStorage.getItem('ilama-active-child:'+userId)}catch{}
   setActiveId(selected===''?'':items.some((p:KidsProfile)=>p.id===selected)?selected!:items[0]?.id||'');
  }).catch(()=>{if(alive)setProfileError(true)}).finally(()=>{if(alive)setProfilesLoaded(true)});
  return()=>{alive=false;controller.abort()};
 },[userId,reloadIndex]);
 useEffect(()=>{if(!profilesLoaded)return;const token=++epoch.current,controller=new AbortController();cancelSaves();setReady(false);setResetNotice(false);setStatus(active?'loading':'local');
  const loaded=readCache(cacheKey,userId,active?.id),knownGeneration=active?.progress_epoch??0;
  const cached=loaded.generation<knownGeneration?{generation:knownGeneration,entries:{}}:loaded;setEntries(cached.entries);setGeneration(cached.generation);
  if(!active){setLoadedScope(scope);setReady(true);
   if(userId)void request('/api/progress',{},controller.signal).then(async r=>{if(!r.ok)return;const data=await r.json();if(epoch.current!==token||!Array.isArray(data.progress))return;
    const stars=data.progress.filter((p:{completed?:boolean;game_key?:string})=>p.completed&&p.game_key?.startsWith('world:')).map((p:{game_key:string})=>p.game_key.slice(6));setEntries(old=>({...old,world:{state:mergeLearning('world',old.world?.state,stars),revision:0,pending:false}}));
   }).catch(()=>{});
   return()=>{epoch.current++;controller.abort();cancelSaves()};
  }
  void request('/api/kids/snapshots?childId='+encodeURIComponent(active.id),{},controller.signal).then(async r=>{
   if(r.status===404){if(epoch.current===token){try{localStorage.removeItem(cacheKey)}catch{}setEntries({});setReloadIndex(n=>n+1)}throw Error('removed')}
   if(!r.ok)throw Error('load');const data=await r.json();if(!Array.isArray(data.snapshots))throw Error('load');if(epoch.current!==token)return;
   const remoteGeneration=parseGeneration(data.generation??0);if(remoteGeneration<knownGeneration)throw Error('old generation');
   const next=reconcile(cached,remoteGeneration,data.snapshots);setGeneration(next.generation);setEntries(next.entries);setResetNotice(remoteGeneration>loaded.generation);setStatus('saved');
  }).catch(()=>{if(epoch.current===token)setStatus('offline')}).finally(()=>{if(epoch.current===token){setLoadedScope(scope);setReady(true)}});
  return()=>{epoch.current++;controller.abort();cancelSaves()};
 },[cacheKey,profilesLoaded,active?.id,userId,retryIndex]);
 useEffect(()=>{if(!ready||loadedScope!==scope)return;try{localStorage.setItem(cacheKey,JSON.stringify({...entries,_generation:generation}));setStorageAvailable(true)}catch{setStorageAvailable(false)}},[cacheKey,ready,loadedScope,scope,entries,generation]);
 useEffect(()=>{if(!active)return;const online=()=>setRetryIndex(n=>n+1);window.addEventListener('online',online);return()=>window.removeEventListener('online',online)},[active?.id]);
 useEffect(()=>{if(!ready||!active||status==='offline'||inFlight.current)return;const candidate=zones.find(z=>entries[z]?.pending&&!entries[z]?.conflict);if(!candidate)return;
  const token=epoch.current,childId=active.id,entry=entries[candidate]!;
  const timer=window.setTimeout(()=>{const controller=new AbortController();saveRequests.current.add(controller);inFlight.current=true;setStatus('saving');
   void request('/api/kids/snapshots',{method:'PUT',headers:{'Content-Type':'application/json'},body:JSON.stringify({childId,zone:candidate,state:entry.state,revision:entry.revision,generation})},controller.signal).then(async r=>{
    const data=await r.json();if(epoch.current!==token)return;
    if(r.status===409&&data.reset===true){parseGeneration(data.generation);try{localStorage.removeItem(cacheKey)}catch{}setReady(false);setInstance(n=>n+1);setRetryIndex(n=>n+1);return}
    if(r.status===404){try{localStorage.removeItem(cacheKey)}catch{}setEntries({});setReady(false);setReloadIndex(n=>n+1);return}
    if(r.status===409&&data.snapshot){const remote=snapshot(data.snapshot,candidate);setEntries(old=>{const current=old[candidate];if(!current)return old;const merged=mergeLearning(candidate,current.state,remote.state);return {...old,[candidate]:merged===null?{...current,conflict:remote}:{state:merged,revision:remote.revision,pending:true}}});setStatus('conflict');return}
    if(!r.ok||!data.snapshot)throw Error('save');const saved=snapshot(data.snapshot,candidate);
    if(saved.revision!==entry.revision+1)throw Error('revision');setEntries(old=>old[candidate]?{...old,[candidate]:savedEntry(old[candidate]!,entry,saved)}:old);setStatus('saved');
   }).catch(()=>{if(epoch.current===token)setStatus('offline')}).finally(()=>{saveRequests.current.delete(controller);if(epoch.current===token){inFlight.current=false;setQueueTick(n=>n+1)}});
  },600);return()=>clearTimeout(timer);
 },[entries,ready,active?.id,status,ar,generation,queueTick,cacheKey]);
 const setterEpoch=epoch.current;
 const set=useCallback((zone:KidsZone,fn:(previous:unknown)=>unknown)=>{if(!ready||loadedScope!==scope||currentScope.current!==scope||epoch.current!==setterEpoch)return;
  setEntries(old=>{if(currentScope.current!==scope||epoch.current!==setterEpoch)return old;const current=old[zone],state=cleanState(zone,fn(current?.state));if(JSON.stringify(state)===JSON.stringify(current?.state))return old;return {...old,[zone]:{state,revision:current?.revision||0,pending:!!active,conflict:current?.conflict}}});
 },[ready,loadedScope,scope,active?.id,setterEpoch]);
 useEffect(()=>{if(!ready||loadedScope!==scope)return;const states=Object.fromEntries(zones.map(z=>[z,entries[z]?.state]));const observed=observedMilestones(states);const hub=cleanState('hub',entries.hub?.state) as {milestones:string[]};if(observed.some(id=>!hub.milestones.includes(id)))set('hub',previous=>({...cleanState('hub',previous) as object,milestones:[...hub.milestones,...observed]}))},[ready,loadedScope,scope,entries,set]);
 const select=useCallback((id:string)=>{if(!profiles.some(p=>p.id===id)&&id!=='')return;setActiveId(id);try{localStorage.setItem('ilama-active-child:'+userId,id)}catch{}},[profiles,userId]);
 const reset=useCallback(async()=>{if(!active||!ready)throw Error('No active profile');const token=++epoch.current;cancelSaves();setReady(false);setInstance(n=>n+1);
  try{const r=await request('/api/kids/snapshots',{method:'DELETE',headers:{'Content-Type':'application/json'},body:JSON.stringify({childId:active.id,confirm:true})});if(!r.ok)throw Error('reset');const data=await r.json(),next=parseGeneration(data.generation);if(epoch.current!==token)return;
   if(next<=generation)throw Error('old reset');setGeneration(next);setProfiles(old=>old.map(p=>p.id===active.id?{...p,progress_epoch:next}:p));setEntries({});setResetNotice(false);setStatus('saved');try{localStorage.removeItem(cacheKey)}catch{}
  }catch(error){if(epoch.current===token)setStatus('offline');throw error}finally{if(epoch.current===token)setReady(true)}
 },[active?.id,ready,generation,cacheKey]);
 const resolve=useCallback((zone:KidsZone,device:boolean)=>{setStatus('saved');setEntries(old=>{const e=old[zone];if(!e?.conflict)return old;return {...old,[zone]:{state:device?e.state:e.conflict.state,revision:e.conflict.revision,pending:device}}})},[]);
 const exportData=useCallback(()=>{const data={format:'ilama-learning/v1',exportedAt:new Date().toISOString(),profile:active?{id:active.id,nickname:active.nickname,ageBand:active.age_band}:null,generation,source:'current device journey',progress:Object.fromEntries(zones.filter(z=>entries[z]).map(z=>[z,{state:cleanState(z,entries[z]!.state),revision:entries[z]!.revision,pending:entries[z]!.pending}]))};const url=URL.createObjectURL(new Blob([JSON.stringify(data,null,2)],{type:'application/json'}));const a=document.createElement('a');a.href=url;a.download='ilama-learning-'+new Date().toISOString().slice(0,10)+'.json';document.body.appendChild(a);a.click();a.remove();window.setTimeout(()=>URL.revokeObjectURL(url),1000)},[active,generation,entries]);
 const navigate=useCallback((destination:Destination)=>{if(!ready||loadedScope!==scope)return;setNavigation({scope,destination,sequence:++navigationSequence.current});if(destination.hub)set('hub',previous=>{const p=cleanState('hub',previous) as {zone:string;visited:string[]};return {...p,zone:destination.hub,visited:[...p.visited,destination.hub!]}});if(navigationFrame.current!==null)cancelAnimationFrame(navigationFrame.current);navigationFrame.current=requestAnimationFrame(()=>{navigationFrame.current=null;if(currentScope.current!==scope)return;const target=document.getElementById(destination.anchor);target?.scrollIntoView({behavior:matchMedia('(prefers-reduced-motion: reduce)').matches?'auto':'smooth',block:'start'});if(target){target.tabIndex=-1;target.focus({preventScroll:true})}})},[ready,loadedScope,scope,set]);
 useEffect(()=>()=>{if(navigationFrame.current!==null)cancelAnimationFrame(navigationFrame.current)},[scope]);
 const effectiveStatus:Status=!ready||loadedScope!==scope?'loading':status==='offline'?'offline':Object.values(entries).some(e=>e?.conflict)?'conflict':active&&Object.values(entries).some(e=>e?.pending)?'saving':active?'saved':'local';
 const error=!storageAvailable?(ar?'التخزين على الجهاز غير متاح. حافظ على الصفحة مفتوحة أثناء اللعب.':'Device storage is unavailable. Keep this page open while playing.'):'';
 const notice=resetNotice?(ar?'بدأ ولي الأمر رحلة جديدة على جهاز آخر. تم احترام حذف التقدم القديم.':'A guardian started a fresh journey on another device. Older progress stays deleted.'):'';
 const value=useMemo(()=>({ar,userId,scope,gameKey:scope+':'+generation+':'+instance,generation,ready:ready&&loadedScope===scope,entries:loadedScope===scope?entries:{},set,profiles,active,select,reload:()=>setReloadIndex(n=>n+1),retry:()=>setRetryIndex(n=>n+1),reset,exportData,resolve,error,status:effectiveStatus,profileError,notice,navigation,navigate}),[ar,userId,scope,generation,instance,ready,loadedScope,entries,set,profiles,active,select,reset,exportData,resolve,error,effectiveStatus,profileError,notice,navigation,navigate]);
 return <Context.Provider value={value}>{children}</Context.Provider>;
}
export function useKidsJourney(){const value=useContext(Context);if(!value)throw Error('KidsJourneyProvider is required');return value}
export function useAdventureState<T>(zone:KidsZone,initial:T):[T,Dispatch<SetStateAction<T>>,boolean]{
 const journey=useKidsJourney();const value=(journey.ready?(journey.entries[zone]?.state??initial):initial) as T;
 const set:Dispatch<SetStateAction<T>>=useCallback(next=>journey.set(zone,previous=>typeof next==='function'?(next as (v:T)=>T)((previous??initial) as T):next),[journey.set,zone]);
 return [value,set,journey.ready];
}
export function KidsJourneyToolbar(){
 const j=useKidsJourney(),ar=j.ar;const [editing,setEditing]=useState(false),[editId,setEditId]=useState<string|undefined>(undefined),[nickname,setNickname]=useState(''),[ageBand,setAgeBand]=useState('8-12'),[consent,setConsent]=useState(false),[busy,setBusy]=useState(false),[message,setMessage]=useState(''),[deleting,setDeleting]=useState(false),[resetting,setResetting]=useState(false);
 const t=(a:string,b:string)=>ar?a:b;
 useEffect(()=>{setEditing(false);setDeleting(false);setResetting(false);setMessage('')},[j.scope]);
 const save=async()=>{setBusy(true);setMessage('');try{const r=await request('/api/kids/profiles',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({id:editId,nickname,ageBand,consent})});if(!r.ok)throw Error('save');const data=await r.json();try{localStorage.setItem('ilama-active-child:'+j.userId,data.profile.id)}catch{}setEditing(false);setNickname('');setConsent(false);j.reload()}catch{setMessage(t('تعذر حفظ ملف التعلّم. راجع الاتصال وحاول مرة أخرى.','Could not save the learning profile. Check your connection and retry.'))}finally{setBusy(false)}};
 const remove=async()=>{if(!j.active)return;setBusy(true);try{const r=await request('/api/kids/profiles',{method:'DELETE',headers:{'Content-Type':'application/json'},body:JSON.stringify({id:j.active.id})});if(!r.ok)throw Error('delete');try{localStorage.removeItem('ilama-journey-v2:'+j.scope);localStorage.removeItem('ilama-active-child:'+j.userId)}catch{}setDeleting(false);j.reload()}catch{setMessage(t('تعذر الحذف. لم نمسح تقدمك على الجهاز.','Deletion failed. Your device progress was kept.'))}finally{setBusy(false)}};
 const statuses={local:t('اللعب والحفظ على هذا الجهاز.','Play and save on this device.'),loading:t('تحميل رحلتك…','Loading your journey…'),saving:t('جارٍ حفظ الاكتشافات…','Saving discoveries…'),saved:t('التقدم محفوظ في ملف التعلّم.','Progress saved in the learning profile.'),offline:t('تقدر تكمل اللعب هنا؛ المزامنة غير متاحة حاليًا.','You can keep playing here; synchronization is currently unavailable.'),conflict:t('هناك تقدم مختلف على جهاز آخر.','Another device has different progress.')};
 return <section id="kids-family-space" className={styles.panel} aria-label={t('مساحة رحلة الأسرة','Family journey space')}>
 <div className={styles.top}><h2>{t('🌿 رحلة تخص كل طفل','🌿 A journey for each child')}</h2><a href={'/parent?lang='+(ar?'ar':'en')}>{t('مساحة الأهل','For parents')}</a></div>
 <p>{t('اسم مستعار وفئة عمرية فقط. لا صور شخصية ولا تاريخ ميلاد ولا بيانات عن الجسم.','A nickname and age band only. No profile photo, birth date or body measurements.')}</p>
 {j.userId?<div className={styles.tools}><label>{t('ملف التعلّم','Learning profile')} <select aria-label={t('اختار ملف الطفل','Choose child profile')} value={j.active?.id||''} disabled={!j.ready||busy} onChange={e=>j.select(e.target.value)}><option value="">{t('رحلة الحساب الحالية على الجهاز','Current account journey on this device')}</option>{j.profiles.map(p=><option key={p.id} value={p.id}>{p.nickname}</option>)}</select></label><button type="button" disabled={busy||j.profileError||j.profiles.length>=5} onClick={()=>{setEditId(undefined);setNickname("");setAgeBand('8-12');setEditing(v=>!v);setConsent(false)}} aria-expanded={editing}>{t('إضافة ملف طفل','Add child profile')}</button>{j.active&&<button type="button" disabled={busy} onClick={()=>{setEditId(j.active!.id);setNickname(j.active!.nickname);setAgeBand(j.active!.age_band);setConsent(false);setEditing(true)}}>{t('تعديل الملف','Edit profile')}</button>}{j.active&&<button type="button" disabled={busy} className={styles.danger} onClick={()=>setDeleting(v=>!v)} aria-expanded={deleting}>{t('حذف هذا الملف','Delete this profile')}</button>}</div>:<p><a href={'/auth/sign-in?next=%2Fkids&lang='+(ar?'ar':'en')}>{t('دخول ولي الأمر للحفظ بين الأجهزة','Guardian sign-in to save across devices')}</a></p>}
 {j.profileError&&<div className={styles.notice}><p>{t('ملفات الأسرة غير متاحة مؤقتًا؛ رحلة الجهاز ما زالت متاحة.','Family profiles are temporarily unavailable; the device journey is still available.')}</p><button type="button" onClick={j.reload}>{t('إعادة تحميل الملفات','Reload profiles')}</button></div>}
 <p role="status" aria-live="polite" className={styles.status}>{statuses[j.status]} {j.error}</p>{j.notice&&<p role="status" className={styles.notice}>{j.notice}</p>}
 {j.status==='offline'&&<button type="button" onClick={j.retry}>{t('حاول المزامنة مرة أخرى','Retry sync')}</button>}
 {j.active&&<div className={styles.guardianTools}><p>{t('أدوات ولي الأمر: نسخة التصدير تشمل تقدم الجهاز والتعديلات التي لم تُزامن بعد.','Guardian tools: an export includes this device’s progress and any edits awaiting sync.')}</p><div className={styles.tools}><button type="button" disabled={!j.ready||busy} onClick={()=>{try{j.exportData();setMessage(t('جهّزنا ملف الاكتشافات للتنزيل.','Your discovery file is ready to download.'))}catch{setMessage(t('تعذر تجهيز الملف للتنزيل.','Could not prepare the download.'))}}}>{t('تصدير اكتشافات هذا الطفل','Export this child’s discoveries')}</button><button type="button" disabled={!j.ready||busy} onClick={j.retry}>{t('راجع التقدم المحفوظ','Check saved progress')}</button><button type="button" disabled={!j.ready||busy} aria-expanded={resetting} onClick={()=>setResetting(v=>!v)}>{t('بداية جديدة لهذه الرحلة','Start a fresh journey')}</button></div></div>}
 {resetting&&<div className={styles.notice}><p>{t('سيتم مسح اكتشافات هذا الطفل ومحصوله وأفكار وصفاته من الحساب. ملف الطفل يفضل موجودًا. دي بداية جديدة باختيار ولي الأمر، مش عقاب. الأجهزة الأخرى تحترم المسح عند المزامنة.','This clears this child’s discoveries, harvest and meal ideas from the account, while keeping their profile. A fresh start is a guardian choice, never a punishment. Other devices respect the reset when synchronizing.')}</p><div className={styles.tools}><button type="button" disabled={busy||!j.ready} onClick={async()=>{setBusy(true);try{await j.reset();setResetting(false);setMessage(t('رحلة جديدة جاهزة. تقدر تبدأ من أي مكان.','A fresh journey is ready. Start anywhere you like.'))}catch{setMessage(t('تعذر تأكيد البداية الجديدة. راجع التقدم المحفوظ قبل المحاولة مرة أخرى.','Could not confirm the fresh start. Check saved progress before retrying.'))}finally{setBusy(false)}}}>{t('تأكيد البداية الجديدة','Confirm fresh start')}</button><button type="button" disabled={busy} onClick={()=>setResetting(false)}>{t('إلغاء','Cancel')}</button></div></div>}
 {editing&&<form onSubmit={e=>{e.preventDefault();void save()}} className={styles.form}><label>{t('اسم مستعار','Nickname')}<input required maxLength={40} value={nickname} onChange={e=>setNickname(e.target.value)} autoComplete="off"/></label><label>{t('الفئة العمرية','Age band')}<select value={ageBand} onChange={e=>setAgeBand(e.target.value)}><option value="under-8">{t('أقل من ٨','Under 8')}</option><option value="8-12">{t('٨–١٢','8–12')}</option><option value="13-17">{t('١٣–١٧','13–17')}</option></select></label><label className={styles.consent}><input required type="checkbox" checked={consent} onChange={e=>setConsent(e.target.checked)}/><span>{t('أنا ولي الأمر وأوافق على حفظ ملف التعلّم والتقدم بصورة خاصة.','I am the guardian and consent to private learning profile and progress storage.')}</span></label><button className={styles.primary} disabled={busy||!consent||!nickname.trim()}>{busy?t('جارٍ الحفظ…','Saving…'):editId?t('احفظ تعديل الملف','Save profile changes'):t('احفظ الملف الجديد','Save new profile')}</button></form>}
 {deleting&&<div className={styles.notice}><p>{t('سيتم حذف ملف الطفل وكل تقدم المغامرات المحفوظ في هذا الملف من الحساب والجهاز الحالي. لا يمكن التراجع عن الحذف.','This deletes this child profile and its adventure progress from the account and this device. Deletion cannot be undone.')}</p><div className={styles.tools}><button type="button" disabled={busy} className={styles.danger} onClick={remove}>{t('تأكيد حذف الملف والتقدم','Confirm profile and progress deletion')}</button><button type="button" onClick={()=>setDeleting(false)}>{t('إلغاء','Cancel')}</button></div></div>}
 {zones.filter(z=>j.entries[z]?.conflict).map(zone=><div key={zone} className={styles.conflict}><p>{t('اكتشفنا اختلافًا في تقدم نشاط. اختار النسخة التي تريد الاحتفاظ بها.','An activity has different saved progress. Choose which version to keep.')}</p><div className={styles.tools}><button type="button" onClick={()=>j.resolve(zone,false)}>{t('استخدم النسخة المحفوظة في الحساب','Use the account version')}</button><button type="button" onClick={()=>j.resolve(zone,true)}>{t('احتفظ بنسخة هذا الجهاز','Keep this device version')}</button></div></div>)}
 {message&&<p role="status">{message}</p>}
 </section>;
}
export function KidsParentSummary(){
 const j=useKidsJourney(),ar=j.ar;
 const hub=cleanState('hub',j.entries.hub?.state) as {milestones:string[]};
 return <section className={styles.panel} aria-label={ar?'ملخص الاكتشافات':'Discovery summary'}><h2>{ar?'الاكتشافات، بدون مقارنة':'Discoveries, without comparison'}</h2><p>{ar?'التقدم يسجل الأنشطة، وليس تقييم الطفل أو صحته.':'Progress records activities, not a rating of a child or their health.'}</p><div className={styles.summary}>{[{zone:'egypt',ar:'محطات مصر',en:'Egypt stops'},{zone:'aqua',ar:'أنواع السمك',en:'Fish discoveries'},{zone:'movement',ar:'مغامرات الحركة',en:'Movement adventures'},{zone:'food',ar:'رحلات الطعام',en:'Food journeys'},{zone:'discover',ar:'علوم وطبيعة',en:'Science and nature'},{zone:'kitchen',ar:'أفكار وجبات',en:'Meal ideas'}].map(x=>{const state=j.entries[x.zone as KidsZone]?.state;return <article key={x.zone}><h3>{ar?x.ar:x.en}</h3><p>{j.ready?(Array.isArray(state)?state.length:0):'…'} {ar?'اكتشافات':'discoveries'}</p></article>})}</div><h3>{ar?'حكايات الرحلة':'Journey stories'}</h3><ul className={styles.parentTrails}>{trails.map(trail=><li key={trail.id}>{ar?trail.ar:trail.en}: {trail.steps.filter(s=>hub.milestones.includes(s.id)).length} / {trail.steps.length} {ar?'خطوات اكتشاف':'discovery steps'}</li>)}</ul><p>{ar?'خدوا وقتكم. مفيش متابعة يومية مطلوبة، ولا ترتيب بين الأطفال.':'Take your time. No daily check-in or ranking between children.'}</p><p><a href={'/kids?lang='+(ar?'ar':'en')}>{ar?'العودة للعب ←':'Return to adventures →'}</a></p></section>;
}
export function KidsJourneyTrails(){
 const j=useKidsJourney(),ar=j.ar;
 const hub=cleanState('hub',j.entries.hub?.state) as {milestones:string[]};
 return <section className={styles.panel} aria-label={ar?'مسارات اكتشاف اختيارية':'Optional discovery trails'}><h2>{ar?'🎒 اختار حكاية لرحلتك':'🎒 Choose a story for your journey'}</h2><p>{ar?'كل خطوة بتتذكر نشاط عملته فعلًا. مفيش ترتيب إجباري، وتقدر تبدأ أو توقف في أي وقت.':'Each step remembers an activity you actually explored. There’s no required order. Start or stop anytime.'}</p><div className={styles.mission}>{trails.map(trail=>{
  const completed=trail.steps.filter(step=>hub.milestones.includes(step.id)).length,next=trail.steps.find(step=>!hub.milestones.includes(step.id));
  return <article key={trail.id} className={styles.trailCard} data-trail={trail.id}><h3>{trail.icon} {ar?trail.ar:trail.en}</h3><p className={styles.trailCount}>{j.ready?completed:'…'} / {trail.steps.length} {ar?'خطوات اكتشاف':'discovery steps'}</p><ol>{trail.steps.map(step=><li key={step.id}><button type="button" disabled={!j.ready} data-milestone={step.id} aria-label={(ar?step.ar:step.en)+(hub.milestones.includes(step.id)?(ar?'، اكتشاف محفوظ':', discovery saved'):'')} onClick={()=>j.navigate(step.destination)}><span aria-hidden="true">{hub.milestones.includes(step.id)?'✓':'○'}</span> {ar?step.ar:step.en}</button></li>)}</ol>{next?<button type="button" disabled={!j.ready} className={styles.primary} onClick={()=>j.navigate(next.destination)}>{ar?'كمل الحكاية لو حابب ←':'Continue the story if you like →'}</button>:<p className={styles.trailDone}>{ar?'حكاية جميلة اكتملت! خد راحة أو ارجع لأي نشاط براحتك.':'A lovely story complete! Rest or revisit any activity at your own pace.'}</p>}</article>;
 })}</div></section>;
}
