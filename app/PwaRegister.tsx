"use client";
import {useEffect} from "react";

export default function PwaRegister(){
  useEffect(()=>{
    if(!("serviceWorker" in navigator)) return;

    let disposed=false;const cleanups:Array<()=>void>=[];
    const register=async()=>{
      try{
        const registration=await navigator.serviceWorker.register("/sw.js",{updateViaCache:"none"});
        await registration.update();
        if(disposed)return;

        if(registration.waiting){
          registration.waiting.postMessage({type:"SKIP_WAITING"});
        }

        const onUpdate=()=>{
          if(disposed)return;
          const worker=registration.installing;
          if(!worker) return;
          const onState=()=>{
            if(disposed)return;
            if(worker.state==="installed"&&navigator.serviceWorker.controller){
              worker.postMessage({type:"SKIP_WAITING"});
            }
          };
          worker.addEventListener("statechange",onState);cleanups.push(()=>worker.removeEventListener("statechange",onState));
        };
        registration.addEventListener("updatefound",onUpdate);cleanups.push(()=>registration.removeEventListener("updatefound",onUpdate));

        navigator.serviceWorker.controller?.postMessage({type:"CLEAR_OLD_CACHES"});
      }catch(error){console.error("service worker registration failed",error)}
    };

    register();

    const onControllerChange=()=>{try{sessionStorage.setItem("ib-sw-updated","1")}catch{}};
    navigator.serviceWorker.addEventListener("controllerchange",onControllerChange);
    return()=>{disposed=true;navigator.serviceWorker.removeEventListener("controllerchange",onControllerChange);cleanups.forEach(cleanup=>cleanup())};
  },[]);
  return null;
}
