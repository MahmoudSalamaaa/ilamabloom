"use client";
import {useEffect,useState} from "react";
type Food={id:string;icon:string;ar:string;en:string;group:"veg"|"fruit"|"grain"|"protein"|"dairy";noteAr:string;noteEn:string};
const foods:Food[]=[
 {id:"tomato",icon:"🍅",ar:"طماطم",en:"Tomato",group:"veg",noteAr:"الطماطم من الخضروات المستخدمة في الطبخ.",noteEn:"Tomatoes are commonly used as vegetables in cooking."},
 {id:"carrot",icon:"🥕",ar:"جزر",en:"Carrot",group:"veg",noteAr:"الجزر من الجذور الصالحة للأكل.",noteEn:"Carrots are edible roots."},
 {id:"cucumber",icon:"🥒",ar:"خيار",en:"Cucumber",group:"veg",noteAr:"الخيار غني بالماء.",noteEn:"Cucumbers contain lots of water."},
 {id:"apple",icon:"🍎",ar:"تفاح",en:"Apple",group:"fruit",noteAr:"التفاح فاكهة تؤكل بطرق مختلفة.",noteEn:"Apples are fruits enjoyed in different ways."},
 {id:"banana",icon:"🍌",ar:"موز",en:"Banana",group:"fruit",noteAr:"الموز من الفاكهة التي توفر الطاقة.",noteEn:"Bananas are fruits that provide energy."},
 {id:"orange",icon:"🍊",ar:"برتقال",en:"Orange",group:"fruit",noteAr:"البرتقال يحتوي على فيتامين ج.",noteEn:"Oranges provide vitamin C."},
 {id:"bread",icon:"🍞",ar:"عيش",en:"Bread",group:"grain",noteAr:"العيش ممكن يتعمل من دقيق القمح.",noteEn:"Bread can be made from wheat flour."},
 {id:"rice",icon:"🍚",ar:"أرز",en:"Rice",group:"grain",noteAr:"الأرز من الحبوب التي تؤكل في بلاد كثيرة.",noteEn:"Rice is a grain eaten in many countries."},
 {id:"lentils",icon:"🫘",ar:"عدس",en:"Lentils",group:"protein",noteAr:"العدس من البقوليات ويوفر بروتينًا نباتيًا.",noteEn:"Lentils are legumes that provide plant protein."},
 {id:"egg",icon:"🥚",ar:"بيض",en:"Egg",group:"protein",noteAr:"البيض مصدر للبروتين ويجب طهيه جيدًا.",noteEn:"Eggs provide protein and should be cooked safely."},
 {id:"fish",icon:"🐟",ar:"سمك",en:"Fish",group:"protein",noteAr:"السمك يوفر بروتينًا؛ تختلف عناصره حسب النوع.",noteEn:"Fish provides protein; nutrients vary by species."},
 {id:"yogurt",icon:"🥛",ar:"زبادي",en:"Yogurt",group:"dairy",noteAr:"الزبادي من منتجات اللبن.",noteEn:"Yogurt is a dairy food."}
];
type Saved={id:number;ingredients:string[]};
const keyFor=(id?:string)=>"ilama-kitchen-studio-v1:"+(id||"guest");
const valid=(v:unknown):Saved[]=>Array.isArray(v)?v.slice(-8).filter((x):x is Saved=>!!x&&typeof x==="object"&&typeof x.id==="number"&&Array.isArray(x.ingredients)).map(x=>({id:x.id,ingredients:x.ingredients.filter(y=>typeof y==="string"&&foods.some(f=>f.id===y)).slice(0,5)})):[];
export default function KidsKitchenStudio({ar,userId}:{ar:boolean;userId?:string}){
 const [basket,setBasket]=useState<string[]>([]),[saved,setSaved]=useState<Saved[]>([]),[loaded,setLoaded]=useState<string|null>(null),[step,setStep]=useState<"choose"|"safety"|"ready">("choose"),[safety,setSafety]=useState<string|null>(null),[message,setMessage]=useState("");
 const key=keyFor(userId),t=(a:string,b:string)=>ar?a:b;
 useEffect(()=>{try{setSaved(valid(JSON.parse(localStorage.getItem(key)||"[]")))}catch{setSaved([])}setBasket([]);setStep("choose");setSafety(null);setLoaded(key)},[key]);
 useEffect(()=>{if(loaded===key)try{localStorage.setItem(key,JSON.stringify(saved))}catch{}},[loaded,key,saved]);
 const chosen=foods.filter(f=>basket.includes(f.id));const groups=new Set(chosen.map(f=>f.group));
 const add=(id:string)=>{setBasket(b=>b.includes(id)?b.filter(x=>x!==id):b.length<5?[...b,id]:b);setMessage("")};
 const finish=()=>{if(safety!=="adult")return;setSaved(old=>[...old,{id:Date.now(),ingredients:basket}].slice(-8));setStep("ready");setMessage(t("جهزت فكرة وجبة متنوعة! التحضير الحقيقي مع شخص بالغ.","You created a varied meal idea! Real preparation is for a grown-up."))};
 return <section id="kids-kitchen-studio" dir={ar?"rtl":"ltr"} aria-label={t("استوديو مطبخ تيتا","Grandma's kitchen studio")} style={{margin:"28px 0",padding:"clamp(14px,3vw,30px)",borderRadius:24,background:"#fff1e8",color:"#4d3a32"}}>
 <h2 style={{fontSize:"clamp(25px,4vw,40px)",margin:"0 0 8px"}}>{t("🍲 استوديو مطبخ تيتا","🍲 Grandma's Kitchen Studio")}</h2>
 <p>{t("كوّن طبقك بطريقتك، واكتشف مكونات مختلفة. مفيش أكل شرير أو طبق واحد صح لكل الناس.","Build a meal idea your way and explore ingredients. No food shaming or one-size-fits-all plate.")}</p>
 <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(125px,1fr))",gap:9}}>{foods.map(f=><button type="button" key={f.id} onClick={()=>add(f.id)} disabled={step!=="choose"||(!basket.includes(f.id)&&basket.length>=5)} aria-pressed={basket.includes(f.id)} style={{borderRadius:15,border:basket.includes(f.id)?"3px solid #ae674f":"1px solid #cfb49d",background:basket.includes(f.id)?"#fbe0c8":"#fff",padding:13,fontSize:16,cursor:"pointer",opacity:step!=="choose"?0.65:1}}><span aria-hidden="true" style={{fontSize:27}}>{f.icon}</span><br/>{t(f.ar,f.en)}</button>)}</div>
 <div style={{background:"#fff",borderRadius:18,padding:18,marginTop:16}}>
 <h3>{t("طبقي","My plate")}</h3><div aria-live="polite" style={{fontSize:34,minHeight:60}}>{chosen.length?chosen.map(f=><span key={f.id} title={t(f.ar,f.en)} style={{marginInlineEnd:9}}>{f.icon}</span>):"🍽️"}</div>
 <p>{t("المكونات","Ingredients")}: {chosen.length}/5 · {t("مجموعات غذائية متنوعة","Different food groups")}: {groups.size}</p>
 {chosen.map(f=><p key={f.id} style={{fontSize:13,margin:"5px 0"}}>🌿 {t(f.noteAr,f.noteEn)}</p>)}
 {step==="choose"&&<div><p>{groups.size>=3?t("اكتشفت ثلاث مجموعات غذائية أو أكثر. جميل!","You explored three or more food groups. Lovely!"):t("ممكن تجرب مكونات من مجموعات مختلفة لو تحب.","You can try ingredients from different groups if you like.")}</p><button type="button" disabled={!basket.length} onClick={()=>{setStep("safety");setSafety(null)}} style={{padding:13,borderRadius:12,background:"#9a624e",color:"white",border:0,fontWeight:700}}>{t("نكمل وصفتي","Continue my recipe")}</button></div>}
 {step==="safety"&&<div><h4>{t("قبل ما نجهز الأكل الحقيقي، مين مسؤول عن النار والسكينة والسمك النيّ؟","Before real cooking, who handles heat, knives and raw fish?")}</h4><div style={{display:"flex",flexWrap:"wrap",gap:10}}><button type="button" onClick={()=>setSafety("adult")} aria-pressed={safety==="adult"} style={{padding:12,borderRadius:12,background:"#e2f0dd",border:"1px solid #89a883"}}>{t("شخص بالغ","A grown-up")}</button><button type="button" onClick={()=>setSafety("alone")} aria-pressed={safety==="alone"} style={{padding:12,borderRadius:12,background:"#fff",border:"1px solid #c3aaa2"}}>{t("الطفل لوحده","A child alone")}</button></div><p role="status">{safety==="adult"?t("صحيح! شخص بالغ يتولى التحضير الآمن.","Yes! A grown-up handles safe preparation."):safety?t("المطبخ فيه أدوات وسخونة تحتاج إشراف شخص بالغ.","Kitchen tools and heat require adult supervision."):""}</p><button type="button" disabled={safety!=="adult"} onClick={finish} style={{padding:12,borderRadius:12,background:"#9a624e",color:"white",border:0}}>{t("احفظ فكرتي","Save my meal idea")}</button></div>}
 {step==="ready"&&<div role="status"><p>{message}</p><button type="button" onClick={()=>{setBasket([]);setStep("choose");setSafety(null);setMessage("")}} style={{padding:12,borderRadius:12,background:"#e8eedb",border:"1px solid #8da477"}}>{t("اعمل طبق تاني","Create another plate")}</button></div>}
 </div>
 {saved.length>0&&<div><h3>{t("أفكاري السابقة","My previous ideas")}</h3><div style={{display:"flex",gap:10,flexWrap:"wrap"}}>{saved.map((s,i)=><button type="button" key={s.id+"-"+i} onClick={()=>{setBasket(s.ingredients);setStep("choose");setSafety(null)}} style={{border:"1px solid #d6b5a2",background:"#fff",padding:13,borderRadius:14}}>{s.ingredients.map(id=>foods.find(f=>f.id===id)?.icon).join(" ")} <span style={{fontSize:12}}>{t("افتح","Open")}</span></button>)}</div><button type="button" onClick={()=>setSaved([])} style={{marginTop:10,padding:8,background:"transparent",border:"1px solid #bba69e",borderRadius:9}}>{t("امسح أفكاري المحفوظة","Clear saved ideas")}</button></div>}
 <small>{t("الأفكار محفوظة محليًا على جهازك، ولا تُستخدم في توصيات طبية أو إعلانات.","Ideas stay on this device, and are not used for medical recommendations or advertising.")}</small>
 </section>
}