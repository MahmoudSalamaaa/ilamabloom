"use client";
import styles from "./HomeReference.module.css";

type View="home"|"learn"|"kids"|"lens"|"atlas"|"log"|"journal"|"visit"|"about"|"privacy"|"sitemap";
type Props={go:(v:View)=>void;ar:boolean};

const EN=[
 ["Nutrition","Practical knowledge for everyday choices.","learn","https://images.pexels.com/photos/1640777/pexels-photo-1640777.jpeg?auto=compress&cs=tinysrgb&w=1200"],
 ["Healthy Living","Simple habits for real, lasting change.","kids","https://images.pexels.com/photos/3768126/pexels-photo-3768126.jpeg?auto=compress&cs=tinysrgb&w=1200"],
 ["Food Atlas","Explore foods, their context and portions.","atlas","https://images.pexels.com/photos/2255935/pexels-photo-2255935.jpeg?auto=compress&cs=tinysrgb&w=1200"],
 ["Journal","Notice patterns and keep what matters.","journal","https://images.pexels.com/photos/4050990/pexels-photo-4050990.jpeg?auto=compress&cs=tinysrgb&w=1200"],
 ["Kids","Healthy habits, happier little humans.","kids","https://images.pexels.com/photos/296301/pexels-photo-296301.jpeg?auto=compress&cs=tinysrgb&w=1200"]
] as const;
const AR=[
 ["التغذية","معرفة عملية لاختياراتك اليومية.","learn","https://images.pexels.com/photos/1640777/pexels-photo-1640777.jpeg?auto=compress&cs=tinysrgb&w=1200"],
 ["حياة صحية","عادات بسيطة لتغيير واقعي ومستمر.","kids","https://images.pexels.com/photos/3768126/pexels-photo-3768126.jpeg?auto=compress&cs=tinysrgb&w=1200"],
 ["أطلس الطعام","اكتشف الطعام وسياقه وحصصه.","atlas","https://images.pexels.com/photos/2255935/pexels-photo-2255935.jpeg?auto=compress&cs=tinysrgb&w=1200"],
 ["اليوميات","لاحظ الأنماط واحتفظ بما يهم.","journal","https://images.pexels.com/photos/4050990/pexels-photo-4050990.jpeg?auto=compress&cs=tinysrgb&w=1200"],
 ["الأطفال","عادات صحية لعلاقة أفضل مع الطعام.","kids","https://images.pexels.com/photos/296301/pexels-photo-296301.jpeg?auto=compress&cs=tinysrgb&w=1200"]
] as const;

export default function HomeReference({go,ar}:Props){
 const cards=ar?AR:EN;
 return <div className={styles.page}>
  <section className={styles.hero}>
   <div className={styles.petals} aria-hidden="true">
    <i style={{left:"6%",animationDuration:"13s",animationDelay:"-4s"}}/><i style={{left:"15%",animationDuration:"18s",animationDelay:"-11s"}}/><i style={{left:"27%",animationDuration:"15s",animationDelay:"-7s"}}/><i style={{left:"38%",animationDuration:"20s",animationDelay:"-16s"}}/><i style={{left:"49%",animationDuration:"12s",animationDelay:"-2s"}}/><i style={{left:"59%",animationDuration:"17s",animationDelay:"-13s"}}/><i style={{left:"68%",animationDuration:"14s",animationDelay:"-8s"}}/><i style={{left:"77%",animationDuration:"19s",animationDelay:"-17s"}}/><i style={{left:"88%",animationDuration:"16s",animationDelay:"-6s"}}/><i style={{left:"96%",animationDuration:"21s",animationDelay:"-15s"}}/><i/><i/><i/><i/>
   </div>
   <div className={styles.heroBloom} aria-hidden="true"><span>{ar?"الأكل":"FOOD"}</span><i>·</i><span>{ar?"الجسم":"BODY"}</span><i>·</i><span>{ar?"السياق":"CONTEXT"}</span></div>
   <div className={styles.heroCopy}>
    <p className={styles.eyebrow}>{ar?"تغذية أفضل":"GOOD NUTRITION BRINGS"}</p>
    <h1>{ar?<>لحياة <em>أكثر إشراقًا</em></>:<>A Brighter <em>You</em></>}</h1>
    <p className={styles.lead}>{ar?"معرفة أوضح، اختيارات أفضل، وعادات صغيرة لحياة أكثر صحة وسعادة.":"Knowledge, better choices, and small habits for a healthier, happier life."}</p>
    <button type="button" className={styles.primary} onClick={()=>document.getElementById("ilama-world")?.scrollIntoView({behavior:"smooth"})}>{ar?"اكتشف عالمنا":"Explore Our World"} <span>→</span></button>
   </div>
   <figure className={styles.heroImage}><div className={styles.heroImageTrack}><img src="https://images.pexels.com/photos/5966431/pexels-photo-5966431.jpeg?auto=compress&cs=tinysrgb&w=1800" alt={ar?"فاكهة ومكونات طبيعية على مائدة":"Natural fruit and ingredients on a table"}/></div><figcaption className={styles.heroCaption}><b>ILAMA / 01</b><span>{ar?"طعام حقيقي · حياة حقيقية":"REAL FOOD · REAL LIFE"}</span></figcaption></figure>
  </section>

  <section className={styles.approach} id="ilama-world">
   <div className={styles.approachTop}>
    <div><p className={styles.eyebrow}>{ar?"رؤية متكاملة":"A WHOLE-PERSON APPROACH"}</p><h2>{ar?"الطعام · الجسد · السياق":"Food · Body · Context"}</h2><p>{ar?"نجمع التغذية ونمط الحياة والسياق الحقيقي معًا لتصبح الحياة الصحية أبسط وأكثر صلة وإلهامًا.":"We bring nutrition, lifestyle and real-life context together so healthy living feels simple, relevant and inspiring."}</p></div>
    <aside><p>{ar?"إيلاما بلوم مساحتك للاستكشاف والتعلم وبناء حياة أكثر صحة واتزانًا — في كل مرحلة من العمر.":"ILAMA BLOOM is your guided space to explore, learn and build a healthier, more balanced you — at every stage of life."}</p><button type="button" onClick={()=>go("learn")}>{ar?"منهجنا":"Our Approach"} <span>→</span></button></aside>
   </div>
   <div className={styles.cardGrid}>{cards.map(([title,copy,to,img])=><button type="button" key={title} className={styles.card} onClick={()=>go(to)}><span className={styles.cardImage}><img src={img} alt=""/></span><span className={styles.cardBody}><strong>{title}</strong><small>{copy}</small><i>{ar?"استكشف":"Explore"} <b>→</b></i></span></button>)}</div>
  </section>

  <section className={styles.atlas}>
   <div className={styles.atlasCopy}><p className={styles.eyebrow}>{ar?"تجربة مميزة":"FEATURED EXPERIENCE"}</p><h2>{ar?"أطلس الطعام":"The Food Atlas"}</h2><p>{ar?"رحلة بصرية في عالم الطعام الحقيقي — مكوناته، حصصه والسياق الذي يجعله مفهومًا.":"A visual journey through the world of real food — its ingredients, portions and the context that makes it useful."}</p><button type="button" className={styles.primary} onClick={()=>go("atlas")}>{ar?"استكشف أطلس الطعام":"Explore the Food Atlas"} <span>→</span></button></div>
   <figure className={styles.atlasImage}><img src="https://images.pexels.com/photos/5945641/pexels-photo-5945641.jpeg?auto=compress&cs=tinysrgb&w=1800" alt={ar?"رمان طازج":"Fresh pomegranate"}/><figcaption><strong>{ar?"الرمان":"Pomegranate"}</strong><small>{ar?"طعام حقيقي داخل سياق الوجبة.":"Real food, understood in context."}</small><button type="button" onClick={()=>go("atlas")}>→</button></figcaption></figure>
  </section>

  <section className={styles.kids}>
   <figure><img src="https://images.pexels.com/photos/296301/pexels-photo-296301.jpeg?auto=compress&cs=tinysrgb&w=1800" alt={ar?"طفل سعيد في الخارج":"Happy child outdoors"}/></figure>
   <div><p className={styles.eyebrow}>{ar?"الأطفال والعائلة":"KIDS · FAMILY"}</p><h2>{ar?"لعقول وأجسام تنمو":"For Growing Minds & Bodies"}</h2><p>{ar?"محتوى وأدوات مرحة ومناسبة للعمر تساعد الأطفال على بناء علاقة إيجابية مع الطعام — اليوم وبكرة.":"Fun, age-appropriate content and tools to help kids build a positive relationship with food — for today and tomorrow."}</p><button type="button" className={styles.textLink} onClick={()=>go("kids")}>{ar?"اكتشف الأطفال":"Discover Kids"} <span>→</span></button></div>
  </section>

  <section className={styles.closing}><div><p className={styles.eyebrow}>{ar?"أنت أكثر صحة وإشراقًا":"A HEALTHIER, BRIGHTER YOU"}</p><h2>{ar?"ننمو معًا نحو غدٍ أكثر صحة":"Let’s Grow a Healthier Tomorrow"}</h2><p>{ar?"معرفة حقيقية. اختيارات أفضل. حياة أكثر إشراقًا.":"Real knowledge. Better choices. A brighter you."}</p></div><button type="button" onClick={()=>go("learn")}>{ar?"ابدأ رحلتك":"Start Your Journey"} <span>→</span></button></section>
 </div>
}
