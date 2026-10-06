"use client";
import {useEffect,useState} from "react";
const CONSENT_KEY="ilama-bloom-analytics-consent";
const ID_KEY="ilama-bloom-anonymous-id";
export default function AnalyticsConsent(){
 const [choice,setChoice]=useState<string|null>(null);const [visible,setVisible]=useState(false);const [lang,setLang]=useState<"ar"|"en">("en");
 useEffect(()=>{
  const queryLang=new URLSearchParams(window.location.search).get("lang");const storedLang=localStorage.getItem("ilama-bloom-lang");const nextLang=queryLang==="ar"||queryLang==="en"?queryLang:(storedLang==="ar"?"ar":"en");setLang(nextLang);
  const legacyConsent=localStorage.getItem("nutclue-analytics-consent");
  const saved=localStorage.getItem(CONSENT_KEY)||legacyConsent;
  if(!localStorage.getItem(CONSENT_KEY)&&legacyConsent)localStorage.setItem(CONSENT_KEY,legacyConsent);
  setChoice(saved);setVisible(!saved);if(saved!=="yes")return;
  const legacyId=localStorage.getItem("nutclue-anonymous-id");
  const id=localStorage.getItem(ID_KEY)||legacyId||crypto.randomUUID();
  localStorage.setItem(ID_KEY,id);
  const send=()=>fetch("/api/analytics",{method:"POST",headers:{"content-type":"application/json"},body:JSON.stringify({event:"page_view",anonymousId:id,path:location.pathname+location.hash})}).catch(()=>{});
  send();const onHash=()=>send();addEventListener("hashchange",onHash);return()=>removeEventListener("hashchange",onHash)
 },[choice]);
 const decide=(value:string)=>{localStorage.setItem(CONSENT_KEY,value);setChoice(value);setVisible(false)};
 if(!visible)return null;
 const ar=lang==="ar";return <aside className="analyticsConsent" role="dialog" aria-label={ar?"اختيار الخصوصية":"Privacy choice"} dir={ar?"rtl":"ltr"}><p>{ar?"يساعدنا القياس المجهول في تحسين ILAMA BLOOM، بدون اسم أو محتوى سجلاتك الصحية.":"Anonymous measurement helps us improve ILAMA BLOOM without your name or journal content."}</p><div><button type="button" onClick={()=>decide("no")}>{ar?"لا، شكرًا":"No, thanks"}</button><button type="button" onClick={()=>decide("yes")}>{ar?"السماح بالقياس المجهول":"Allow anonymous measurement"}</button></div></aside>
}
