"use client";
import {useAdventureState,useKidsJourney} from "./KidsJourney";
import {useEffect,useRef,useState} from "react";

import styles from "./KidsDiscoveryLab.module.css";
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
export default function KidsDiscoveryLab({ar,userId}:{ar:boolean;userId?:string}){
 const [age,setAge]=useState<Age>("6-8"),[game,setGame]=useState<"origins"|"river">("origins"),[index,setIndex]=useState(0),[message,setMessage]=useState(""),[done,setDone]=useState(false);
 const journey=useKidsJourney();
 const heading=useRef<HTMLHeadingElement>(null),focusNext=useRef(false);
 const [stamps,setStamps,ready]=useAdventureState<string[]>("food",[]);
 const t=(a:string,b:string)=>ar?a:b;
 const total=game==="river"?4:age==="3-5"?3:age==="6-8"?5:6;
 const finish=(fact:string)=>{setDone(true);setMessage(fact+" "+t("اكتشاف جميل! تقدر تاخد راحة دلوقتي 🌿","Lovely discovery! You can take a break now 🌿"));setStamps(old=>old.includes(game)?old:[...old,game])};
 useEffect(()=>{if(focusNext.current){heading.current?.focus({preventScroll:true});focusNext.current=false}},[index,done]);
 useEffect(()=>{const nav=journey.navigation;if(nav?.scope===journey.scope&&nav.destination.food)reset(nav.destination.food)},[journey.navigation,journey.scope]);
 const next=(fact:string)=>{focusNext.current=true;if(index+1>=total)finish(fact);else{setIndex(i=>i+1);setMessage(fact)}};
 const choose=(value:string)=>{if(done||!ready)return;if(game==="origins"){const x=items[index];if(value===x.origin)next(t(x.whyAr,x.whyEn));else setMessage(t("تخمين لطيف، جرّب تاني من غير أي عقوبة.","Nice guess. Try again; no penalties."))}else if(value===String(index))next(t("تمام! نكمل رحلة الغذاء.","Great! Let's continue the food journey."));else setMessage(t("الخطوة دي جاية بعدين. اختار اللي قبلها.","That step comes later. Choose an earlier step."))};
 const reset=(id:"origins"|"river")=>{setGame(id);setIndex(0);setDone(false);setMessage("")};
 return <section id="kids-food-discovery" dir={ar?"rtl":"ltr"} aria-label={t("معمل إيلاما للتغذية والطبيعة","Ilama food and nature lab")} className={styles.lab}>
 <header className={styles.header}><div><h2>{t("🔎 معمل اكتشافات إيلاما","🔎 Ilama's Discovery Lab")}</h2><p>{t("تعلم باللعب، من غير درجات أو مؤقت أو مقارنة بين الأطفال.","Learn by playing, without grades, timers or comparisons.")}</p></div><img src="/kids/ilama.webp" alt="" loading="lazy" width={96} height={96}/></header>
 <div className={styles.actions} role="group" aria-label={t("اختار طول تجربة الطعام","Choose a food activity level")}>{(["3-5","6-8","9-12"] as Age[]).map(a=><button type="button" key={a} aria-pressed={age===a} onClick={()=>{setAge(a);setIndex(0);setDone(false);setMessage("")}}>{a} {t("سنوات","years")}</button>)}</div>
 <div className={styles.activities} role="group" aria-label={t("اختار اكتشافًا غذائيًا","Choose a food discovery")}><button type="button" aria-pressed={game==="origins"} onClick={()=>reset("origins")}><span aria-hidden="true">🌾</span> {t("منين بييجي الأكل؟","Where does food come from?")}{stamps.includes("origins")?" 🌟":""}</button><button type="button" aria-pressed={game==="river"} onClick={()=>reset("river")}><span aria-hidden="true">🐟</span> {t("رحلة السمك","Fish food journey")}{stamps.includes("river")?" 🌟":""}</button></div>
 <article className={styles.activity} aria-busy={!ready}><p className={styles.stepCount}>{t("الخطوة","Step")} {Math.min(index+1,total)} / {total}</p>
 {done?<div><h3 ref={heading} tabIndex={-1}>{t("🌟 خلصت المغامرة!","🌟 Adventure complete!")}</h3><p>{t("تقدر تكتفي بكده أو ترجع في أي وقت.","You can stop here or return whenever you like.")}</p><button type="button" onClick={()=>reset(game)}>{t("إعادة اختيارية","Replay (optional)")}</button></div>:game==="origins"?<div><h3 ref={heading} tabIndex={-1}><span aria-hidden="true" className={styles.foodIcon}>{items[index].icon}</span> {t(items[index].ar,items[index].en)}</h3><p>{t("مصدره نبات ولا حيوان؟","Does it come from a plant or an animal?")}</p><div className={styles.actions}><button type="button" disabled={!ready} onClick={()=>choose("plant")}>{t("🌱 نبات","🌱 Plant")}</button><button type="button" disabled={!ready} onClick={()=>choose("animal")}>{t("🐔 حيوان","🐔 Animal")}</button></div></div>:<div><h3 ref={heading} tabIndex={-1}>{t("رتّب رحلة البلطي من بيئته للمائدة","Sequence tilapia's journey from habitat to table")}</h3><p>{t("دي رحلة توضيحية. شراء السمك وتجهيزه وطهيه مسؤولية شخص بالغ.","This is an example. Buying, preparing and cooking fish are grown-up tasks.")}</p><ol className={styles.sequence}>{steps.map((s,i)=><li key={i}><button type="button" disabled={!ready||i<index} onClick={()=>choose(String(i))}><span aria-hidden="true">{i<index?"✓":s.icon}</span> {t(s.ar,s.en)}{i<index?<span className={styles.completed}>{t("خطوة اكتشفناها","Step explored")}</span>:null}</button></li>)}</ol></div>}
 <p role="status" aria-live="polite" className={styles.feedback}>{message}</p></article>
 <p className={styles.privacy}>{t("🌿 الاكتشافات تتبع رحلة التعلّم المختارة. مفيش إعلانات أو مكافآت مالية أو ضغط للاستمرار.","🌿 Discoveries belong to the selected learning journey. No ads, financial rewards or pressure to continue.")}</p>
 </section>;
}
