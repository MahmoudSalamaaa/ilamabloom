"use client";
import {useAdventureState,useKidsJourney} from "./KidsJourney";
import {useEffect,useState} from "react";
import {farmAction,type CropId} from "../lib/kids/gameplay";
import FarmCanvas from "./FarmCanvas";
import styles from "./FarmWorld.module.css";
type L={en:string;ar:string};
type Crop={id:string;icon:string;name:L;steps:number};
const crops:Crop[]=[
{id:"tomato",icon:"🍅",name:{en:"Tomato",ar:"طماطم"},steps:3},
{id:"carrot",icon:"🥕",name:{en:"Carrot",ar:"جزر"},steps:2},
{id:"lettuce",icon:"🥬",name:{en:"Lettuce",ar:"خس"},steps:2}
];
type Plot={crop:string;water:number};
type Farm={plots:(Plot|null)[];harvest:Record<string,number>;visits:number};
const fish:{name:L;habitat:"fresh"|"sea";fact:L}[]=[
 {name:{en:"Nile tilapia",ar:"البلطي النيلي"},habitat:"fresh",fact:{en:"Tilapia lives in freshwater. It is a familiar fish in Egypt.",ar:"البلطي بيعيش في المياه العذبة ومن الأسماك المعروفة في مصر."}},
 {name:{en:"Nile perch",ar:"قشر البياض النيلي"},habitat:"fresh",fact:{en:"Nile perch is a freshwater fish found in African lakes and rivers.",ar:"قشر البياض النيلي من أسماك المياه العذبة في البحيرات والأنهار الأفريقية."}},
 {name:{en:"Sardine",ar:"السردين"},habitat:"sea",fact:{en:"Sardines live in the sea; they are oily fish.",ar:"السردين بيعيش في البحر وهو من الأسماك الدهنية."}},
 {name:{en:"Mackerel",ar:"الماكريل"},habitat:"sea",fact:{en:"Mackerel is a marine fish. Nutrient amounts vary across species.",ar:"الماكريل من أسماك البحر، ومحتوى العناصر الغذائية بيختلف بين الأنواع."}}
];
const initial:Farm={plots:[null,null,null,null,null,null],harvest:{},visits:0};
export default function FarmWorld({ar,userId,onComplete}:{ar:boolean;userId?:string;onComplete?:()=>void}){
 const [farm,setFarm,ready]=useAdventureState<Farm>("farm",initial);
 const journey=useKidsJourney();const key=journey.scope,loadedKey=ready?key:null;
 const [fishIndex,setFishIndex]=useState(0),[fishChoice,setFishChoice]=useState<"fresh"|"sea"|null>(null),[plate,setPlate]=useState<string[]>([]),[crop,setCrop]=useState("tomato"),[message,setMessage]=useState(""),[zone,setZone]=useState<"field"|"pond"|"kitchen">("field");
 const t=(x:L)=>ar?x.ar:x.en;
 const change=(i:number)=>{if(loadedKey!==key)return;const plot=farm.plots[i];const harvesting=plot&&plot.water>=(crops.find(c=>c.id===plot.crop)?.steps||3);setFarm(current=>farmAction(current,{kind:"plot",plot:i,crop:crop as CropId}));
 if(harvesting){onComplete?.();setMessage(t({en:"Harvest collected! Visit Grandma's kitchen.",ar:"جمعنا المحصول! يلا مطبخ تيتا."}))}
 else setMessage(plot?t({en:"Great! Water helps plants grow.",ar:"جميل! المياه بتساعد النبات يكبر."}):t({en:"A seed is planted. Water it to grow!",ar:"زرعنا بذرة! اسقيها علشان تكبر."}));
 };
 return <section dir={ar?"rtl":"ltr"} aria-label={t({en:"Explore Grandpa and Grandma's interactive farm",ar:"استكشف مزرعة جدو وتيتا التفاعلية"})} className={styles.farm}>
 <h2>{t({en:"Explore the living farm",ar:"اكتشف المزرعة الحية"})}</h2>
 <p>{t({en:"Choose a place on the map. Your plants grow when you care for them.",ar:"اختار مكان من الخريطة. زرعك بيكبر لما تهتم بيه."})}</p>
 <div className={styles.tabs}>{(["field","pond","kitchen"] as const).map(z=><button key={z} type="button" onClick={()=>setZone(z)} aria-pressed={zone===z}>{z==="field"?t({en:"🌱 Garden",ar:"🌱 الحديقة"}):z==="pond"?t({en:"🐟 Fish pond",ar:"🐟 بحيرة السمك"}):t({en:"🍲 Grandma's kitchen",ar:"🍲 مطبخ تيتا"})}</button>)}</div>
 <FarmCanvas ar={ar} onZone={setZone} plots={farm.plots}/>
 {zone==="field"?<div><h3>{t({en:"Grow your own garden",ar:"ازرع حديقتك بنفسك"})}</h3><div className={styles.choices}>{crops.map(c=><button key={c.id} onClick={()=>setCrop(c.id)} aria-pressed={crop===c.id}>{c.icon} {t(c.name)}</button>)}</div><div className={styles.plots}>{farm.plots.map((p,i)=>{const item=crops.find(c=>c.id===p?.crop);return <button key={i} onClick={()=>change(i)} aria-label={p? t({en:`Plot ${i+1}, ${item?.name.en}, watered ${p.water} times. Tap to water or harvest.`,ar:`حوض ${i+1}، ${item?.name.ar}، تم الري ${p.water} مرات. اضغط للري أو الحصاد.`}):t({en:`Empty plot ${i+1}, tap to plant`,ar:`حوض فارغ ${i+1}، اضغط للزراعة`})}>{p?(p.water>=(item?.steps||3)?item?.icon:p.water===0?"🌱":"🌿"):"➕"}<div className={styles.detail}>{!p?t({en:"Plant",ar:"ازرع"}):p.water>=(item?.steps||3)?t({en:"Harvest!",ar:"احصد!"}):t({en:"Water 💧",ar:"اسقِ 💧"})}</div></button>})}</div></div>:zone==="pond"?<div><h3>{t({en:"The fish pond",ar:"بحيرة السمك"})}</h3><p>{t({en:"Fish need clean water and a suitable habitat. Explore the Nile's freshwater fish and learn about food without harming animals.",ar:"السمك محتاج مياه نظيفة وبيئة مناسبة. اكتشف أسماك النيل واتعلم عن الغذاء واحترام الحيوانات."})}</p><div className={styles.pond}><p>{t({en:"Where does this fish usually live?",ar:"السمكة دي بتعيش غالبًا فين؟"})}</p><h4>{t(fish[fishIndex].name)}</h4><div className={styles.choices}>{(["fresh","sea"] as const).map(h=><button key={h} type="button" onClick={()=>setFishChoice(h)} aria-pressed={fishChoice===h}>{h==="fresh"?t({en:"🏞️ Freshwater",ar:"🏞️ مياه عذبة"}):t({en:"🌊 Sea",ar:"🌊 بحر"})}</button>)}</div>{fishChoice&&<p role="status">{fishChoice===fish[fishIndex].habitat?t(fish[fishIndex].fact):t({en:"Good thinking! Try the other habitat.",ar:"تفكير جميل! جرب البيئة التانية."})}</p>}<button type="button" onClick={()=>{setFishIndex(i=>(i+1)%fish.length);setFishChoice(null)}} className={styles.next}>{t({en:"Explore another fish →",ar:"اكتشف سمكة تانية ←"})}</button><p className={styles.detail}>{t({en:"Fish can provide protein. Omega-3 and vitamin D amounts vary by species. A grown-up should prepare and cook fish safely.",ar:"السمك ممكن يوفر بروتين. كميات أوميجا ٣ وفيتامين د بتختلف حسب النوع. لازم شخص بالغ يجهز السمك ويطبخه بأمان."})}</p></div></div>:<div><h3>{t({en:"Grandma's kitchen",ar:"مطبخ تيتا"})}</h3><p>{t({en:"Your garden harvest — make a colorful vegetable side dish",ar:"محصول حديقتك — حضّر طبق خضار ملون"})}</p><div className={styles.choices}>{crops.map(c=><button type="button" key={c.id} disabled={loadedKey!==key||(farm.harvest[c.id]||0)<=plate.filter(id=>id===c.id).length||plate.length>=3} onClick={()=>setPlate(old=>[...old,c.id])}>{c.icon} {t(c.name)}: {farm.harvest[c.id]||0}</button>)}</div><p>{t({en:"Your bowl: ",ar:"طبقك: "})}{plate.length?plate.map(id=>crops.find(c=>c.id===id)?.icon).join(" "):t({en:"Choose ingredients from your harvest.",ar:"اختار مكونات من المحصول."})}</p><div className={styles.actions}><button type="button" disabled={!plate.length||loadedKey!==key} onClick={()=>{setFarm(old=>farmAction(old,{kind:"cook",ingredients:plate}));setMessage(t({en:"You made a colorful vegetable side! Enjoy different foods together with your family.",ar:"حضّرت طبق خضار ملون! استمتع بأكلات متنوعة مع أسرتك."}));setPlate([])}}>{t({en:"🥗 Make my dish",ar:"🥗 حضّر طبقي"})}</button><button type="button" onClick={()=>setPlate([])}>{t({en:"Start over",ar:"ابدأ من جديد"})}</button></div><p className={styles.detail}>{t({en:"This is a vegetable side dish, not a complete meal. Different foods provide different nutrients.",ar:"ده طبق خضار جانبي، مش وجبة كاملة. الأطعمة المختلفة بتوفر عناصر غذائية متنوعة."})}</p></div>}
 <p role="status" aria-live="polite" className={styles.message}>{message}</p>
 <small className={styles.footnote}>{t({en:"No penalties. Take a break whenever you like. Progress follows the selected learning journey.",ar:"مفيش عقوبات. خد راحة وقت ما تحب. التقدم بيتحفظ في رحلة التعلّم المختارة."})}</small>
 </section>
}
