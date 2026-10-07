import type {Metadata} from "next";
import {notFound} from "next/navigation";
import IlamaApp from "../IlamaApp";

const pages={
  explore:["Explore","Practical nutrition knowledge for everyday choices."],
  "life-stages":["Life Stages & Sport","Nutrition guidance across life stages, movement and performance."],
  "mental-health-nutrition":["Mental Health & Nutrition","Explore the relationship between food, context and mental wellbeing."],
  kids:["Kids & Family","Friendly nutrition learning and family tools designed for children and parents."],
  everyday:["Everyday","Simple nutrition tools for real everyday routines."],
  "weekly-bloom":["Weekly Bloom","Reflect on your week and build healthier habits with context."],
  "easy-mode":["Easy Mode","A calmer, simpler way to use ILAMA BLOOM."],
  "food-lens":["Food Lens","Look at food with practical nutrition context."],
  "food-atlas":["Food Atlas","Explore familiar foods with clear, practical nutrition context."],
  "quick-log":["Quick Log","Privately capture food, water, sleep, symptoms and everyday context."],
  journal:["Journal","A private space to connect food, body and everyday context."],
  "visit-prep":["Visit Prep","Organize questions and health context before your clinical visit."],
  about:["About","Meet ILAMA BLOOM and its approach to practical nutrition education."],
  privacy:["Privacy","How ILAMA BLOOM handles privacy and personal information."],
  sitemap:["Sitemap","Explore all ILAMA BLOOM sections and tools."]
} as const;\n\nconst views:Record<Slug,string>={explore:"learn","life-stages":"life","mental-health-nutrition":"mind",kids:"kids",everyday:"everyday","weekly-bloom":"weekly","easy-mode":"easy","food-lens":"lens","food-atlas":"atlas","quick-log":"log",journal:"journal","visit-prep":"visit",about:"about",privacy:"privacy",sitemap:"sitemap"};

type Slug=keyof typeof pages;
const base="https://www.ilamabloom.com";

export async function generateMetadata({params}:{params:Promise<{slug:string}>}):Promise<Metadata>{
  const {slug}=await params;
  if(!(slug in pages)) return {};
  const [title,description]=pages[slug as Slug];
  const path="/"+slug;
  return {
    title,
    description,
    alternates:{
      canonical:path,
      languages:{
        en:base+path+"?lang=en",
        ar:base+path+"?lang=ar"
      }
    },
    openGraph:{title:title+" · ILAMA BLOOM",description,url:base+path,siteName:"ILAMA BLOOM",type:"website"},
    twitter:{card:"summary_large_image",title:title+" · ILAMA BLOOM",description}
  };
}

export default async function EditorialRoute({params}:{params:Promise<{slug:string}>}){
  const {slug}=await params;
  if(!(slug in pages)) notFound();
  return <IlamaApp initialView={views[slug as Slug] as any}/>;
}
