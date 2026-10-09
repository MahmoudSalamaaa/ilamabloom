import type {KidsZone} from './domain';
export const milestoneIds=['seed-plant','seed-harvest','seed-meal','nile-fish','nile-food','nile-story','egypt-stop','egypt-origin','egypt-story','move-play','move-science','move-observe'] as const;
export type Milestone=typeof milestoneIds[number];
export type Destination={hub?:'farm'|'aqua'|'egypt'|'move';anchor:string};
type Step={id:Milestone;ar:string;en:string;destination:Destination};
export const trails:{id:string;icon:string;ar:string;en:string;steps:Step[]}[]=[
 {id:'seed',icon:'🌱',ar:'من البذرة إلى الطبق',en:'From seed to plate',steps:[
  {id:'seed-plant',ar:'ازرع بذرة في المزرعة',en:'Plant a seed on the farm',destination:{hub:'farm',anchor:'kids-adventure-hub'}},
  {id:'seed-harvest',ar:'اسقِ نبتتك واجمع محصولًا',en:'Water your plant and collect a harvest',destination:{hub:'farm',anchor:'kids-adventure-hub'}},
  {id:'seed-meal',ar:'كوّن فكرة طبق في المطبخ',en:'Create a meal idea in the kitchen',destination:{anchor:'kids-kitchen-studio'}}]},
 {id:'nile',icon:'🐟',ar:'رحلة النيل والبحر',en:'Nile and sea journey',steps:[
  {id:'nile-fish',ar:'اكتشف سمكة وموطنها',en:'Discover a fish and its habitat',destination:{hub:'aqua',anchor:'kids-adventure-hub'}},
  {id:'nile-food',ar:'رتّب رحلة البلطي إلى المائدة',en:'Sequence tilapia’s journey to the table',destination:{anchor:'kids-food-discovery'}},
  {id:'nile-story',ar:'كمل حكاية سمك النيل',en:'Complete the Nile fish story',destination:{anchor:'kids-quest-trail'}}]},
 {id:'egypt',icon:'🗺️',ar:'مستكشف مصر',en:'Egypt explorer',steps:[
  {id:'egypt-stop',ar:'اكتشف محصولًا في محافظة',en:'Discover a crop in a governorate',destination:{hub:'egypt',anchor:'kids-adventure-hub'}},
  {id:'egypt-origin',ar:'اكتشف مصادر الطعام',en:'Explore where foods come from',destination:{anchor:'kids-food-discovery'}},
  {id:'egypt-story',ar:'كمل حكاية الطعام في مصر',en:'Complete the Egyptian food story',destination:{anchor:'kids-quest-trail'}}]},
 {id:'move',icon:'🦋',ar:'اتحرك ولاحظ الطبيعة',en:'Move and notice nature',steps:[
  {id:'move-play',ar:'اختار حركة مناسبة ليك',en:'Choose a move that suits you',destination:{hub:'move',anchor:'kids-adventure-hub'}},
  {id:'move-science',ar:'اكتشف حاجة يحتاجها النبات',en:'Discover something plants need',destination:{anchor:'kids-weather-lab'}},
  {id:'move-observe',ar:'لاحظ احتياجات نبتة التجربة',en:'Observe the toy plant’s needs',destination:{anchor:'kids-weather-lab'}}]}
];
const record=(v:unknown):Record<string,unknown>=>v&&typeof v==='object'&&!Array.isArray(v)?v as Record<string,unknown>:{};
const has=(v:unknown,id:string)=>Array.isArray(v)&&v.includes(id);
const any=(v:unknown)=>Array.isArray(v)&&v.length>0;
/** Learning evidence only. No timers, ranking, arbitrary check-off or financial value. */
export function observedMilestones(states:Partial<Record<KidsZone,unknown>>):Milestone[]{
 const farm=record(states.farm),stock=record(farm.harvest),quests=record(states.quests),weather=record(states.weather);
 const harvest=Object.values(stock).some(n=>typeof n==='number'&&n>0),cooked=typeof farm.visits==='number'&&farm.visits>0;
 const evidence:Record<Milestone,boolean>={
  'seed-plant':any((Array.isArray(farm.plots)?farm.plots:[]).filter(Boolean))||harvest||cooked,
  'seed-harvest':harvest||cooked,'seed-meal':any(states.kitchen)||cooked,
  'nile-fish':any(states.aqua),'nile-food':has(states.food,'river'),'nile-story':quests.fish===3,
  'egypt-stop':any(states.egypt),'egypt-origin':has(states.food,'origins'),'egypt-story':quests.egypt===3,
  'move-play':any(states.movement),'move-science':any(weather.completed),'move-observe':has(weather.observations,'balanced')||weather.experiments===1
 };
 return milestoneIds.filter(id=>evidence[id]);
}
