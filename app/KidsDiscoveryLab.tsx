"use client";
import {useEffect,useState,type CSSProperties} from "react";

type Age="3-5"|"6-8"|"9-12";
type Item={icon:string;ar:string;en:string;origin:"plant"|"animal";whyAr:string;whyEn:string};
const items:Item[]=[
{icon:"🍅",ar:"طماطم",en:"Tomato",origin:"plant",whyAr:"الطماطم بتنمو على نبات.",whyEn:"Tomatoes grow on plants."},
{icon:"🥚",ar:"بيض",en:"Egg",origin:"animal",whyAr:"البيض من الدجاج.",whyEn:"Eggs can come from chickens."},
{icon:"🍞",ar:"عيش",en:"Bread",origin:"plant",whyAr:"الدقيق ممكن يتعمل من القمح.",whyEn:"Bread can be made from wheat flour."},
{icon:"🐟",ar:"سمك",en:"Fish",origin:"animal",whyAr:"السمك مصدر غذائي حيواني.",whyEn:"Fish are animal-source foods."},
{icon:"🥕",ar:"جزر",en:"Carrot",origin:"plant",whyAr:"الجزر جذر نبات بنأكله.",whyEn:"Carrots are edible plant roots."},
{icon:"🥛",ar:"لبن",en:"Milk",origin:"animal",whyAr:"اللبن البقري مصدره الأبقار.",whyEn:"Cow's milk comes from cows."}
];
const steps=[{icon:"🏞️",ar:"المياه العذبة",en:"Freshwater habitat"},{icon:"🧺",ar:"سوق السمك",en:"Fish market"},{icon:"🍳",ar:"شخص بالغ يجهز ويطبخ بأمان",en:"Adult prepares and cooks safely"},{icon:"🍽️",ar:"مائدة الأسرة",en:"Family table"}];
const button:CSSProperties={border:"2px solid #699476",background:"#fffdf5",color:"#284d39",padding:"12px 15px",minHeight:48,borderRadius:14,fontWeight:700,cursor:"pointer"};
export default function KidsDiscoveryLab({ar,userId}:{ar:boolean;userId?:string}){
 const [age,setAge]=useState<Age>("6-8"),[game,setGame]=useState<"origins"|"river">("origins"),[index,setIndex]=useState(0),[message,setMessage]=useState(""),[done,setDone]=useState(false),[stamps,setStamps]=useState<string[]>([]),[loaded,setLoaded]=useState<string|null>(null);
 const key="ilama-discovery-v1:"+(userId||"guest");
 const t=(a:string,b:string)=>ar?a:b;
 useEffect(()=>{try{const x:unknown=JSON.parse(localStorage.getItem(key)||"[]");setStamps(Array.isArray(x)?x.filter((v):v is string=>v==="origins"||v==="river").slice(0,2):[])}catch{setStamps([])}setLoaded(key)},[key]);
 useEffect(()=>{if(loaded===key)try{localStorage.setItem(key,JSON.stringify(stamps))}catch{}},[loaded,key,stamps]);
 const total=game==="river"?4:age==="3-5"?3:age==="6-8"?5:6;
 const finish=()=>{setDone(true);setMessage(t("اكتشاف جميل! تقدر تاخد راحة دلوقتي 🌿","Lovely discovery! You can take a break now 🌿"));setStamps(old=>old.includes(game)?old:[...old,game])};
 const next=(fact:string)=>{if(index+1>=total)finish();else{setIndex(i=>i+1);setMessage(fact)}};
 const choose=(value:string)=>{if(done)return;if(game==="origins"){const x=items[index];if(value===x.origin)next(t(x.whyAr,x.whyEn));else setMessage(t("تخمين لطيف، جرّب تاني من غير أي عقوبة.","Nice guess. Try again; no penalties."))}else if(value===String(index))next(t("تمام! نكمل رحلة الغذاء.","Great! Let's continue the food journey."));else setMessage(t("الخطوة دي جاية بعدين. اختار اللي قبلها.","That step comes later. Choose an earlier step."))};
 const reset=(id:"origins"|"river")=>{setGame(id);setIndex(0);setDone(false);setMessage("")};
 return <section dir={ar?"rtl":"ltr"} aria-label={t("معمل إيلاما للتغذية والطبيعة","Ilama food and nature lab")} style={{background:"#f2f3dc",padding:"clamp(14px,3vw,28px)",borderRadius:24,margin:"28px 0",color:"#284d39"}}>
 <h2 style={{fontSize:"clamp(25px,4vw,40px)"}}>{t("🔎 معمل اكتشافات إيلاما","🔎 Ilama's Discovery Lab")}</h2>
 <p>{t("تعلم باللعب، من غير درجات أو مؤقت أو مقارنة بين الأطفال.","Learn by playing, without grades, timers or comparisons.")}</p>
 <div style={{display:"flex",gap:8,flexWrap:"wrap",marginBottom:14}}>{(["3-5","6-8","9-12"] as Age[]).map(a=><button type="button" key={a} aria-pressed={age===a} style={{...button,background:age===a?"#396d52":"white",color:age===a?"white":"#284d39"}} onClick={()=>{setAge(a);setIndex(0);setDone(false);setMessage("")}}>{a} {t("سنوات","years")}</button>)}</div>
 <div style={{display:"flex",gap:10,flexWrap:"wrap",marginBottom:16}}><button type="button" style={{...button,background:game==="origins"?"#396d52":"white",color:game==="origins"?"white":"#284d39"}} onClick={()=>reset("origins")}>{t("🌾 منين بييجي الأكل؟","🌾 Where does food come from?")}{stamps.includes("origins")?" 🌟":""}</button><button type="button" style={{...button,background:game==="river"?"#396d52":"white",color:game==="river"?"white":"#284d39"}} onClick={()=>reset("river")}>{t("🐟 رحلة السمك","🐟 Fish food journey")}{stamps.includes("river")?" 🌟":""}</button></div>
 <div style={{background:"white",borderRadius:18,padding:20,minHeight:210}}><p>{t("الخطوة","Step")} {Math.min(index+1,total)} / {total}</p>
 {done?<div><h3>{t("🌟 خلصت المغامرة!","🌟 Adventure complete!")}</h3><p>{t("تقدر تكتفي بكده أو ترجع في أي وقت.","You can stop here or return whenever you like.")}</p><button type="button" style={button} onClick={()=>reset(game)}>{t("إعادة اختيارية","Replay (optional)")}</button></div>:game==="origins"?<div><h3 style={{fontSize:26}}>{items[index].icon} {t(items[index].ar,items[index].en)}</h3><p>{t("مصدره نبات ولا حيوان؟","Does it come from a plant or an animal?")}</p><div style={{display:"flex",gap:9,flexWrap:"wrap"}}><button type="button" style={button} onClick={()=>choose("plant")}>{t("🌱 نبات","🌱 Plant")}</button><button type="button" style={button} onClick={()=>choose("animal")}>{t("🐔 حيوان","🐔 Animal")}</button></div></div>:<div><h3>{t("رتّب رحلة البلطي من بيئته للمائدة","Sequence tilapia's journey from habitat to table")}</h3><p>{t("دي رحلة توضيحية. شراء السمك وتجهيزه وطهيه مسؤولية شخص بالغ.","This is an example. Buying, preparing and cooking fish are grown-up tasks.")}</p><div style={{display:"flex",gap:8,flexWrap:"wrap"}}>{steps.map((s,i)=><button type="button" key={i} disabled={i<index} style={{...button,opacity:i<index?0.5:1}} onClick={()=>choose(String(i))}>{i<index?"✓":s.icon} {t(s.ar,s.en)}</button>)}</div></div>}
 <p role="status" aria-live="polite" style={{minHeight:24,fontWeight:600}}>{message}</p></div>
 <p style={{fontSize:13}}>{t("🌿 الاكتشافات محفوظة على الجهاز فقط. مفيش إعلانات أو مكافآت مالية أو ضغط للاستمرار.","🌿 Discoveries are saved on this device only. No ads, financial rewards or pressure to continue.")}</p>
 </section>
}