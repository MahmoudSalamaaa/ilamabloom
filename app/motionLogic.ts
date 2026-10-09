export type MotionPoint={x:number;y:number;visibility?:number};
export type MotionFrame={leftUp:boolean;rightUp:boolean;armsOpen:boolean;lean:number;valid:boolean};
export function interpretPose(points:MotionPoint[]):MotionFrame{
const blank={leftUp:false,rightUp:false,armsOpen:false,lean:0,valid:false};
if(!Array.isArray(points)||points.length<25)return blank;
const required=[11,12,15,16,23,24];
if(required.some(i=>!points[i]||!Number.isFinite(points[i].x)||!Number.isFinite(points[i].y)||(points[i].visibility??1)<.45))return blank;
const width=Math.max(.08,Math.abs(points[11].x-points[12].x));
const shoulderMid=(points[11].x+points[12].x)/2;
const hipMid=(points[23].x+points[24].x)/2;
return {leftUp:points[15].y<points[11].y-.06,rightUp:points[16].y<points[12].y-.06,armsOpen:Math.abs(points[15].x-points[16].x)>width*1.6,lean:hipMid-shoulderMid,valid:true};
}
export function qualifies(kind:string,frame:MotionFrame,previous:MotionFrame):boolean{
if(!frame.valid)return false;
switch(kind){
case "reach":case "harvest":return frame.leftUp||frame.rightUp||frame.armsOpen;
case "stretch":case "mirror":return frame.leftUp||frame.rightUp;
case "swim":return frame.armsOpen;
case "dance":case "family":return frame.armsOpen||Math.abs(frame.lean-previous.lean)>.045;
case "march":return Math.abs(frame.lean-previous.lean)>.045;
default:return false;
}}
export function normalizeProgress(count:number,goal:number){return Math.min(100,Math.max(0,Math.round(100*Math.max(0,count)/Math.max(1,goal))))}
