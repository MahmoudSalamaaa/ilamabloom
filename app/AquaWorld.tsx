"use client";
import {useState} from "react";
const species=[
{id:"tilapia",ar:"البلطي النيلي",en:"Nile tilapia",home:"river",arFact:"سمكة مياه عذبة ومصدر للبروتين.",enFact:"A freshwater fish and a source of protein."},
{id:"catfish",ar:"القرموط",en:"Catfish",home:"river",arFact:"يعيش في المياه العذبة.",enFact:"Lives in freshwater."},
{id:"sardine",ar:"السردين",en:"Sardine",home:"sea",arFact:"من الأسماك الدهنية التي قد توفر أوميجا ٣.",enFact:"An oily fish that can provide omega-3."},
{id:"mullet",ar:"البوري",en:"Mullet",home:"sea",arFact:"يعيش في مياه ساحلية وبعض المياه قليلة الملوحة.",enFact:"Lives in coastal and some brackish waters."}
];
export default function AquaWorld({ar}:{ar:boolean}){
const [home,setHome]=useState("river");const [picked,setPicked]=useState<string|null>(null);const [found,setFound]=useState<string[]>([]);
const t=(a:string,b:string)=>ar?a:b;
return <section dir={ar?"rtl":"ltr"} style={{background:"#e5f5f5",color:"#174758",padding:"clamp(12px,3vw,28px)",borderRadius:24,margin:"24px 0"}}>
<h2>{t("🐟 عالم الأسماك","🐟 Aqua World")}</h2><p>{t("اكتشف أسماك النيل والبحر وما يميزها.","Discover fish from the Nile and the sea.")}</p>
<div style={{display:"flex",gap:10,flexWrap:"wrap"}}>{["river","sea"].map(h=><button key={h} type="button" aria-pressed={home===h} onClick={()=>{setHome(h);setPicked(null)}} style={{padding:12,borderRadius:15,background:home===h?"#226c82":"white",color:home===h?"white":"#174758",border:"2px solid #226c82"}}>{h==="river"?t("🏞️ النيل","🏞️ Nile"):t("🌊 البحر","🌊 Sea")}</button>)}</div>
<div style={{background:"linear-gradient(#b4e8e9,#4b9bb6)",padding:22,marginTop:14,borderRadius:22,display:"grid",gridTemplateColumns:"repeat(2,minmax(0,1fr))",gap:12}}>
{species.filter(f=>f.home===home).map(f=><button type="button" key={f.id} onClick={()=>{setPicked(f.id);setFound(a=>a.includes(f.id)?a:[...a,f.id])}} style={{background:"#ffffffe8",border:"2px solid #fff",borderRadius:20,padding:20,minHeight:115,fontSize:17,color:"#174758"}}><span style={{display:"block",fontSize:38}}>🐟</span>{t(f.ar,f.en)}</button>)}</div>
<div role="status" aria-live="polite" style={{background:"white",padding:16,borderRadius:15,marginTop:12,minHeight:75}}>{picked?species.filter(f=>f.id===picked).map(f=><p key={f.id}>{t(f.arFact,f.enFact)}</p>):t("اختار سمكة علشان تعرف حكايتها.","Choose a fish to learn its story.")}</div>
<p>{t("اكتشافاتك: ","Your discoveries: ")}{found.length}/{species.length}</p><small>{t("الأسماك تختلف في محتوى أوميجا ٣ وفيتامين د. التحضير والطهي يكون بمساعدة شخص بالغ.","Fish vary in omega-3 and vitamin D. Preparation and cooking require adult supervision.")}</small>
</section>
}