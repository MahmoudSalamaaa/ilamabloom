"use client";
import {useEffect,useRef,useState,type PointerEvent,type KeyboardEvent} from "react";

import styles from "./FarmCanvas.module.css";

type Zone="field"|"pond"|"kitchen";
type Plot={crop:string;water:number}|null;
type SceneProps={ar:boolean;onZone:(zone:Zone)=>void;plots:Plot[]};
type Point={x:number;y:number};
type World={avatar:Point;target:Point;zoom:number;offset:Point;paused:boolean};
const WIDTH=960,HEIGHT=540;
const destinations:{id:Zone;point:Point;label:{ar:string;en:string};emoji:string}[]=[
 {id:"field",point:{x:455,y:344},label:{ar:"الحديقة",en:"Garden"},emoji:"🌱"},
 {id:"pond",point:{x:756,y:347},label:{ar:"البحيرة",en:"Pond"},emoji:"🐟"},
 {id:"kitchen",point:{x:207,y:276},label:{ar:"مطبخ تيتا",en:"Grandma's kitchen"},emoji:"🍲"}
];
const clamp=(n:number,min:number,max:number)=>Math.min(max,Math.max(min,n));
const dist=(a:Point,b:Point)=>Math.hypot(a.x-b.x,a.y-b.y);
const oval=(c:CanvasRenderingContext2D,x:number,y:number,rx:number,ry:number,fill:string)=>{c.beginPath();c.ellipse(x,y,rx,ry,0,0,Math.PI*2);c.fillStyle=fill;c.fill()};
const round=(c:CanvasRenderingContext2D,x:number,y:number,w:number,h:number,r:number,fill:string)=>{c.beginPath();c.roundRect(x,y,w,h,r);c.fillStyle=fill;c.fill()};
export default function FarmCanvas({ar,onZone,plots}:SceneProps){
 const canvasRef=useRef<HTMLCanvasElement>(null);
 const sprites=useRef<Record<string,HTMLImageElement>>({});
 const plotsRef=useRef(plots);plotsRef.current=plots;
 const callback=useRef(onZone);callback.current=onZone;
 const world=useRef<World>({avatar:{x:345,y:360},target:{x:345,y:360},zoom:1,offset:{x:0,y:0},paused:false});
 const [motion,setMotion]=useState(true);
 const [zoomLabel,setZoomLabel]=useState(100);
 const [selected,setSelected]=useState<Zone|null>(null);
 const [paused,setPaused]=useState(false);
 useEffect(()=>{const m=window.matchMedia("(prefers-reduced-motion: reduce)");const apply=()=>setMotion(!m.matches);apply();m.addEventListener("change",apply);return()=>m.removeEventListener("change",apply)},[]);
 useEffect(()=>{world.current.paused=paused},[paused]);
 const move=(x:number,y:number)=>{const w=world.current;w.target={x:clamp(x,25,935),y:clamp(y,150,505)}};
 const pick=(id:Zone)=>{const d=destinations.find(x=>x.id===id)!;setSelected(id);move(d.point.x,d.point.y);callback.current(id)};
 useEffect(()=>{
  const canvas=canvasRef.current;if(!canvas)return;
  const ctx=canvas.getContext("2d");if(!ctx)return;
  const images=sprites.current;
  for(const [id,url] of Object.entries({ilama:"/kids/ilama.webp",ilamo:"/kids/ilamo.webp",grandpa:"/kids/grandpa.webp",grandma:"/kids/grandma.webp"})){if(!images[id]){const img=new window.Image();img.src=url;images[id]=img}}
  let frame=0,last=0,alive=true,visible=true;
  const observer=new IntersectionObserver(entries=>{visible=entries[0]?.isIntersecting??true});observer.observe(canvas);
  const draw=(now:number)=>{
   if(!alive)return;
   const w=world.current;const dt=Math.min((now-last)/1000||0,0.05);last=now;
   if(!visible||document.hidden){if(!w.paused)frame=requestAnimationFrame(draw);return;}
   if(!motion)w.avatar={...w.target};
   if(motion&&!w.paused){const d=dist(w.avatar,w.target);if(d>2){const s=Math.min(d,dt*150);w.avatar.x+=(w.target.x-w.avatar.x)*s/d;w.avatar.y+=(w.target.y-w.avatar.y)*s/d}}
   ctx.clearRect(0,0,WIDTH,HEIGHT);ctx.fillStyle="#cdebe3";ctx.fillRect(0,0,WIDTH,HEIGHT);
   ctx.save();ctx.translate(WIDTH/2,HEIGHT/2);ctx.scale(w.zoom,w.zoom);ctx.translate(-WIDTH/2+w.offset.x,-HEIGHT/2+w.offset.y);
   // Landscape is procedural canvas geometry, not generated artwork.
   ctx.fillStyle="#bde3c9";ctx.fillRect(0,0,WIDTH,200);
   oval(ctx,145,104,235,75,"#f9efc6");oval(ctx,782,116,310,90,"#e7f3cf");
   ctx.fillStyle="#9ac98b";ctx.fillRect(0,200,WIDTH,340);
   ctx.beginPath();ctx.moveTo(0,480);ctx.quadraticCurveTo(430,400,960,492);ctx.lineTo(960,540);ctx.lineTo(0,540);ctx.fillStyle="#79b76c";ctx.fill();
   ctx.beginPath();ctx.moveTo(190,480);ctx.bezierCurveTo(380,440,465,390,480,330);ctx.strokeStyle="#e9d6a6";ctx.lineWidth=54;ctx.lineCap="round";ctx.stroke();
   // Farmhouse
   round(ctx,80,177,235,177,13,"#f8d7a5");ctx.beginPath();ctx.moveTo(60,190);ctx.lineTo(194,85);ctx.lineTo(338,190);ctx.closePath();ctx.fillStyle="#b66b61";ctx.fill();
   round(ctx,181,271,55,83,5,"#92634d");round(ctx,101,212,57,49,8,"#a9d7d7");round(ctx,250,212,44,49,8,"#a9d7d7");
   // Vegetable plots
   for(let i=0;i<6;i++){const x=364+(i%3)*76,y=245+Math.floor(i/3)*66;round(ctx,x,y,62,50,9,"#a37a55");const p=plotsRef.current[i];if(p){const grow=Math.min(3,Math.max(0,p.water));for(let k=0;k<3;k++){const px=x+14+k*16;if(grow===0){oval(ctx,px,y+28,4,3,"#e6c791")}else{ctx.strokeStyle="#3f8153";ctx.lineWidth=3;ctx.beginPath();ctx.moveTo(px,y+38);ctx.lineTo(px,y+34-grow*7);ctx.stroke();oval(ctx,px-5,y+31-grow*5,7+grow,4+grow,"#70ad61");if(grow>=2)oval(ctx,px+4,y+26-grow*4,7,5,p.crop==="tomato"?"#dd755f":p.crop==="carrot"?"#e4a05a":"#94ca75")}}}}
   // Pond, fish and reeds
   oval(ctx,764,335,164,105,"#e5dfad");oval(ctx,764,335,152,94,"#69bed1");oval(ctx,764,335,133,75,"#8ed3dc");
   for(let i=0;i<4;i++){const t=motion&&!w.paused?now/1400:0;const x=680+i*52+Math.sin(t+i)*14;const y=315+(i%2)*43+Math.cos(t+i)*8;oval(ctx,x,y,17,9,i%2?"#f7c678":"#ed986b");ctx.beginPath();ctx.moveTo(x-16,y);ctx.lineTo(x-27,y-8);ctx.lineTo(x-27,y+8);ctx.closePath();ctx.fill()}
   for(let i=0;i<7;i++){const x=630+i*44;ctx.strokeStyle="#528b5e";ctx.lineWidth=4;ctx.beginPath();ctx.moveTo(x,432);ctx.lineTo(x-4,408-i%3*5);ctx.stroke()}
   // Trees and harvest, characters use only existing approved WebP.
   for(const [x,y] of [[45,254],[345,164],[608,184],[921,246]] as [number,number][]) {round(ctx,x-7,y,14,62,3,"#8e694c");oval(ctx,x,y-15,45,43,"#6aa56a");oval(ctx,x-18,y-27,22,22,"#8dbd74")}
   const character=(id:string,x:number,y:number,size:number)=>{const img=images[id];if(img?.complete&&img.naturalWidth>0){const ratio=img.naturalWidth/img.naturalHeight;const h=size,wid=h*ratio;ctx.drawImage(img,x-wid/2,y-h,wid,h)}else{oval(ctx,x,y-28,18,25,"#f7e6b9");oval(ctx,x,y-52,13,13,"#d3a47d")}};
   character("grandpa",100,400,76);character("grandma",290,412,76);character("ilamo",570,490,80);
   character("ilama",w.avatar.x,w.avatar.y,91);
   for(const d of destinations){const x=d.point.x,y=d.point.y;round(ctx,x-62,y-92,124,40,15,selected===d.id?"#386d52":"#fffdf0");ctx.fillStyle=selected===d.id?"#fff":"#2f523e";ctx.font="bold 19px sans-serif";ctx.textAlign="center";ctx.fillText(d.emoji+" "+(ar?d.label.ar:d.label.en),x,y-66)}
   ctx.restore();
   if(!w.paused)frame=requestAnimationFrame(draw)
  };
  frame=requestAnimationFrame(draw);
  return()=>{alive=false;observer.disconnect();cancelAnimationFrame(frame)};
 },[ar,motion,paused,selected]);
 const click=(e:PointerEvent<HTMLCanvasElement>)=>{
  if(paused)return;const r=e.currentTarget.getBoundingClientRect();const w=world.current;const x=((e.clientX-r.left)/r.width*WIDTH-WIDTH/2)/w.zoom+WIDTH/2-w.offset.x;const y=((e.clientY-r.top)/r.height*HEIGHT-HEIGHT/2)/w.zoom+HEIGHT/2-w.offset.y;
  const d=destinations.find(d=>dist({x,y},d.point)<105);if(d)pick(d.id);else move(x,y)
 };
 const keys=(e:KeyboardEvent<HTMLCanvasElement>)=>{const w=world.current;const k=e.key.toLowerCase();const dx=k==="arrowright"||k==="d"?35:k==="arrowleft"||k==="a"?-35:0;const dy=k==="arrowdown"||k==="s"?35:k==="arrowup"||k==="w"?-35:0;if(dx||dy){e.preventDefault();move(w.avatar.x+dx,w.avatar.y+dy)}};
 const pan=(dx:number,dy:number)=>{const w=world.current;w.offset={x:clamp(w.offset.x+dx,-180,180),y:clamp(w.offset.y+dy,-130,130)}};
 const zoom=(delta:number)=>{world.current.zoom=clamp(Math.round((world.current.zoom+delta)*10)/10,0.8,1.6);setZoomLabel(Math.round(world.current.zoom*100))};
 return <div className={styles.scene}>
  <canvas ref={canvasRef} width={WIDTH} height={HEIGHT} tabIndex={0} onPointerDown={click} onKeyDown={keys} aria-label={ar?"عالم مزرعة تفاعلي. اضغط مكان للتحرك، أو استخدم الأسهم، أو اختار وجهة من الأزرار.":"Interactive farm world. Tap to walk, use arrow keys, or select a destination button."} className={styles.canvas}/>
  <div className={styles.toolbar}>
   <div className={styles.destinations}>{destinations.map(d=><button key={d.id} type="button" onClick={()=>pick(d.id)} aria-pressed={selected===d.id}>{d.emoji} {ar?d.label.ar:d.label.en}</button>)}</div>
   <div className={styles.controls}>
    <button type="button" onClick={()=>pan(-45,0)} aria-label={ar?"حرّك الخريطة يسار":"Pan left"}>←</button>
    <button type="button" onClick={()=>pan(45,0)} aria-label={ar?"حرّك الخريطة يمين":"Pan right"}>→</button>
    <button type="button" onClick={()=>pan(0,-40)} aria-label={ar?"حرّك الخريطة أعلى":"Pan up"}>↑</button>
    <button type="button" onClick={()=>pan(0,40)} aria-label={ar?"حرّك الخريطة أسفل":"Pan down"}>↓</button>
    <button type="button" onClick={()=>zoom(-0.2)} aria-label={ar?"تصغير":"Zoom out"}>−</button><output aria-live="off">{zoomLabel}%</output><button type="button" onClick={()=>zoom(0.2)} aria-label={ar?"تكبير":"Zoom in"}>+</button>
    <button type="button" onClick={()=>setPaused(x=>!x)} aria-pressed={paused}>{paused?(ar?"▶ استكمال":"▶ Resume"):(ar?"⏸ إيقاف":"⏸ Pause")}</button>
   </div>
  </div>
  <p className={styles.hint}>{ar?"اضغط على الأرض لتحريك إيلاما، أو اختار الحديقة والبحيرة والمطبخ. مفيش وقت محدد أو عقوبة.":"Tap the ground to move Ilama, or choose garden, pond and kitchen. No timer or penalties."}</p>
 </div>
}