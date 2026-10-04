import {neon} from "@neondatabase/serverless";
import type {NeonQueryFunction} from "@neondatabase/serverless";
import {currentUser} from "../../../lib/auth/server";
function db(){const url=process.env.DATABASE_URL||process.env.POSTGRES_URL||process.env.ILAMA_BLOOM_DATABASE_URL||process.env.ILAMA_BLOOM_POSTGRES_URL||process.env.NutClueDB_DATABASE_URL||process.env.NutClueDB_POSTGRES_URL;if(!url)throw new Error("Database is not configured");return neon(url)}
async function ensure(sql:NeonQueryFunction<false,false>){
 await sql`CREATE TABLE IF NOT EXISTS public.family_profiles (
  id text PRIMARY KEY DEFAULT md5(random()::text || clock_timestamp()::text),
  owner_user_id text NOT NULL,
  display_name text NOT NULL,
  relationship text NOT NULL DEFAULT 'self',
  life_stage text NOT NULL DEFAULT 'adult',
  birth_date date,
  notes text NOT NULL DEFAULT '',
  is_self boolean NOT NULL DEFAULT false,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
 )`;
 await sql`CREATE INDEX IF NOT EXISTS family_profiles_owner_idx ON public.family_profiles (owner_user_id, created_at)`;
 await sql`CREATE TABLE IF NOT EXISTS public.care_records (
  id text PRIMARY KEY DEFAULT md5(random()::text || clock_timestamp()::text),
  user_id text NOT NULL,
  family_profile_id text,
  kind text NOT NULL,
  title text NOT NULL,
  detail text NOT NULL DEFAULT '',
  severity smallint,
  metadata jsonb NOT NULL DEFAULT '{}'::jsonb,
  occurred_at timestamptz NOT NULL DEFAULT now(),
  created_at timestamptz NOT NULL DEFAULT now()
 )`;
 await sql`ALTER TABLE public.care_records ADD COLUMN IF NOT EXISTS metadata jsonb NOT NULL DEFAULT '{}'::jsonb`;
 await sql`CREATE INDEX IF NOT EXISTS care_records_user_time_idx ON public.care_records(user_id,occurred_at DESC)`;
}
const json=(b:unknown,s=200)=>Response.json(b,{status:s,headers:{"Cache-Control":"no-store"}});
const clean=(v:unknown,n:number)=>String(v||"").trim().slice(0,n);const kinds=new Set(["medication","symptom","measurement","visit-note","wellbeing-observation"]);
const validSeverity=(v:unknown)=>v==null||v===""?null:Number(v);
const cleanMetadata=(kind:string,v:unknown)=>{const x=v&&typeof v==="object"?v as Record<string,unknown>:{};if(kind==="medication")return {dose:clean(x.dose,80),frequency:clean(x.frequency,80),status:["active","stopped","as-needed"].includes(clean(x.status,20))?clean(x.status,20):"",startDate:clean(x.startDate,20)};if(kind==="symptom")return {onset:clean(x.onset,80),duration:clean(x.duration,80),status:["ongoing","improved","resolved","intermittent"].includes(clean(x.status,20))?clean(x.status,20):"",trigger:clean(x.trigger,160)};if(kind==="wellbeing-observation")return {mood:clean(x.mood,40),appetite:clean(x.appetite,40),mealRegularity:clean(x.mealRegularity,40),sleep:clean(x.sleep,40),energy:clean(x.energy,40),caffeine:clean(x.caffeine,80),hydration:clean(x.hydration,40),giComfort:clean(x.giComfort,80),medicationContext:clean(x.medicationContext,160)};return {}};
async function ownsProfile(sql:NeonQueryFunction<false,false>,userId:string,id:string){const rows=await sql`SELECT id FROM public.family_profiles WHERE id=${id} AND owner_user_id=${userId} LIMIT 1`;return rows.length>0}
const fields=`id,family_profile_id,kind,title,detail,severity,metadata,occurred_at,created_at`;
export async function GET(request:Request){try{const u=await currentUser();if(!u)return json({error:"Unauthorized"},401);const sql=db();await ensure(sql);const url=new URL(request.url),familyId=clean(url.searchParams.get("familyProfileId"),80);if(familyId){if(!(await ownsProfile(sql,u.id,familyId)))return json({error:"Family profile not found"},404);const rows=await sql`SELECT id,family_profile_id,kind,title,detail,severity,metadata,occurred_at,created_at FROM public.care_records WHERE user_id=${u.id} AND family_profile_id=${familyId} ORDER BY occurred_at DESC LIMIT 300`;return json({records:rows})}const rows=await sql`SELECT id,family_profile_id,kind,title,detail,severity,metadata,occurred_at,created_at FROM public.care_records WHERE user_id=${u.id} AND family_profile_id IS NULL ORDER BY occurred_at DESC LIMIT 300`;return json({records:rows})}catch(e){console.error("care GET failed",e);return json({error:"Unable to load care records"},500)}}
export async function POST(request:Request){try{const u=await currentUser();if(!u)return json({error:"Unauthorized"},401);const b=await request.json().catch(()=>null);if(!b)return json({error:"Invalid JSON"},400);const kind=clean(b.kind,30),title=clean(b.title,120),detail=clean(b.detail,1000),familyId=clean(b.familyProfileId,80)||null;const severity=validSeverity(b.severity);if(!kinds.has(kind)||!title||severity!=null&&(!Number.isInteger(severity)||severity<1||severity>5))return json({error:"Invalid care record"},400);const ts=Date.parse(String(b.occurredAt||new Date().toISOString()));if(Number.isNaN(ts))return json({error:"Invalid date"},400);const metadata=cleanMetadata(kind,b.metadata),sql=db();await ensure(sql);if(familyId&&!(await ownsProfile(sql,u.id,familyId)))return json({error:"Family profile not found"},404);const rows=await sql`INSERT INTO public.care_records(user_id,family_profile_id,kind,title,detail,severity,metadata,occurred_at) VALUES(${u.id},${familyId},${kind},${title},${detail},${severity},${JSON.stringify(metadata)}::jsonb,${new Date(ts).toISOString()}) RETURNING id,family_profile_id,kind,title,detail,severity,metadata,occurred_at,created_at`;return json({record:rows[0]},201)}catch(e){console.error("care POST failed",e);return json({error:"Unable to save care record"},500)}}
export async function PATCH(request:Request){try{const u=await currentUser();if(!u)return json({error:"Unauthorized"},401);const b=await request.json().catch(()=>null),id=clean(b?.id,80),title=clean(b?.title,120),detail=clean(b?.detail,1000),severity=validSeverity(b?.severity);if(!id||!title||severity!=null&&(!Number.isInteger(severity)||severity<1||severity>5))return json({error:"Invalid care record"},400);const ts=Date.parse(String(b?.occurredAt||new Date().toISOString()));if(Number.isNaN(ts))return json({error:"Invalid date"},400);const sql=db();await ensure(sql);const current=await sql`SELECT kind FROM public.care_records WHERE id=${id} AND user_id=${u.id} LIMIT 1`;if(!current.length)return json({error:"Care record not found"},404);const metadata=cleanMetadata(String(current[0].kind),b?.metadata);const rows=await sql`UPDATE public.care_records SET title=${title},detail=${detail},severity=${severity},metadata=${JSON.stringify(metadata)}::jsonb,occurred_at=${new Date(ts).toISOString()} WHERE id=${id} AND user_id=${u.id} RETURNING id,family_profile_id,kind,title,detail,severity,metadata,occurred_at,created_at`;return json({record:rows[0]})}catch(e){console.error("care PATCH failed",e);return json({error:"Unable to update care record"},500)}}
export async function DELETE(request:Request){try{const u=await currentUser();if(!u)return json({error:"Unauthorized"},401);const b=await request.json().catch(()=>null),id=clean(b?.id,80);if(!id)return json({error:"id is required"},400);const sql=db();await ensure(sql);const rows=await sql`DELETE FROM public.care_records WHERE id=${id} AND user_id=${u.id} RETURNING id`;if(!rows.length)return json({error:"Care record not found"},404);return json({ok:true})}catch(e){console.error("care DELETE failed",e);return json({error:"Unable to delete care record"},500)}}
