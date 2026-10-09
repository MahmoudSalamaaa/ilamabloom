"use client";
import {useAdventureState} from "./KidsJourney";
import {useEffect,useRef,useState} from "react";
import {saveMealIdea,type MealIdea} from "../lib/kids/gameplay";
import styles from "./KidsKitchenStudio.module.css";
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
export default function KidsKitchenStudio({ar}:{ar:boolean;userId?:string}){
 const [basket,setBasket]=useState<string[]>([]),[step,setStep]=useState<"choose"|"safety"|"ready">("choose"),[safety,setSafety]=useState<string|null>(null),[message,setMessage]=useState(""),[clearing,setClearing]=useState(false);
 const [saved,setSaved,ready]=useAdventureState<MealIdea[]>("kitchen",[]);
 const heading=useRef<HTMLHeadingElement>(null),focusNext=useRef(false),finishing=useRef(false);
 const t=(a:string,b:string)=>ar?a:b;
 const chosen=foods.filter(f=>basket.includes(f.id)),groups=new Set(chosen.map(f=>f.group));
 useEffect(()=>{if(focusNext.current){heading.current?.focus({preventScroll:true});focusNext.current=false}},[step]);
 const changeStep=(next:typeof step)=>{focusNext.current=true;setStep(next);setMessage("")};
 const add=(id:string)=>{if(!ready||step!=="choose")return;setBasket(b=>b.includes(id)?b.filter(x=>x!==id):b.length<5?[...b,id]:b);setMessage("")};
 const finish=()=>{if(!ready||step!=="safety"||safety!=="adult"||!basket.length||finishing.current)return;finishing.current=true;setSaved(old=>saveMealIdea(old,basket,Date.now()));focusNext.current=true;setStep("ready");setMessage(t("جهزت فكرة وجبة متنوعة! التحضير الحقيقي مع شخص بالغ.","You created a varied meal idea! Real preparation is for a grown-up."))};
 const edit=(ingredients:string[])=>{finishing.current=false;setBasket(ingredients);setSafety(null);setClearing(false);changeStep("choose")};
 return <section id="kids-kitchen-studio" dir={ar?"rtl":"ltr"} aria-label={t("استوديو مطبخ تيتا","Grandma's kitchen studio")} className={styles.studio}>
 <header className={styles.header}><div><h2>{t("🍲 استوديو مطبخ تيتا","🍲 Grandma's Kitchen Studio")}</h2><p>{t("كوّن طبقك بطريقتك، واكتشف مكونات مختلفة. مفيش أكل شرير أو طبق واحد صح لكل الناس.","Build a meal idea your way and explore ingredients. No food shaming or one-size-fits-all plate.")}</p></div><img src="/kids/grandma.webp" alt="" loading="lazy" width={100} height={100}/></header>
 <ol className={styles.steps} aria-label={t("مراحل فكرة الوجبة","Meal idea steps")}>{[["choose",t("اختار مكوناتك","Choose ingredients")],["safety",t("جهّز بأمان","Prepare safely")],["ready",t("فكرتك جاهزة","Your idea is ready")]].map(([id,label],i)=><li key={id} aria-current={step===id?"step":undefined}><span aria-hidden="true">{i+1}</span> {label}</li>)}</ol>
 <div className={styles.ingredients} role="group" aria-label={t("مكونات فكرة الوجبة","Meal idea ingredients")}>{foods.map(f=><button type="button" key={f.id} onClick={()=>add(f.id)} disabled={!ready||step!=="choose"||(!basket.includes(f.id)&&basket.length>=5)} aria-pressed={basket.includes(f.id)}><span aria-hidden="true" className={styles.foodIcon}>{f.icon}</span>{t(f.ar,f.en)}</button>)}</div>
 <article className={styles.plate} aria-busy={!ready}>
 <h3 ref={step==="choose"?heading:undefined} tabIndex={-1}>{t("طبقي","My plate")}</h3>
 {chosen.length?<ul className={styles.selected}>{chosen.map(f=><li key={f.id}><span aria-hidden="true">{f.icon}</span> {t(f.ar,f.en)}</li>)}</ul>:<p className={styles.empty}><span aria-hidden="true">🍽️</span> {t("اختار مكونًا لبدء فكرتك.","Choose an ingredient to start your idea.")}</p>}
 <p role="status">{t("المكونات","Ingredients")}: {chosen.length}/5 · {t("مجموعات غذائية متنوعة","Different food groups")}: {groups.size}{basket.length===5?" · "+t("لتجربة مكون جديد، اختار مكونًا موجودًا لإزالته أولًا.","To try a new ingredient, select one already chosen to remove it first."):""}</p>
 <div className={styles.notes}>{chosen.map(f=><p key={f.id}>🌿 {t(f.noteAr,f.noteEn)}</p>)}</div>
 {step==="choose"&&<div><p>{groups.size>=3?t("اكتشفت ثلاث مجموعات غذائية أو أكثر. جميل!","You explored three or more food groups. Lovely!"):t("ممكن تجرب مكونات من مجموعات مختلفة لو تحب.","You can try ingredients from different groups if you like.")}</p><button type="button" disabled={!ready||!basket.length} onClick={()=>{changeStep("safety");setSafety(null)}} className={styles.primary}>{t("نكمل وصفتي","Continue my recipe")}</button></div>}
 {step==="safety"&&<div><h4 ref={heading} tabIndex={-1}>{t("قبل ما نجهز الأكل الحقيقي، مين مسؤول عن النار والسكينة والسمك النيّ؟","Before real cooking, who handles heat, knives and raw fish?")}</h4><div className={styles.actions}><button type="button" onClick={()=>setSafety("adult")} aria-pressed={safety==="adult"}>{t("شخص بالغ","A grown-up")}</button><button type="button" onClick={()=>setSafety("alone")} aria-pressed={safety==="alone"}>{t("الطفل لوحده","A child alone")}</button></div><p role="status">{safety==="adult"?t("صحيح! شخص بالغ يتولى التحضير الآمن.","Yes! A grown-up handles safe preparation."):safety?t("المطبخ فيه أدوات وسخونة تحتاج إشراف شخص بالغ.","Kitchen tools and heat require adult supervision."):""}</p><div className={styles.actions}><button type="button" disabled={!ready||safety!=="adult"} onClick={finish} className={styles.primary}>{t("احفظ فكرتي","Save my meal idea")}</button><button type="button" onClick={()=>edit(basket)}>{t("ارجع للمكونات","Back to ingredients")}</button></div></div>}
 {step==="ready"&&<div><h4 ref={heading} tabIndex={-1}>{t("فكرتك جاهزة 🌿","Your idea is ready 🌿")}</h4><p role="status">{message}</p><p>{t("فكرة للعب والتعلم؛ مش لازم تجهزها أو تتذوقها. اختيارات الأسرة والحساسية مهمة.","A play and learning idea; you do not have to prepare or taste it. Family choices and allergies matter.")}</p><button type="button" onClick={()=>edit([])}>{t("اعمل طبق تاني","Create another plate")}</button></div>}
 </article>
 {saved.length>0&&<div className={styles.saved}><h3>{t("أفكاري السابقة","My previous ideas")}</h3><p>{t("آخر ٨ أفكار محفوظة. افتح أي فكرة لتجربة تغييرها.","The latest 8 ideas are saved. Open any idea to try a change.")}</p><div className={styles.ideaGrid}>{saved.map((idea,i)=><button type="button" key={idea.id+"-"+i} disabled={!ready} onClick={()=>edit(idea.ingredients)}><span aria-hidden="true" className={styles.savedIcons}>{idea.ingredients.map(id=>foods.find(f=>f.id===id)?.icon).join(" ")}</span><strong>{idea.ingredients.map(id=>{const f=foods.find(f=>f.id===id);return f?t(f.ar,f.en):""}).join(ar?"، ":", ")}</strong><span>{t("افتح","Open")}</span></button>)}</div><button type="button" disabled={!ready} onClick={()=>setClearing(v=>!v)} aria-expanded={clearing}>{t("امسح أفكاري المحفوظة","Clear saved ideas")}</button>{clearing&&<div className={styles.confirm}><p>{t("هل تريد مسح أفكار الوجبات المحفوظة فقط؟ اكتشافاتك الأخرى تفضل موجودة.","Clear just the saved meal ideas? Your other discoveries will remain.")}</p><div className={styles.actions}><button type="button" disabled={!ready} onClick={()=>{setSaved([]);setClearing(false);setMessage(t("تم مسح أفكار الوجبات المحفوظة.","Saved meal ideas cleared."))}}>{t("تأكيد مسح الأفكار","Confirm clearing ideas")}</button><button type="button" onClick={()=>setClearing(false)}>{t("إلغاء","Cancel")}</button></div></div>}</div>}
 {step!=="ready"&&message&&<p role="status">{message}</p>}
 <p className={styles.privacy}>{t("الأفكار مرتبطة برحلة التعلم المختارة، ولا تُستخدم في توصيات طبية أو إعلانات.","Ideas belong to this learning journey and are not used for medical recommendations or advertising.")}</p>
 </section>;
}
