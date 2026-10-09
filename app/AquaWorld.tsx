'use client';
import {useEffect,useState} from 'react';
import {useAdventureState} from './KidsJourney';
const species=[
{id:'tilapia',ar:'البلطي النيلي',en:'Nile tilapia',home:'river',arFact:'سمكة مياه عذبة ومصدر للبروتين.',enFact:'A freshwater fish and a source of protein.'},
{id:'catfish',ar:'القرموط',en:'Catfish',home:'river',arFact:'يعيش في المياه العذبة.',enFact:'Lives in freshwater.'},
{id:'perch',ar:'قشر البياض النيلي',en:'Nile perch',home:'river',arFact:'من أسماك المياه العذبة في أفريقيا.',enFact:'A freshwater fish found in Africa.'},
{id:'sardine',ar:'السردين',en:'Sardine',home:'sea',arFact:'من الأسماك الدهنية التي قد توفر أوميجا ٣.',enFact:'An oily fish that can provide omega-3.'},
{id:'mullet',ar:'البوري',en:'Mullet',home:'sea',arFact:'يعيش في مياه ساحلية وبعض المياه قليلة الملوحة.',enFact:'Lives in coastal and some brackish waters.'},
{id:'mackerel',ar:'الماكريل',en:'Mackerel',home:'sea',arFact:'من أسماك البحر الدهنية؛ العناصر الغذائية تختلف بين الأنواع.',enFact:'An oily marine fish; nutrient amounts vary across species.'}
];
const clues=[{id:'habitat',ar:'أي بيئة مناسبة للبلطي النيلي؟',en:'Which habitat suits Nile tilapia?',options:[{id:'fresh',ar:'مياه عذبة',en:'Freshwater'},{id:'sand',ar:'رمال جافة',en:'Dry sand'},{id:'tree',ar:'فوق الشجر',en:'Treetops'}],answer:'fresh',arWhy:'البلطي النيلي من أسماك المياه العذبة.',enWhy:'Nile tilapia is a freshwater fish.'},{id:'variety',ar:'هل كل أنواع السمك لها نفس العناصر الغذائية؟',en:'Do all fish species have the same nutrients?',options:[{id:'vary',ar:'تختلف حسب النوع',en:'They vary by species'},{id:'same',ar:'كلها متطابقة',en:'All are identical'},{id:'none',ar:'لا تحتوي أي عناصر',en:'None contain nutrients'}],answer:'vary',arWhy:'السمك قد يوفر البروتين، وكميات أوميجا ٣ وفيتامين د تختلف حسب النوع.',enWhy:'Fish can provide protein; omega-3 and vitamin D amounts vary by species.'}];
export default function AquaWorld({ar,onComplete}:{ar:boolean;onComplete?:()=>void}){
 const [home,setHome]=useState('river'),[picked,setPicked]=useState<string|null>(null),[clue,setClue]=useState(0),[answer,setAnswer]=useState<string|null>(null);
 const [found,setFound]=useAdventureState<string[]>('aqua',[]);
 useEffect(()=>{if(found.length===species.length)onComplete?.()},[found,onComplete]);
 const t=(a:string,b:string)=>ar?a:b;const q=clues[clue];
 return <section dir={ar?'rtl':'ltr'} aria-label={t('اكتشاف الأسماك','Fish discovery')} style={{background:'#e5f5f5',color:'#174758',padding:'clamp(12px,3vw,28px)',borderRadius:24,margin:'24px 0'}}>
 <h2>{t('🐟 عالم الأسماك','🐟 Aqua World')}</h2><p>{t('اكتشف أسماك النيل والبحر، وتعرف على الغذاء والبيئات المائية.','Discover Nile and sea fish, aquatic habitats and food stories.')}</p>
 <div style={{display:'flex',gap:10,flexWrap:'wrap'}}>{['river','sea'].map(h=><button key={h} type="button" aria-pressed={home===h} onClick={()=>{setHome(h);setPicked(null)}} style={{padding:12,borderRadius:15,background:home===h?'#226c82':'white',color:home===h?'white':'#174758',border:'2px solid #226c82'}}>{h==='river'?t('🏞️ النيل','🏞️ Nile'):t('🌊 البحر','🌊 Sea')}</button>)}</div>
 <div style={{background:'linear-gradient(#b4e8e9,#4b9bb6)',padding:18,marginTop:14,borderRadius:22,display:'grid',gridTemplateColumns:'repeat(auto-fit,minmax(min(100%,140px),1fr))',gap:12}}>{species.filter(f=>f.home===home).map(f=><button type="button" key={f.id} aria-pressed={picked===f.id} onClick={()=>{setPicked(f.id);setFound(a=>a.includes(f.id)?a:[...a,f.id])}} style={{background:'#fff',border:'2px solid #fff',borderRadius:20,padding:18,minHeight:115,fontSize:17,color:'#174758'}}><span aria-hidden="true" style={{display:'block',fontSize:38}}>🐟</span>{t(f.ar,f.en)} {found.includes(f.id)?'✓':''}</button>)}</div>
 <div role="status" aria-live="polite" style={{background:'white',padding:16,borderRadius:15,marginTop:12,minHeight:75}}>{picked?species.filter(f=>f.id===picked).map(f=><p key={f.id}>{t(f.arFact,f.enFact)}</p>):t('اختار سمكة علشان تعرف حكايتها.','Choose a fish to learn its story.')}</div>
 <p>{t('اكتشافاتك: ','Your discoveries: ')}{found.length}/{species.length}</p>
 <article style={{background:'#fff',padding:18,borderRadius:18,margin:'16px 0'}}><h3>{t('🔎 محقق المياه','🔎 Water detective')}</h3><p>{t(q.ar,q.en)}</p><div style={{display:'flex',gap:10,flexWrap:'wrap'}}>{q.options.map(option=><button type="button" key={option.id} aria-pressed={answer===option.id} onClick={()=>setAnswer(option.id)} style={{padding:13,borderRadius:12,border:'1px solid #226c82',background:answer===option.id?'#d6ede8':'white',color:'#174758'}}>{t(option.ar,option.en)}</button>)}</div>{answer&&<p role="status">{answer===q.answer?t(q.arWhy,q.enWhy):t('تخمين جميل. جرب اختيارًا آخر أو لاحظ قصص الأسماك.','Nice guess. Try another choice or explore the fish stories.')}</p>}<button type="button" onClick={()=>{setClue(i=>(i+1)%clues.length);setAnswer(null)}} style={{padding:12,marginTop:12,border:'1px solid #226c82',borderRadius:12,background:'white',color:'#174758'}}>{t('معلومة أخرى ←','Another clue →')}</button></article>
 <small>{t('التحضير والطهي بمساعدة شخص بالغ. اختيار الطعام يعتمد على احتياجات الأسرة والحساسية المتاحة لها؛ لا يوجد ضغط لتذوق السمك.','Preparation and cooking need a grown-up. Food choices depend on family needs and allergies; there is no pressure to taste fish.')}</small>
 </section>;
}
