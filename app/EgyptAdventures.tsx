"use client";
import {useEffect,useMemo,useState} from "react";
type Place={id:string;ar:string;en:string;region:"delta"|"cairo"|"upper"|"coast"|"canal"|"desert";foodAr:string;foodEn:string;factAr:string;factEn:string};
const places:Place[]=[
["cairo","القاهرة","Cairo","cairo","الفول والطعمية","Ful and taameya","مدينة كبيرة على النيل","A major city on the Nile"],
["giza","الجيزة","Giza","cairo","الخضروات والفاكهة","Vegetables and fruit","تضم مناطق زراعية وآثارًا","Home to farms and ancient monuments"],
["alex","الإسكندرية","Alexandria","coast","الأسماك البحرية","Seafood","مدينة على البحر المتوسط","A Mediterranean city"],
["dak","الدقهلية","Dakahlia","delta","الأرز والخضروات","Rice and vegetables","من محافظات دلتا النيل","Part of the Nile Delta"],
["shar","الشرقية","Sharqia","delta","المحاصيل الحقلية","Field crops","تشتهر بالأراضي الزراعية","Known for farmland"],
["gharb","الغربية","Gharbia","delta","المحاصيل والحلويات","Crops and sweets","تقع في قلب الدلتا","In the heart of the Delta"],
["mon","المنوفية","Monufia","delta","الخضروات والمحاصيل","Vegetables and crops","تضم قرى زراعية كثيرة","Has many farming villages"],
["beh","البحيرة","Beheira","delta","الزراعة والفاكهة","Farming and fruit","تمتد من الدلتا نحو الساحل","Extends from Delta to coast"],
["kafr","كفر الشيخ","Kafr El Sheikh","delta","الأرز والأسماك","Rice and fish","تشتهر بالاستزراع السمكي","Known for aquaculture"],
["dam","دمياط","Damietta","coast","الجبن الدمياطي","Damietta cheese","مدينة ساحلية وصناعة أثاث","Coastal city and furniture craft"],
["port","بورسعيد","Port Said","canal","المأكولات البحرية","Seafood","عند المدخل الشمالي لقناة السويس","At the Suez Canal's northern entrance"],
["ism","الإسماعيلية","Ismailia","canal","المانجو","Mangoes","تقع بجوار قناة السويس","Along the Suez Canal"],
["suez","السويس","Suez","canal","الأسماك البحرية","Seafood","عند الطرف الجنوبي لقناة السويس","At the Suez Canal's southern end"],
["qali","القليوبية","Qalyubia","delta","الخضروات والفاكهة","Vegetables and fruit","في جنوب دلتا النيل","In the southern Nile Delta"],
["fay","الفيوم","Fayoum","upper","المحاصيل والأسماك","Crops and fish","بها بحيرة قارون ومناطق زراعية","Home to Lake Qarun and farms"],
["beni","بني سويف","Beni Suef","upper","المحاصيل الزراعية","Farm crops","على امتداد وادي النيل","Along the Nile Valley"],
["min","المنيا","Minya","upper","قصب السكر والمحاصيل","Sugarcane and crops","من محافظات صعيد مصر","In Upper Egypt"],
["asy","أسيوط","Asyut","upper","الرمان والمحاصيل","Pomegranates and crops","على ضفاف النيل","On the Nile"],
["soh","سوهاج","Sohag","upper","قصب السكر","Sugarcane","تضم قرى زراعية في الصعيد","Has farming villages in Upper Egypt"],
["qena","قنا","Qena","upper","قصب السكر","Sugarcane","من مناطق زراعة قصب السكر","A sugarcane-growing area"],
["lux","الأقصر","Luxor","upper","قصب السكر والتمور","Sugarcane and dates","تشتهر بالآثار على ضفتي النيل","Famous for Nile-side antiquities"],
["asw","أسوان","Aswan","upper","التمور","Dates","في جنوب مصر وتضم تراثًا نوبيًا","In southern Egypt with Nubian heritage"],
["red","البحر الأحمر","Red Sea","coast","الأسماك البحرية","Seafood","ساحل طويل وشعاب مرجانية","Long coast and coral reefs"],
["mat","مطروح","Matrouh","coast","الزيتون والتين","Olives and figs","على ساحل البحر المتوسط","On the Mediterranean coast"],
["north","شمال سيناء","North Sinai","desert","الزيتون والتمور","Olives and dates","بيئات ساحلية وصحراوية","Coastal and desert habitats"],
["south","جنوب سيناء","South Sinai","desert","التمور","Dates","جبال وسواحل وشعاب مرجانية","Mountains, coasts and coral reefs"],
["wadi","الوادي الجديد","New Valley","desert","التمور","Dates","واحات وزراعة صحراوية","Oases and desert agriculture"]
].map(([id,ar,en,region,foodAr,foodEn,factAr,factEn])=>({id,ar,en,region:region as Place["region"],foodAr,foodEn,factAr,factEn}));
const regions=[{id:"delta",ar:"دلتا النيل",en:"Nile Delta",icon:"🌾"},{id:"cairo",ar:"القاهرة الكبرى",en:"Greater Cairo",icon:"🏙️"},{id:"coast",ar:"السواحل",en:"Coasts",icon:"🐟"},{id:"canal",ar:"مدن القناة",en:"Canal cities",icon:"⛵"},{id:"upper",ar:"وادي النيل والصعيد",en:"Nile Valley",icon:"🌴"},{id:"desert",ar:"سيناء والواحات",en:"Sinai and oases",icon:"🏜️"}] as const;
export default function EgyptAdventures({ar,userId}:{ar:boolean;userId?:string}){
 const [region,setRegion]=useState<string>("delta");const [place,setPlace]=useState<Place|null>(null);const [quiz,setQuiz]=useState(false);const [answer,setAnswer]=useState<string|null>(null);
 const [stamps,setStamps]=useState<string[]>([]);const [loadedKey,setLoadedKey]=useState<string|null>(null);
 const key="ilama-egypt-passport-v1:"+(userId||"guest");
 useEffect(()=>{try{const v:unknown=JSON.parse(localStorage.getItem(key)||"[]");setStamps(Array.isArray(v)?v.filter((id):id is string=>typeof id==="string"&&places.some(p=>p.id===id)).slice(0,27):[])}catch{setStamps([])}setLoadedKey(key)},[key]);
 useEffect(()=>{if(loadedKey===key)try{localStorage.setItem(key,JSON.stringify(stamps))}catch{}},[stamps,key,loadedKey]);
 const t=(a:string,b:string)=>ar?a:b;const visible=useMemo(()=>places.filter(p=>p.region===region),[region]);const options=useMemo(()=>{if(!place)return [];const used=new Set([place.foodEn]);const other:Place[]=[];for(const p of places){if(p.id!==place.id&&!used.has(p.foodEn)){other.push(p);used.add(p.foodEn)}if(other.length===2)break}return [place,...other].sort((a,b)=>a.id.localeCompare(b.id))},[place]);
 return <section dir={ar?"rtl":"ltr"} aria-label={t("مغامرات محافظات مصر","Egypt governorate adventures")} style={{background:"#f9f1df",borderRadius:24,padding:"clamp(14px,3vw,30px)",margin:"30px 0",color:"#304837"}}>
 <h2 style={{fontSize:"clamp(24px,4vw,40px)"}}>{t("🗺️ جواز سفر إيلاما: مصر","🗺️ Ilama's Egypt Passport")}</h2><p>{t("استكشف المحافظات الـ٢٧ وتعرف على أكلها وطبيعتها. كل محافظة ليها حكاية!","Explore all 27 governorates, their foods and nature. Every place has a story!")}</p>
 <p role="status" style={{fontWeight:700}}>{t("أختام الاستكشاف: ","Discovery stamps: ")}{stamps.length} / 27 🌟</p>
 <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(145px,1fr))",gap:9}}>{regions.map(r=><button type="button" key={r.id} aria-pressed={region===r.id} onClick={()=>{setRegion(r.id);setPlace(null);setQuiz(false)}} style={{background:region===r.id?"#386b50":"#fff",color:region===r.id?"white":"#294637",padding:14,border:"2px solid #7b9a75",borderRadius:18,cursor:"pointer",fontWeight:700}}>{r.icon} {t(r.ar,r.en)}</button>)}</div>
 <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(135px,1fr))",gap:10,marginTop:15}}>{visible.map(p=><button type="button" key={p.id} onClick={()=>{setPlace(p);setQuiz(false);setAnswer(null)}} aria-pressed={place?.id===p.id} style={{padding:14,borderRadius:16,border:place?.id===p.id?"3px solid #3d7356":"1px solid #a5ae91",background:"#fff",fontSize:16,cursor:"pointer"}}>{stamps.includes(p.id)?"🌟":"📍"} {t(p.ar,p.en)}</button>)}</div>
 {place&&<article style={{marginTop:18,padding:18,borderRadius:18,background:"#fff"}}><h3>{t(place.ar,place.en)}</h3><p>🌿 {t(place.factAr,place.factEn)}</p><p>🍽️ {t("طعام أو محصول مرتبط بالمنطقة: ","Regional food or crop: ")}<strong>{t(place.foodAr,place.foodEn)}</strong></p><button type="button" onClick={()=>{setQuiz(true);setAnswer(null)}} style={{background:"#376b53",color:"white",border:0,borderRadius:15,padding:"12px 18px",cursor:"pointer"}}>{t("🎮 العب تحدي الطعام","🎮 Play the food challenge")}</button>{quiz&&<div><h4>{t("إيه الطعام أو المحصول اللي اكتشفناه في المحطة دي؟","Which food or crop did we discover at this stop?")}</h4><div style={{display:"flex",gap:8,flexWrap:"wrap"}}>{options.map(p=><button type="button" key={p.id} onClick={()=>{setAnswer(p.id);if(p.id===place.id&&loadedKey===key)setStamps(old=>old.includes(place.id)?old:[...old,place.id])}} style={{padding:12,borderRadius:12,border:"1px solid #6a9a7d",background:answer===p.id?"#d7eecf":"#f7f6ed"}}>{t(p.foodAr,p.foodEn)}</button>)}</div>{answer&&<p role="status">{answer===place.id?t("أحسنت! اكتشفت معلومة جديدة 🌟","Well done! A new discovery 🌟"):t("محاولة جميلة! جرّب اختيار تاني 🌱","Nice try! Explore another choice 🌱")}</p>}</div>}</article>}
 <p style={{fontSize:12,marginTop:14}}>{t("الأمثلة تعليمية وغير حصرية: أكلات ومحاصيل كثيرة مشتركة بين محافظات مصر. الأختام بتتحفظ على الجهاز ده فقط.","Educational examples, not exclusive origins: many foods and crops are shared across Egypt. Stamps are saved on this device only.")}</p>
 </section>
}