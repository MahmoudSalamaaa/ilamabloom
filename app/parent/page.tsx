'use client';
import {useEffect,useState} from 'react';
import Link from 'next/link';
import {authClient} from '../../lib/auth/client';
import {KidsJourneyProvider,KidsJourneyToolbar,KidsParentSummary} from '../KidsJourney';
import styles from '../KidsJourney.module.css';
export default function ParentPage(){
 const {data:session,isPending}=authClient.useSession();const [ar,setAr]=useState(false);
 useEffect(()=>{const query=new URLSearchParams(location.search).get('lang');let stored='en';try{stored=localStorage.getItem('ilama-bloom-lang')||'en'}catch{}setAr((query||stored)==='ar')},[]);
 const toggle=()=>{const next=!ar;setAr(next);const lang=next?'ar':'en';try{localStorage.setItem('ilama-bloom-lang',lang)}catch{}const url=new URL(location.href);url.searchParams.set('lang',lang);history.replaceState({},'',url)};
 return <main dir={ar?'rtl':'ltr'} lang={ar?'ar':'en'} className={styles.parent}><header><div className={styles.tools}><Link href="/">ILAMA BLOOM</Link><button type="button" onClick={toggle}>{ar?'EN':'عربي'}</button></div><h1>{ar?'مساحة الأسرة':'Your family space'}</h1><p>{ar?'رحلة خاصة لكل طفل، بلا ترتيب أو مقارنة.':'A private journey for each child, without rankings or comparisons.'}</p></header>
 {isPending?<p role="status">{ar?'تحميل حساب الأسرة…':'Loading your family account…'}</p>:session?<KidsJourneyProvider key={session.user.id} ar={ar} userId={session.user.id}><KidsJourneyToolbar/><KidsParentSummary/></KidsJourneyProvider>:<section className={styles.panel}><h2>{ar?'دخول ولي الأمر':'Guardian sign-in'}</h2><p>{ar?'استخدم حسابك لإنشاء ملفات تعلم خاصة للأطفال. لا نطلب تاريخ ميلاد أو صورة أو بيانات عن الجسم.':'Use your account to create private learning profiles. No birth date, profile photo or body measurements are requested.'}</p><Link href={'/auth/sign-in?next=%2Fparent&lang='+(ar?'ar':'en')}>{ar?'الدخول للمتابعة ←':'Sign in to continue →'}</Link></section>}
 </main>;
}
