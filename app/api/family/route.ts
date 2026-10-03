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
}
const json=(body:unknown,status=200)=>Response.json(body,{status,headers:{"Cache-Control":"no-store"}});
const clean=(v:unknown,n:number)=>String(v||"").trim().slice(0,n);
const stages=new Set(["child","teen","adult","older-adult"]);
export async function GET(){try{const u=await currentUser();if(!u)return json({error:"Unauthorized"},401);const sql=db();await ensure(sql);const rows=await sql`SELECT id,display_name,relationship,life_stage,birth_date,notes,is_self,created_at,updated_at FROM public.family_profiles WHERE owner_user_id=${u.id} ORDER BY is_self DESC,created_at ASC`;return json({profiles:rows})}catch(e){console.error("family GET failed",e);return json({error:"Unable to load family profiles"},500)}}
export async function POST(request:Request){try{const u=await currentUser();if(!u)return json({error:"Unauthorized"},401);const body=await request.json().catch(()=>null);if(!body)return json({error:"Invalid JSON"},400);const name=clean(body.displayName,100),relationship=clean(body.relationship,50)||"family",lifeStage=stages.has(body.lifeStage)?body.lifeStage:"adult",notes=clean(body.notes,500),rawBirth=clean(body.birthDate,10),birthDate=/^\d{4}-\d{2}-\d{2}$/.test(rawBirth)?rawBirth:null;if(!name)return json({error:"Display name is required"},400);const sql=db();await ensure(sql);const rows=await sql`INSERT INTO public.family_profiles(owner_user_id,display_name,relationship,life_stage,birth_date,notes,is_self) VALUES(${u.id},${name},${relationship},${lifeStage},${birthDate},${notes},false) RETURNING id,display_name,relationship,life_stage,birth_date,notes,is_self,created_at,updated_at`;return json({profile:rows[0]},201)}catch(e){console.error("family POST failed",e);return json({error:"Unable to save family profile"},500)}}
export async function DELETE(request:Request){try{const u=await currentUser();if(!u)return json({error:"Unauthorized"},401);const body=await request.json().catch(()=>null),id=clean(body?.id,80);if(!id)return json({error:"id is required"},400);const sql=db();await ensure(sql);const owned=await sql`SELECT id FROM public.family_profiles WHERE id=${id} AND owner_user_id=${u.id} AND is_self=false LIMIT 1`;if(!owned.length)return json({error:"Profile not found"},404);await sql`DELETE FROM public.care_records WHERE user_id=${u.id} AND family_profile_id=${id}`;await sql`DELETE FROM public.family_profiles WHERE id=${id} AND owner_user_id=${u.id} AND is_self=false`;return json({ok:true})}catch(e){console.error("family DELETE failed",e);return json({error:"Unable to delete family profile"},500)}}
export async function PATCH(request:Request){try{const u=await currentUser();if(!u)return json({error:"Unauthorized"},401);const body=await request.json().catch(()=>null),id=clean(body?.id,80),name=clean(body?.displayName,100),relationship=clean(body?.relationship,50)||"family",lifeStage=stages.has(body?.lifeStage)?body.lifeStage:"adult",notes=clean(body?.notes,500),rawBirth=clean(body?.birthDate,10),birthDate=/^\d{4}-\d{2}-\d{2}$/.test(rawBirth)?rawBirth:null;if(!id||!name)return json({error:"id and displayName are required"},400);const sql=db();await ensure(sql);const rows=await sql`UPDATE public.family_profiles SET display_name=${name},relationship=${relationship},life_stage=${lifeStage},birth_date=${birthDate},notes=${notes},updated_at=now() WHERE id=${id} AND owner_user_id=${u.id} AND is_self=false RETURNING id,display_name,relationship,life_stage,birth_date,notes,is_self,created_at,updated_at`;if(!rows.length)return json({error:"Profile not found"},404);return json({profile:rows[0]})}catch(e){console.error("family PATCH failed",e);return json({error:"Unable to update family profile"},500)}}
