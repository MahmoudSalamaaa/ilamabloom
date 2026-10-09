"use client";
import {useEffect,useState,type CSSProperties} from "react";
type Question={icon:string;ar:string;en:string;options:{id:string;ar:string;en:string}[];answer:string;whyAr:string;whyEn:string};
const questions:Question[]=[
{icon:"☀️",ar:"تربة النبتة ناشفة. إيه اللي ممكن يساعد؟",en:"The plant's soil is dry. What could help?",options:[{id:"water",ar:"كمية مياه مناسبة 💧",en:"A suitable amount of water 💧"},{id:"dark",ar:"ظلام دائم 🌑",en:"Permanent darkness 🌑"},{id:"paint",ar:"ألوان 🎨",en:"Paint 🎨"}],answer:"water",whyAr:"النباتات بتحتاج مياه، لكن الكمية المناسبة بتختلف حسب النبات والجو.",whyEn:"Plants need water, but the right amount varies by plant and weather."},
{icon:"🌤️",ar:"النبتة في مكان مظلم طول الوقت. إيه اللي ينقصها؟",en:"The plant stays in darkness all the time. What does it need?",options:[{id:"light",ar:"ضوء مناسب ☀️",en:"Suitable light ☀️"},{id:"music",ar:"موسيقى 🎵",en:"Music 🎵"},{id:"sugar",ar:"سكر 🍬",en:"Sugar 🍬"}],answer:"light",whyAr:"معظم النباتات بتستخدم الضوء في البناء الضوئي علشان تصنع غذاءها.",whyEn:"Most plants use light to make their own food through photosynthesis."},
{icon:"🌧️",ar:"مياه كتير متجمعة في الأصيص. نعمل إيه مع شخص كبير؟",en:"Too much water collects in a pot. What can we do with a grown-up?",options:[{id:"drain",ar:"نساعد المياه الزيادة تتصرف",en:"Help excess water drain"},{id:"more",ar:"نزود مياه أكتر",en:"Add more water"},{id:"cover",ar:"نغطي النبات بالكامل",en:"Cover the plant completely"}],answer:"drain",whyAr:"التربة المشبعة بالمياه ممكن تقلل الهواء المتاح للجذور.",whyEn:"Waterlogged soil can reduce air available to roots."}
];
const button:CSSProperties={border:"2px solid #6c9b78",borderRadius:15,padding:"12px 16px",minHeight:48,background:"#fff",color:"#264a37",fontWeight:700,cursor:"pointer"};
export default function KidsWeatherLab({ar}:{ar:boolean}){
 const [index,setIndex]=useState(0),[feedback,setFeedback]=useState(""),[done,setDone]=useState(false),[family,setFamily]=useState(false),[reduced,setReduced]=useState(false);
 const t=(a:string,b:string)=>ar?a:b;
 useEffect(()=>{const media=matchMedia("(prefers-reduced-motion: reduce)");const update=()=>setReduced(media.matches);update();media.addEventListener("change",update);return()=>media.removeEventListener("change",update)},[]);
 const choose=(id:string)=>{const q=questions[index];if(id!==q.answer){setFeedback(t("تجربة جميلة! فكّر في احتياجات النبتة وجرب تاني.","Good exploration! Think about what the plant needs and try again."));return}if(index===questions.length-1){setDone(true);setFeedback(t("اكتشفت احتياجات النباتات. خد راحة وقت ما تحب 🌿","You discovered what plants need. Take a break whenever you like 🌿"))}else{setIndex(x=>x+1);setFeedback(t(q.whyAr,q.whyEn))}};
 return <section id="kids-weather-lab" dir={ar?"rtl":"ltr"} aria-label={t("معمل النباتات والطقس","Plant and weather science lab")} style={{background:"#eaf3ed",borderRadius:24,padding:"clamp(15px,3vw,28px)",margin:"28px 0",color:"#264a37"}}>
 <h2 style={{fontSize:"clamp(25px,4vw,40px)"}}>{t("🌦️ معمل النبات والطقس","🌦️ Plant & Weather Lab")}</h2>
 <p>{t("تجارب علمية صغيرة من غير خوف أو درجات. الاختيارات الغلط جزء من التعلم.","Gentle science experiments. Wrong guesses are part of learning, not a failure.")}</p>
 <div style={{background:"#fffdf5",borderRadius:18,padding:20}}>
 {done?<div><h3>{t("🌱 اكتشاف جميل!","🌱 Wonderful discovery!")}</h3><p>{t("مش لازم تكمل لعب. جرب تلاحظ نبات حقيقي مع أسرتك.","No need to keep playing. Try observing a real plant with your family.")}</p><button type="button" style={button} onClick={()=>{setIndex(0);setDone(false);setFeedback("")}}>{t("العب تاني لو حابب","Play again if you like")}</button></div>:<><p>{t("التجربة","Experiment")} {index+1} / {questions.length}</p><h3 style={{fontSize:23}}>{questions[index].icon} {t(questions[index].ar,questions[index].en)}</h3><div style={{display:"flex",gap:10,flexWrap:"wrap"}}>{questions[index].options.map(c=><button key={c.id} type="button" style={button} onClick={()=>choose(c.id)}>{t(c.ar,c.en)}</button>)}</div></>}
 <p role="status" aria-live="polite" style={{minHeight:25,fontWeight:600}}>{feedback}</p>
 </div>
 <div style={{marginTop:14}}><button type="button" aria-expanded={family} onClick={()=>setFamily(x=>!x)} style={button}>{t("👨‍👩‍👧 تجربة اختيارية مع الأسرة","👨‍👩‍👧 Optional family experiment")} {family?"−":"+"}</button>{family&&<p>{t("مع شخص بالغ: ازرعوا بذرة في أصيص، وراقبوا التغيرات وقت ما يناسبكم. اغسلوا إيديكم بعد لمس التربة. مش لازم متابعة يومية.","With a grown-up: plant a seed in a pot and observe changes whenever convenient. Wash hands after handling soil. No daily check-in required.")}</p>}</div>
 <small>{reduced?t("تم احترام إعداد تقليل الحركة.","Reduced-motion preference respected."):t("مفيش مؤقت، ومفيش عقاب على المحاولات.","No timers or penalties for trying.")}</small>
 </section>
}
