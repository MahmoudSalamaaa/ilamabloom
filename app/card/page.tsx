"use client";
import {useState} from "react";
export default function DigitalCard(){const[copied,setCopied]=useState(false);const url="https://www.ilamabloom.com/card";const share=async()=>{try{if(navigator.share)await navigator.share({title:"Dr. Dina Hassan — Ilama Bloom",text:"Pediatrician & Clinical Nutritionist · Founder, Ilama Bloom",url});else{await navigator.clipboard.writeText(url);setCopied(true);setTimeout(()=>setCopied(false),1800)}}catch{}};const save=()=>{const v=["BEGIN:VCARD","VERSION:3.0","FN:Dr. Dina Hassan","N:Hassan;Dina;;;Dr.","ORG:Ilama Bloom","TITLE:Pediatrician & Clinical Nutritionist","TEL;TYPE=CELL:+201206668633","EMAIL;TYPE=INTERNET:dr.dinahassan388@gmail.com","URL:https://www.ilamabloom.com/card","URL;TYPE=LinkedIn:https://www.linkedin.com/in/dr-dina-14a783a1","NOTE:Founder · Clinical Voice at Ilama Bloom","END:VCARD"].join("\r\n");const b=new Blob([v],{type:"text/vcard;charset=utf-8"}),a=document.createElement("a");a.href=URL.createObjectURL(b);a.download="Dr-Dina-Hassan-Ilama-Bloom.vcf";a.click();URL.revokeObjectURL(a.href)};return <main className="digitalCardPage premiumCardPage" style={{marginBottom:"calc(-1 * (72px + env(safe-area-inset-bottom)))"}}><div className="dcGlow dcGlowOne"/><div className="dcGlow dcGlowTwo"/><section className="digitalCard" aria-label="Dr. Dina Hassan digital card"><header className="dcBrand"><a href="/" aria-label="Ilama Bloom home"><img src="/ilama-bloom-logo.svg?v=20261126" alt="Ilama Bloom"/></a><span>Digital card</span></header><div className="dcPortrait"><img src="/dina-hassan-about.webp?v=2" alt="Dr. Dina Hassan"/></div><div className="dcBody"><small>FOUNDER · CLINICAL VOICE</small><h1>Dr. Dina Hassan</h1><h2>Pediatrician &amp; Clinical Nutritionist</h2><p>Clearer nutrition and health information, designed for real life.</p><div className="dcPills"><span>Pediatrics</span><span>Clinical Nutrition</span><span>Health Education</span></div><div className="dcContact"><a href="tel:+201206668633">+20 120 666 8633</a><a href="mailto:dr.dinahassan388@gmail.com">dr.dinahassan388@gmail.com</a><a href="https://www.linkedin.com/in/dr-dina-14a783a1" target="_blank" rel="noreferrer">LinkedIn · Dr. Dina Hassan</a></div><div className="dcActions"><button onClick={save}><b aria-hidden="true">＋</b><span>Save contact</span></button><button onClick={share}><b aria-hidden="true">↗</b><span>{copied?"Link copied":"Share card"}</span></button></div><a className="dcWebsite" href="https://www.ilamabloom.com"><span>Visit</span><strong>www.ilamabloom.com</strong><b>→</b></a></div><footer className="dcFooter"><span>ILAMA <em>BLOOM</em></span><small>Food · Body · Context</small></footer></section><style jsx global>{`
.premiumCardPage{position:relative;display:flex;justify-content:center;align-items:center;min-height:100svh;padding:32px 16px 96px;background:radial-gradient(ellipse at 10% 0%,#ead3d0 0,transparent 45%),radial-gradient(ellipse at 100% 100%,#dce7d8 0,transparent 50%),#faf7f2;color:#103d2c;box-sizing:border-box}
.premiumCardPage .dcGlow{display:none}
.premiumCardPage .digitalCard{position:relative;width:min(100%,460px);max-width:460px;margin:0 auto;background:#fffdf9;border:1px solid #e5d9d1;border-radius:30px;overflow:hidden;box-shadow:0 24px 70px #103d2c19;text-align:center}
.premiumCardPage .dcBrand{display:flex;flex-direction:column;align-items:center;gap:12px;padding:24px 20px 22px;background:#faf7f2;border-bottom:1px solid #e5d9d1}
.premiumCardPage .dcBrand img{width:240px;max-width:100%;height:auto;max-height:none;display:block}
.premiumCardPage .dcBrand span{font-size:10px;letter-spacing:3px;text-transform:uppercase;color:#80545a}
.premiumCardPage .dcPortrait{position:relative;width:124px;height:124px;margin:24px auto 0;border:4px solid #fffdf9;border-radius:50%;box-shadow:0 0 0 1px #d3a09d,0 8px 24px #103d2c18;overflow:hidden}
.premiumCardPage .dcPortrait img{width:100%;height:100%;object-fit:cover;object-position:center 30%;border-radius:50%}
.premiumCardPage .dcBody{padding:20px 24px 26px;color:#103d2c}
.premiumCardPage .dcBody>small{font-size:10px;letter-spacing:2px;color:#80545a;font-weight:700}
.premiumCardPage .dcBody h1{font-family:Georgia,serif;font-size:clamp(30px,8vw,40px);line-height:1.12;margin:10px 0;color:#103d2c}
.premiumCardPage .dcBody h2{font:600 15px/1.5 Arial,sans-serif;color:#537e50;margin:0}
.premiumCardPage .dcBody p{font-size:14px;line-height:1.6;color:#53665c;margin:12px 0 18px}
.premiumCardPage .dcPills{display:flex;flex-wrap:wrap;justify-content:center;gap:6px;margin:0 0 22px}
.premiumCardPage .dcPills span{background:#edf2e9;border:1px solid #dce7d8;border-radius:99px;padding:7px 10px;font-size:11px;color:#103d2c}
.premiumCardPage .dcContact{display:grid;gap:8px;text-align:left;margin:0 0 20px}
.premiumCardPage .dcContact a{display:flex;align-items:center;gap:10px;min-height:48px;padding:10px 12px;border:1px solid #e5d9d1;border-radius:12px;background:#faf7f2;color:#103d2c;text-decoration:none;font-size:13px;overflow-wrap:anywhere}
.premiumCardPage .dcContact a::before{content:'✉';flex:none;width:25px;text-align:center;color:#80545a;font-size:18px}
.premiumCardPage .dcContact a:first-child::before{content:'☎'}
.premiumCardPage .dcContact a:last-child::before{content:'in';font:bold 15px Arial}
.premiumCardPage .dcActions{display:grid;grid-template-columns:1fr 1fr;gap:10px;margin:0 0 16px}
.premiumCardPage .dcActions button{display:flex;align-items:center;justify-content:center;gap:8px;min-height:52px;border:1px solid #103d2c;border-radius:14px;background:#103d2c;color:white;font-size:13px;font-weight:700;cursor:pointer}
.premiumCardPage .dcActions button+button{background:#fffdf9;color:#103d2c}
.premiumCardPage .dcActions b{font-size:19px}
.premiumCardPage .dcWebsite{display:flex;align-items:center;justify-content:center;gap:8px;padding:12px;color:#103d2c;text-decoration:none;font-size:13px;flex-wrap:wrap}
.premiumCardPage .dcFooter{display:flex;flex-direction:column;gap:5px;padding:18px;background:#103d2c;color:#faf7f2}
.premiumCardPage .dcFooter span{font-family:Georgia,serif;letter-spacing:2px;color:#faf7f2}
.premiumCardPage .dcFooter em{color:#e5b8b5;font-style:normal}
.premiumCardPage .dcFooter small{font-size:10px;letter-spacing:2px;color:#faf7f2}
@media(max-width:360px){.premiumCardPage .dcBody{padding:18px 14px}.premiumCardPage .dcActions{grid-template-columns:1fr}}
`}</style></main>}