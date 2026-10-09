export type CameraState='off'|'loading'|'ready'|'error';
/** Owns a single optional camera request, its stream, timer and device-loss listeners. */
export class OptionalCamera{
 private ticket=0;private disposed=false;private timer:ReturnType<typeof setTimeout>|undefined;
 private listeners:Array<()=>void>=[];private pending=false;
 stream:MediaStream|null=null;
 constructor(private getMedia:()=>Promise<MediaStream>,private onState:(state:CameraState)=>void,private onLost:()=>void,private timeout=15000){}
 private clearTimer(){if(this.timer)clearTimeout(this.timer);this.timer=undefined}
 private release(){this.listeners.forEach(remove=>remove());this.listeners=[];this.stream?.getTracks().forEach(track=>track.stop());this.stream=null}
 async start(consent:boolean){
  if(!consent||this.disposed||this.pending||this.stream)return;
  const ticket=++this.ticket;this.pending=true;this.onState('loading');
  this.timer=setTimeout(()=>{if(this.disposed||ticket!==this.ticket)return;this.ticket++;this.pending=false;this.timer=undefined;this.onState('error')},this.timeout);
  try{const stream=await this.getMedia();
   if(this.disposed||ticket!==this.ticket){stream.getTracks().forEach(track=>track.stop());return}
   this.clearTimer();this.pending=false;this.stream=stream;
   for(const track of stream.getVideoTracks()){const ended=()=>{if(this.disposed)return;this.stop();this.onState('error');this.onLost()};track.addEventListener('ended',ended);this.listeners.push(()=>track.removeEventListener('ended',ended))}
   if(!stream.getVideoTracks().length||stream.getVideoTracks().every(track=>track.readyState==='ended')){this.stop();this.onState('error');this.onLost();return}
   this.onState('ready');
  }catch{if(!this.disposed&&ticket===this.ticket){this.clearTimer();this.pending=false;this.onState('error')}}
 }
 stop(){this.ticket++;this.pending=false;this.clearTimer();this.release();if(!this.disposed)this.onState('off')}
 dispose(){this.disposed=true;this.stop()}
}
