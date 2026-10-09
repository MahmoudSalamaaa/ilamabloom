"use client";
import {useCallback,useEffect,useState} from "react";
import {useAdventureState,useKidsJourney} from "./KidsJourney";
import FarmWorld from "./FarmWorld";
import EgyptAdventures from "./EgyptAdventures";
import AquaWorld from "./AquaWorld";
import DiscoveryLab from "./DiscoveryLab";
import MoveAdventures from "./MoveAdventures";
type Zone="farm"|"egypt"|"aqua"|"discover"|"move";
type Entry={id:Zone;icon:string;ar:string;en:string;summaryAr:string;summaryEn:string};
const entries:Entry[]=[
{id:"farm",icon:"🌱",ar:"المزرعة",en:"Farm",summaryAr:"ازرع واسقِ واحصد",summaryEn:"Plant, water and harvest"},
{id:"egypt",icon:"🗺️",ar:"مغامرات مصر",en:"Egypt Adventures",summaryAr:"اكتشف محافظات مصر",summaryEn:"Discover Egyptian governorates"},
{id:"aqua",icon:"🐟",ar:"عالم المياه",en:"Aqua World",summaryAr:"اكتشف الأسماك وبيئاتها",summaryEn:"Explore fish habitats"},
{id:"discover",icon:"🔬",ar:"معمل الاكتشافات",en:"Discovery Lab",summaryAr:"علوم وغذاء وتحديات",summaryEn:"Food and science challenges"},
{id:"move",icon:"💃",ar:"مغامرات الحركة",en:"Move Adventures",summaryAr:"اتحرك والعب بطريقتك",summaryEn:"Move and play your way"}
];
const valid=(s:string):s is Zone=>entries.some(e=>e.id===s);
export default function KidsAdventureHub({ar,userId}:{ar:boolean;userId?:string}){
const journey=useKidsJourney();
const [passport,setPassport,ready]=useAdventureState<{zone:Zone;visited:Zone[];achievements:Zone[]}>("hub",{zone:"farm",visited:[],achievements:[]});
const {zone,visited,achievements}=passport;
const choose=(z:Zone)=>{if(!ready)return;setPassport(p=>({...p,zone:z,visited:p.visited.includes(z)?p.visited:[...p.visited,z]}))};
const complete=useCallback((id:Zone)=>setPassport(p=>p.achievements.includes(id)?p:{...p,achievements:[...p.achievements,id]}),[setPassport]);
const active=entries.find(e=>e.id===zone)!;
return <section id="kids-adventure-hub" dir={ar?"rtl":"ltr"} aria-label={ar?"عالم مغامرات إيلاما":"ILAMA adventure world"} style={{margin:"32px 0",padding:"clamp(12px,3vw,30px)",borderRadius:28,background:"#f7f3e9",color:"#294b3c"}}>
<div style={{display:"flex",alignItems:"center",gap:15,flexWrap:"wrap"}}>
<div style={{flex:"1 1 260px"}}><p style={{letterSpacing:2,fontSize:12,fontWeight:700}}>{ar?"عالم واحد · مغامرات مختلفة":"ONE WORLD · MANY ADVENTURES"}</p><h2 style={{fontSize:"clamp(28px,4vw,46px)",margin:"6px 0"}}>{ar?"🌍 عالم إيلاما التفاعلي":"🌍 ILAMA Adventure World"}</h2><p>{ar?"اختار وجهتك واستكشف براحتك. مفيش عقوبات ولا سباق.":"Choose a destination and explore at your own pace. No races or penalties."}</p></div>
<img src="/kids/ilama.webp" alt="" loading="lazy" style={{width:105,height:105,objectFit:"contain"}}/>
</div>
<nav aria-label={ar?"أماكن عالم إيلاما":"Adventure destinations"} style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(140px,1fr))",gap:10,margin:"20px 0"}}>
{entries.map(e=><button key={e.id} type="button" aria-current={zone===e.id?"page":undefined} onClick={()=>choose(e.id)} style={{textAlign:ar?"right":"left",borderRadius:18,padding:"14px 12px",minHeight:108,border:zone===e.id?"3px solid #41795c":"2px solid #c9d6c4",background:zone===e.id?"#e3f1e5":"white",color:"#294b3c",cursor:"pointer"}}>
<span aria-hidden="true" style={{fontSize:30,display:"block"}}>{e.icon}</span><strong style={{display:"block",margin:"4px 0"}}>{ar?e.ar:e.en} {visited.includes(e.id)?"✓":""}</strong><small>{ar?e.summaryAr:e.summaryEn}</small></button>)}</nav>
<nav aria-label={ar?"مغامرات مكملة":"More adventures"} style={{display:"flex",flexWrap:"wrap",gap:12,margin:"16px 0"}}>
{[{id:"kids-food-discovery",ar:"🍎 اكتشاف الطعام",en:"🍎 Food Discovery"},{id:"kids-weather-lab",ar:"🌦️ معمل الطقس",en:"🌦️ Weather Lab"},{id:"kids-quest-trail",ar:"📖 مسار المهام",en:"📖 Quests"},{id:"kids-kitchen-studio",ar:"🍲 استوديو المطبخ",en:"🍲 Kitchen Studio"}].map(item=><a key={item.id} href={"#"+item.id} style={{padding:"12px 16px",border:"2px solid #41795c",borderRadius:14,background:"white",color:"#294b3c"}}>{ar?item.ar:item.en}</a>)}
</nav>
<div aria-live="polite" style={{display:"flex",justifyContent:"space-between",gap:12,flexWrap:"wrap",margin:"12px 0"}}>
<strong>{active.icon} {ar?active.ar:active.en}</strong>
<span>{ar?"أماكن اكتشفتها: ":"Destinations explored: "}{visited.length}/{entries.length}</span>
</div>
<div id={"kids-zone-"+zone} role="region" aria-label={ar?active.ar:active.en}>
{zone==="farm"&&<FarmWorld ar={ar} userId={userId} onComplete={()=>complete("farm")}/>}
{zone==="egypt"&&<EgyptAdventures ar={ar} userId={userId} onComplete={()=>complete("egypt")}/>}
{zone==="aqua"&&<AquaWorld ar={ar} onComplete={()=>complete("aqua")}/>}
{zone==="discover"&&<DiscoveryLab ar={ar} userId={userId} onComplete={()=>complete("discover")}/>}
{zone==="move"&&<MoveAdventures ar={ar} onComplete={()=>complete("move")}/>}
</div>
<div aria-label={ar?"دفتر إنجازات المغامرات":"Adventure achievement passport"} role="group" style={{padding:16,background:"#e3f1e5",borderRadius:18,marginTop:18}}><h3>{ar?"🌟 دفتر اكتشافاتك":"🌟 Your discovery passport"}</h3><p>{ar?"الإنجازات تذكّرنا بما اكتشفناه. كل الأماكن مفتوحة، وتقدر تعيد أي نشاط بدون نقاط إضافية.":"Achievements remember your discoveries. Every destination stays open; replay freely without extra points."}</p><ul>{entries.map(entry=><li key={entry.id}>{achievements.includes(entry.id)?"🌟":"🌱"} {ar?entry.ar:entry.en} — {achievements.includes(entry.id)?(ar?"اكتشاف محفوظ":"Discovery saved"):(ar?"استكشف وقت ما تحب":"Explore whenever you like")}</li>)}</ul></div>
<div style={{display:"flex",gap:10,alignItems:"center",flexWrap:"wrap",marginTop:20}}>
<button type="button" onClick={()=>choose(entries[(entries.findIndex(e=>e.id===zone)+1)%entries.length].id)} style={{border:0,borderRadius:16,background:"#396c50",color:"white",padding:"13px 20px",cursor:"pointer"}}>{ar?"المغامرة التالية ←":"Next adventure →"}</button>
<span style={{fontSize:12}}>{ar?"تقدر توقف في أي وقت. كل ملف طفل له رحلته الخاصة.":"Take a break anytime. Each child profile has its own journey."}</span>
</div>
</section>
}