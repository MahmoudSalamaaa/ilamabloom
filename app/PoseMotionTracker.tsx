"use client";
import {useCallback,useEffect,useRef,useState} from "react";
export type MoveKind="reach"|"march"|"dance"|"swim"|"stretch"|"harvest"|"mirror"|"family";
export type MotionSignal={leftHandRaised:boolean;rightHandRaised:boolean;leftReach:boolean;rightReach:boolean;armsWide:boolean;bodyShift:number;confidence:number};
type Landmark={x:number;y:number;visibility?:number};
type Result={landmarks?:Landmark[][]};
type Landmarker={detectForVideo:(video:HTMLVideoElement,now:number)=>Result;close:()=>void};
type Api={PoseLandmarker:{createFromOptions:(vision:unknown,options:unknown)=>Promise<Landmarker>};FilesetResolver:{forVisionTasks:(path:string)=>Promise<unknown>}};
type Props={enabled:boolean;video:HTMLVideoElement|null;kind:MoveKind;onMove:()=>void;onStatus:(s:string)=>void;ar:boolean};
const CDN="https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@0.10.22/vision_bundle.mjs";
const WASM="https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@0.10.22/wasm";
const MODEL="https://storage.googleapis.com/mediapipe-models/pose_landmarker/pose_landmarker_lite/float16/1/pose_landmarker_lite.task";
function classify(p:Landmark[]):MotionSignal|null{
if(p.length<29)return null;
const visible=[11,12,13,14,15,16,23,24].every(i=>(p[i]?.visibility??1)>.45);
if(!visible)return null;
const shoulder=Math.max(.08,Math.abs(p[11].x-p[12].x));
const mid=(p[11].x+p[12].x)/2;
return {leftHandRaised:p[15].y<p[11].y-.06,rightHandRaised:p[16].y<p[12].y-.06,leftReach:Math.abs(p[15].x-mid)>shoulder*.95,rightReach:Math.abs(p[16].x-mid)>shoulder*.95,armsWide:Math.abs(p[15].x-p[16].x)>shoulder*1.6,bodyShift:(p[23].x+p[24].x)/2-mid,confidence:1};
}
export default function PoseMotionTracker({enabled,video,kind,onMove,onStatus,ar}:Props){
const [status,setStatus]=useState("idle");const cb=useRef(onMove);const sb=useRef(onStatus);const last=useRef(0);const phase=useRef(false);const prevShift=useRef(0);const tick=useRef(0);
useEffect(()=>{cb.current=onMove;sb.current=onStatus},[onMove,onStatus]);
useEffect(()=>{if(!enabled||!video)return;
let disposed=false;let detector:Landmarker|null=null;let frame=0;let busy=false;let lastVideo=-1;
const message=(s:string)=>{if(disposed)return;setStatus(s);sb.current(s)};
(async()=>{try{
message("loading");
const api=await import(/* webpackIgnore: true */ CDN) as unknown as Api;
if(disposed)return;
const vision=await api.FilesetResolver.forVisionTasks(WASM);
if(disposed)return;
detector=await api.PoseLandmarker.createFromOptions(vision,{baseOptions:{modelAssetPath:MODEL,delegate:"CPU"},runningMode:"VIDEO",numPoses:1,minPoseDetectionConfidence:.55,minPosePresenceConfidence:.55,minTrackingConfidence:.55});
if(disposed)return;
message("ready");
const loop=(now:number)=>{if(disposed)return;frame=requestAnimationFrame(loop);if(busy||now-tick.current<110||video.readyState<2||video.currentTime===lastVideo)return;tick.current=now;lastVideo=video.currentTime;busy=true;
try{const result=detector?.detectForVideo(video,now);const p=result?.landmarks?.[0];const m=p?classify(p):null;if(!m){phase.current=false;return}
const active=kind==="reach"||kind==="harvest"?m.leftReach||m.rightReach:kind==="stretch"?m.leftHandRaised||m.rightHandRaised:kind==="swim"?m.armsWide:kind==="mirror"?m.leftHandRaised||m.rightHandRaised:kind==="dance"||kind==="family"?m.armsWide||Math.abs(m.bodyShift-prevShift.current)>.06:Math.abs(m.bodyShift-prevShift.current)>.045;
prevShift.current=m.bodyShift;
if(active&&!phase.current&&now-last.current>1200){last.current=now;cb.current();phase.current=true}else if(!active){phase.current=false}
}catch{message("tracking-error")}finally{busy=false}};
frame=requestAnimationFrame(loop);
}catch{message("unavailable")}})();
return()=>{disposed=true;cancelAnimationFrame(frame);detector?.close();phase.current=false};
},[enabled,video,kind]);
if(!enabled)return null;
return <div role="status" aria-live="polite" style={{padding:10,borderRadius:12,background:"#e9f4ee",margin:"8px 0"}}>{status==="ready"?(ar?"تتبع الحركة شغال على الجهاز. لو الحركة مش بتتسجل استخدم زر التأكيد.":"On-device motion tracking is active. Use the confirm button if tracking misses a move."):status==="loading"?(ar?"تحميل نموذج تتبع الحركة...":"Loading motion model..."):status==="unavailable"||status==="tracking-error"?(ar?"التتبع غير متاح حاليًا. استخدم التأكيد اليدوي.":"Tracking unavailable. Use manual confirmation."):(ar?"شغّل الكاميرا لبدء التتبع.":"Enable camera to start tracking.")}</div>;
}