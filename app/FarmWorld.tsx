"use client";
import {useEffect,useState} from "react";
type L={en:string;ar:string};
type Crop={id:string;icon:string;name:L;steps:number};
const crops:Crop[]=[
{id:"tomato",icon:"🍅",name:{en:"Tomato",ar:"طماطم"},steps:3},
{id:"carrot",icon:"🥕",name:{en:"Carrot",ar:"جزر"},steps:2},
{id:"lettuce",icon:"🥬",name:{en:"Lettuce",ar:"خس"},steps:2}
];
type Plot={crop:string;water:number};
type Farm={plots:(Plot|null)[];harvest:Record<string,number>;visits:number};
const initial:Farm={plots:[null,null,null,null,null,null],harvest:{},visits:0};
const safe=(value:unknown):Farm=>{if(!value||typeof value!=="object")return initial;const x=value as Partial<Farm>;return {plots:Array.isArray(x.plots)?Array.from({length:6},(_,i)=>{const p=x.plots?.[i];return p&&typeof p.crop==="string"&&crops.some(c=>c.id===p.crop)?{crop:p.crop,water:Math.min(3,Math.max(0,Number(p.water)||0))}:null}):initial.plots,harvest:x.harvest&&typeof x.harvest==="object"?Object.fromEntries(crops.map(c=>[c.id,Math.max(0,Math.min(999,Number(x.harvest?.[c.id])||0))])):{},visits:Math.max(0,Math.min(999,Number(x.visits)||0))}};
export default function FarmWorld({ar,userId}:{ar:boolean;userId?:string}){
 const [farm,setFarm]=useState<Farm>(initial);
 const [ready,setReady]=useState(false);
 const [crop,setCrop]=useState("tomato");
 const [message,setMessage]=useState("");
 const [zone,setZone]=useState<"field"|"pond"|"kitchen">("field");
 const key="ilama-farm-v1:"+(userId||"guest");
 const t=(x:L)=>ar?x.ar:x.en;
 useEffect(()=>{try{setFarm(safe(JSON.parse(localStorage.getItem(key)||"null")))}catch{setFarm(initial)}setReady(true)},[key]);
 useEffect(()=>{if(ready)try{localStorage.setItem(key,JSON.stringify(farm))}catch{}},[farm,key,ready]);
 const change=(i:number)=>{const selected=crops.find(c=>c.id===crop)!;const p=farm.plots[i];if(!p){setFarm(f=>({...f,plots:f.plots.map((v,j)=>j===i?{crop,water:0}:v)}));setMessage(t({en:"A seed is planted. Water it to grow!",ar:"زرعنا بذرة! اسقيها علشان تكبر."}));return}
 const item=crops.find(c=>c.id===p.crop)!;
 if(p.water>=item.steps){setFarm(f=>({...f,plots:f.plots.map((v,j)=>j===i?null:v),harvest:{...f.harvest,[p.crop]:(f.harvest[p.crop]||0)+1}}));setMessage(t({en:"Harvest collected! Visit Grandma's kitchen.",ar:"جمعنا المحصول! يلا مطبخ تيتا."}));return}
 setFarm(f=>({...f,plots:f.plots.map((v,j)=>j===i&&v?{...v,water:Math.min(item.steps,v.water+1)}:v)}));setMessage(t({en:"Great! Water helps plants grow.",ar:"جميل! المياه بتساعد النبات يكبر."}))};
 return <section dir={ar?"rtl":"ltr"} aria-label={t({en:"Explore Grandpa and Grandma's interactive farm",ar:"استكشف مزرعة جدو وتيتا التفاعلية"})} style={{background:"#f5f5df",borderRadius:24,padding:"clamp(12px,3vw,28px)",margin:"24px 0",color:"#294638"}}>
 <h2 style={{fontSize:"clamp(25px,4vw,42px)",margin:"0 0 8px"}}>{t({en:"Explore the living farm",ar:"اكتشف المزرعة الحية"})}</h2>
 <p>{t({en:"Choose a place on the map. Your plants grow when you care for them.",ar:"اختار مكان من الخريطة. زرعك بيكبر لما تهتم بيه."})}</p>
 <div style={{display:"flex",gap:8,flexWrap:"wrap",margin:"12px 0"}}>{(["field","pond","kitchen"] as const).map(z=><button key={z} type="button" onClick={()=>setZone(z)} aria-pressed={zone===z} style={{border:"2px solid #507a5b",background:zone===z?"#376d53":"#fff",color:zone===z?"white":"#23452f",borderRadius:20,padding:"10px 18px",cursor:"pointer",fontWeight:700}}>{z==="field"?t({en:"🌱 Garden",ar:"🌱 الحديقة"}):z==="pond"?t({en:"🐟 Fish pond",ar:"🐟 بحيرة السمك"}):t({en:"🍲 Grandma's kitchen",ar:"🍲 مطبخ تيتا"})}</button>)}</div>
 <svg viewBox="0 0 700 290" role="img" aria-label={t({en:"Illustrated farm with garden, fish pond and farmhouse",ar:"رسم تفاعلي للمزرعة والحديقة والبحيرة والبيت"})} style={{width:"100%",borderRadius:20,background:"#c9e9de"}}>
 <rect x="0" y="176" width="700" height="114" fill="#8fc782"/><path d="M0 235 Q175 198 350 235 T700 230 V290 H0Z" fill="#7ab76e"/>
 <ellipse cx="535" cy="208" rx="134" ry="57" fill="#6ac1d5" stroke="#4b9cb5" strokeWidth="5"/><path d="M466 203 q18 -17 34 0 q-16 17 -34 0 m34 0 l12 -10 v20z" fill="#efb65a"/><path d="M565 218 q20 -17 36 0 q-16 17 -36 0 m36 0 l12 -10 v20z" fill="#f6d17d"/>
 <rect x="54" y="129" width="165" height="115" rx="6" fill="#f5d7a5"/><path d="M38 134 L135 53 L236 134Z" fill="#b8685b"/><rect x="119" y="179" width="44" height="65" rx="4" fill="#865a43"/><rect x="70" y="155" width="32" height="30" fill="#a5d9e6"/>
 <rect x="253" y="173" width="147" height="85" rx="13" fill="#996a49"/>{[0,1,2].map(i=><g key={i}><path d={`M${278+i*46} 208 l0 -23`} stroke="#416d39" strokeWidth="6"/><circle cx={278+i*46} cy="182" r="13" fill="#dc755a"/></g>)}
 <g fill="#4c915a">{[27,240,411,673].map((x,i)=><g key={i}><rect x={x} y="127" width="10" height="73" fill="#76543e"/><circle cx={x+5} cy="118" r="30"/></g>)}</g>
 <text x="133" y="267" textAnchor="middle" fontSize="17" fill="#274b35">🏠</text><text x="328" y="276" textAnchor="middle" fontSize="17">🌱</text><text x="540" y="283" textAnchor="middle" fontSize="17">🐟</text>
 </svg>
 {zone==="field"?<div><h3>{t({en:"Grow your own garden",ar:"ازرع حديقتك بنفسك"})}</h3><div style={{display:"flex",gap:8,flexWrap:"wrap",marginBottom:12}}>{crops.map(c=><button key={c.id} onClick={()=>setCrop(c.id)} aria-pressed={crop===c.id} style={{padding:10,borderRadius:12,border:crop===c.id?"3px solid #376d53":"1px solid #aaa",background:"white"}}>{c.icon} {t(c.name)}</button>)}</div><div style={{display:"grid",gridTemplateColumns:"repeat(3,minmax(0,1fr))",gap:10}}>{farm.plots.map((p,i)=>{const item=crops.find(c=>c.id===p?.crop);return <button key={i} onClick={()=>change(i)} style={{minHeight:96,border:"2px solid #a57b51",borderRadius:15,background:"#d9bd92",color:"#3b3124",fontSize:19,cursor:"pointer"}} aria-label={p? t({en:`Plot ${i+1}, ${item?.name.en}, watered ${p.water} times. Tap to water or harvest.`,ar:`حوض ${i+1}، ${item?.name.ar}، تم الري ${p.water} مرات. اضغط للري أو الحصاد.`}):t({en:`Empty plot ${i+1}, tap to plant`,ar:`حوض فارغ ${i+1}، اضغط للزراعة`})}>{p?(p.water>=(item?.steps||3)?item?.icon:p.water===0?"🌱":"🌿"):"➕"}<div style={{fontSize:13}}>{!p?t({en:"Plant",ar:"ازرع"}):p.water>=(item?.steps||3)?t({en:"Harvest!",ar:"احصد!"}):t({en:"Water 💧",ar:"اسقِ 💧"})}</div></button>})}</div></div>:zone==="pond"?<div><h3>{t({en:"The fish pond",ar:"بحيرة السمك"})}</h3><p>{t({en:"Fish need clean water and a suitable habitat. Explore the Nile's freshwater fish and learn about food without harming animals.",ar:"السمك محتاج مياه نظيفة وبيئة مناسبة. اكتشف أسماك النيل واتعلم عن الغذاء واحترام الحيوانات."})}</p><button onClick={()=>{setFarm(f=>({...f,visits:f.visits+1}));setMessage(t({en:"You discovered Nile tilapia: a familiar source of protein in Egypt.",ar:"اكتشفت البلطي النيلي: من مصادر البروتين المعروفة في مصر."}))}} style={{padding:14,borderRadius:14,background:"#e5f6ff",border:"2px solid #579db0"}}>🐟 {t({en:"Discover a fish",ar:"اكتشف سمكة"})}</button></div>:<div><h3>{t({en:"Grandma's kitchen",ar:"مطبخ تيتا"})}</h3><p>{t({en:"Your garden harvest",ar:"محصول حديقتك"})}</p><div style={{display:"flex",gap:15,flexWrap:"wrap"}}>{crops.map(c=><span key={c.id}>{c.icon} {t(c.name)}: {farm.harvest[c.id]||0}</span>)}</div><p>{t({en:"Foods give us different nutrients. Explore variety, not good or bad food labels.",ar:"الأطعمة بتوفر عناصر غذائية متنوعة. بنكتشف التنوع من غير ما نقول أكل كويس وأكل وحش."})}</p></div>}
 <p role="status" aria-live="polite" style={{minHeight:25,fontWeight:700}}>{message}</p>
 <small>{t({en:"No penalties. Take a break whenever you like. Progress saves on this device.",ar:"مفيش عقوبات. خد راحة وقت ما تحب. التقدم بيتحفظ على الجهاز ده."})}</small>
 </section>
}