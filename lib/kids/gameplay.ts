import {cleanState} from './domain';
export type CropId='tomato'|'carrot'|'lettuce';
export type FarmState={plots:({crop:string;water:number}|null)[];harvest:Record<string,number>;visits:number};
export type FarmAction={kind:'plot';plot:number;crop:CropId}|{kind:'cook';ingredients:string[]};
const steps:Record<string,number>={tomato:3,carrot:2,lettuce:2};
/** Updates inventory from current state. Repeated events cannot spend or harvest a stale snapshot. */
export function farmAction(farm:FarmState,action:FarmAction):FarmState{
 if(action.kind==='cook'){
  if(!action.ingredients.length||action.ingredients.length>3||action.ingredients.some(id=>!(id in steps)))return farm;
  const needed:Record<string,number>={};for(const id of action.ingredients)needed[id]=(needed[id]||0)+1;
  if(Object.entries(needed).some(([id,n])=>(farm.harvest[id]||0)<n))return farm;
  const harvest={...farm.harvest};for(const [id,n] of Object.entries(needed))harvest[id]-=n;
  return {...farm,harvest,visits:Math.min(999,farm.visits+1)};
 }
 if(!Number.isInteger(action.plot)||action.plot<0||action.plot>=6||!(action.crop in steps))return farm;
 const plot=farm.plots[action.plot];const plots=[...farm.plots];
 if(!plot)plots[action.plot]={crop:action.crop,water:0};
 else if(plot.water>=steps[plot.crop]){plots[action.plot]=null;return {...farm,plots,harvest:{...farm.harvest,[plot.crop]:Math.min(999,(farm.harvest[plot.crop]||0)+1)}}}
 else plots[action.plot]={...plot,water:Math.min(steps[plot.crop],plot.water+1)};
 return {...farm,plots};
}
export type MotionSample={leftHand:{x:number;y:number};rightHand:{x:number;y:number};leftKneeY:number|null;rightKneeY:number|null;lean:number;leftUp:boolean;rightUp:boolean;armsWide:boolean;leftReach:boolean;rightReach:boolean};
export type MovementMode='reach'|'march'|'dance'|'swim'|'stretch'|'harvest'|'mirror'|'family';
export function moved(kind:MovementMode,now:MotionSample,previous:MotionSample|null){
 if(!previous)return false;
 const hand=Math.max(Math.hypot(now.leftHand.x-previous.leftHand.x,now.leftHand.y-previous.leftHand.y),Math.hypot(now.rightHand.x-previous.rightHand.x,now.rightHand.y-previous.rightHand.y));
 const lean=Math.abs(now.lean-previous.lean);
 const knee=now.leftKneeY!==null&&previous.leftKneeY!==null&&now.rightKneeY!==null&&previous.rightKneeY!==null?Math.max(Math.abs(now.leftKneeY-previous.leftKneeY),Math.abs(now.rightKneeY-previous.rightKneeY)):0;
 switch(kind){
 case 'reach':case 'harvest':return (now.leftReach||now.rightReach)&&hand>.022;
 case 'stretch':case 'mirror':return (now.leftUp||now.rightUp)&&hand>.022;
 case 'swim':return now.armsWide&&hand>.022;
 case 'march':return knee>.025||hand>.035;
 case 'dance':case 'family':return hand>.035||lean>.025||knee>.025;
 }
}
export function moveGoal(base:number,pace:'gentle'|'regular'|'extended'){
 return pace==='gentle'?Math.max(3,Math.ceil(base/2)):pace==='extended'?Math.min(12,base+2):base;
}

export type PlantCondition='dry'|'dark'|'flooded'|'balanced';
/** A deliberately simple toy, never a watering prescription for a real species. */
export function simulatePlant(water:number,light:number,drain:boolean):PlantCondition{
 if(!Number.isFinite(water)||!Number.isFinite(light))return 'dry';
 if(water<=0)return 'dry';
 if(water>=2&&!drain)return 'flooded';
 if(light<=0)return 'dark';
 return 'balanced';
}

export type MealIdea={id:number;ingredients:string[]};
/** Bounded ideas use unique local IDs even when two creations share a clock tick. */
export function saveMealIdea(previous:MealIdea[],ingredients:string[],now:number):MealIdea[]{
 const saved=cleanState('kitchen',previous) as MealIdea[];
 let id=Number.isSafeInteger(now)&&now>0?now:1;
 while(saved.some(idea=>idea.id===id))id=id===Number.MAX_SAFE_INTEGER?1:id+1;
 const idea=cleanState('kitchen',[{id,ingredients}]) as MealIdea[];
 return idea.length?[...saved,...idea].slice(-8):saved;
}
