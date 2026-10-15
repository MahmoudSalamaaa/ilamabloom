"use client";
import styles from "./HomeReference.module.css";

type View="home"|"learn"|"kids"|"everyday"|"lens"|"atlas"|"log"|"journal"|"visit"|"about"|"privacy"|"sitemap";
type Props={go:(v:View)=>void;ar:boolean};

const EN=[
 ["Nutrition","Practical knowledge for everyday choices.","learn","https://images.pexels.com/photos/1640777/pexels-photo-1640777.jpeg?auto=compress&cs=tinysrgb&w=1200"],
 ["Healthy Living","Simple habits for real, lasting change.","everyday","https://images.pexels.com/photos/3768126/pexels-photo-3768126.jpeg?auto=compress&cs=tinysrgb&w=1200"],
 ["Food Atlas","Explore foods, their context and portions.","atlas","https://images.pexels.com/photos/2255935/pexels-photo-2255935.jpeg?auto=compress&cs=tinysrgb&w=1200"],
 ["Journal","Notice patterns and keep what matters.","journal","https://images.pexels.com/photos/4050990/pexels-photo-4050990.jpeg?auto=compress&cs=tinysrgb&w=1200"],
 ["Kids","Healthy habits, happier little humans.","kids","https://images.pexels.com/photos/296301/pexels-photo-296301.jpeg?auto=compress&cs=tinysrgb&w=1200"]
] as const;
const AR=[
 ["التغذية","معلومات عملية تساعدك تختار كل يوم.","learn","https://images.pexels.com/photos/1640777/pexels-photo-1640777.jpeg?auto=compress&cs=tinysrgb&w=1200"],
 ["حياة صحية","عادات بسيطة لتغيير حقيقي ومستمر.","everyday","https://images.pexels.com/photos/3768126/pexels-photo-3768126.jpeg?auto=compress&cs=tinysrgb&w=1200"],
 ["أطلس الأكل","شوف الأكل وسياقه وكميته.","atlas","https://images.pexels.com/photos/2255935/pexels-photo-2255935.jpeg?auto=compress&cs=tinysrgb&w=1200"],
 ["اليوميات","لاحظ اللي بيتكرر وخلي المهم معاك.","journal","https://images.pexels.com/photos/4050990/pexels-photo-4050990.jpeg?auto=compress&cs=tinysrgb&w=1200"],
 ["الأطفال","عادات صحية تخلي علاقتك بالأكل أحسن.","kids","https://images.pexels.com/photos/296301/pexels-photo-296301.jpeg?auto=compress&cs=tinysrgb&w=1200"]
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
    <p className={styles.eyebrow}>{ar?"دليل مفتوح للأكل والجسم والحياة":"AN OPEN FIELD GUIDE TO FOOD, BODY & LIFE"}</p>
    <h1>{ar?<>الحاجات الحلوة <em>بتكبر</em></>:<>Good things <em>grow</em></>}<br/>{ar?"لما نبص لها عن قرب.":"when we look closer."}</h1>
    <p className={styles.lead}>{ar?"عالم حي من الأكل والجسم وكل حاجة بتشكل يومنا.":"A living world of food, body and the many things that shape a day."}</p>
    <button type="button" className={styles.primary} onClick={()=>go("atlas")}>{ar?"ادخل أطلس الأكل":"Enter the atlas"} <span>↗</span></button>
   </div>
   <p className={styles.heroSideNote}>{ar?"مبني على الفضول · معمول للحياة زي ما هي":"ROOTED IN CURIOSITY · MADE FOR REAL LIFE"}</p>
   <figure className={styles.heroImage}><div className={styles.heroImageTrack}><img src="https://images.pexels.com/photos/5966431/pexels-photo-5966431.jpeg?auto=compress&cs=tinysrgb&w=1800" alt={ar?"ضوء الشمس يستقر فوق طبقات من الأوراق الخضراء في غابة هادئة":"Sunlight resting on layers of green leaves in a quiet forest"}/></div><figcaption className={styles.heroCaption}><b>ILAMA / 01</b><span>{ar?"أكل حقيقي · حياة حقيقية":"REAL FOOD · REAL LIFE"}</span></figcaption></figure>
  </section>
  <div className={styles.heroFootline}><span>{ar?"ملاحظة نبدأ بيها · ابدأ باللي بيكبر":"AN OPENING NOTE · BEGIN WITH WHAT IS GROWING"}</span><button type="button" onClick={()=>document.getElementById("ilama-world")?.scrollIntoView({behavior:"smooth"})}>{ar?"اقرأ البداية ↓":"Read the opening note ↓"}</button></div>

  <section className={styles.approach} id="ilama-world">
   <div className={styles.approachTop}>
    <div><p className={styles.eyebrow}>{ar?"الصورة كاملة":"A WHOLE-PERSON APPROACH"}</p><h2>{ar?"الأكل · الجسم · الظروف":"Food · Body · Context"}</h2><p>{ar?"بنجمع الأكل الصحي ونمط الحياة والظروف الحقيقية عشان العيشة الصحية تبقى أبسط وأقرب ليك وألطف.":"We bring nutrition, lifestyle and real-life context together so healthy living feels simple, relevant and inspiring."}</p></div>
    <aside><p>{ar?"إيلاما بلوم مساحتك عشان تستكشف وتتعلم وتبني حياة أهدى وأصح — في كل مرحلة.":"ILAMA BLOOM is your guided space to explore, learn and build a healthier, more balanced you — at every stage of life."}</p><button type="button" onClick={()=>go("learn")}>{ar?"طريقتنا":"Our Approach"} <span>→</span></button></aside>
   </div>
   <div className={styles.cardGrid}>{cards.map(([title,copy,to,img])=><button type="button" key={title} className={styles.card} onClick={()=>go(to)}><span className={styles.cardImage}><img src={img} alt=""/></span><span className={styles.cardBody}><strong>{title}</strong><small>{copy}</small><i>{ar?"شوف أكتر":"Explore"} <b>→</b></i></span></button>)}</div>
  </section>

  <section className={styles.atlas}>
   <div className={styles.atlasCopy}><p className={styles.eyebrow}>{ar?"تجربة اخترناها ليك":"FEATURED EXPERIENCE"}</p><h2>{ar?"أطلس الأكل":"The Food Atlas"}</h2><p>{ar?"رحلة بصرية في عالم الأكل الحقيقي — مكوناته، كمياته والظروف اللي بتخليه مفهوم.":"A visual journey through the world of real food — its ingredients, portions and the context that makes it useful."}</p><button type="button" className={styles.primary} onClick={()=>go("atlas")}>{ar?"شوف أكتر أطلس الأكل":"Explore the Food Atlas"} <span>→</span></button></div>
   <figure className={styles.atlasImage}><img src="https://www.themealdb.com/images/media/meals/4er7mj1598733193.jpg" alt={ar?"طبق كشري مصري":"Egyptian koshari dish"}/><figcaption><strong>{ar?"طبقك في سياقه":"Your plate, in context"}</strong><small>{ar?"الكشري مش مجرد طبق — نفهمه جوه يومك، مش نحكم عليه من برّه.":"Koshari is more than a dish — understand it in your day, not out of context."}</small><button type="button" onClick={()=>go("atlas")}>→</button></figcaption></figure>
  </section>

  <section className={styles.kids}>
   <figure><img src="https://images.pexels.com/photos/296301/pexels-photo-296301.jpeg?auto=compress&cs=tinysrgb&w=1800" alt={ar?"طفل سعيد في الخارج":"Happy child outdoors"}/><figcaption className={styles.kidsOverlay}><p className={styles.eyebrow}>{ar?"الأطفال والعيلة":"KIDS · FAMILY"}</p><h2>{ar?"لعقول وأجسام بتكبر":"For Growing Minds & Bodies"}</h2></figcaption></figure>
   <div className={styles.kidsCopy}><p>{ar?"محتوى وأدوات لطيفة ومناسبة للسن تساعد الأطفال يعملوا علاقة أحسن مع الأكل — النهارده وبكرة.":"Fun, age-appropriate content and tools to help kids build a positive relationship with food — for today and tomorrow."}</p><button type="button" className={styles.textLink} onClick={()=>go("kids")}>{ar?"اكتشف الأطفال":"Discover Kids"} <span>→</span></button></div>
  </section>

  <section className={styles.closing}><div><p className={styles.eyebrow}>{ar?"صحتك وحياتك أحلى":"A HEALTHIER, BRIGHTER YOU"}</p><h2>{ar?"نكبر سوا لبكرة أصح":"Let’s Grow a Healthier Tomorrow"}</h2><p>{ar?"معرفة حقيقية. اختيارات أهدى. حياة أحلى.":"Real knowledge. Better choices. A brighter you."}</p></div><button type="button" onClick={()=>go("learn")}>{ar?"ابدأ مشوارك":"Start Your Journey"} <span>→</span></button></section>
 </div>
}
