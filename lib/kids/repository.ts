import {KidsError,parseProfile,parseSnapshot,type KidsProfile,type Snapshot} from './domain';
export type Sql = {query:(sql:string,params?:unknown[])=>Promise<{rows:any[]}>};
export const schema=`
CREATE TABLE IF NOT EXISTS public.ilama_kids_profiles (
 id text PRIMARY KEY,user_id text NOT NULL,nickname text NOT NULL CHECK (char_length(nickname) BETWEEN 1 AND 40),
 age_band text NOT NULL CHECK (age_band IN ('under-8','8-12','13-17')),
 progress_epoch integer NOT NULL DEFAULT 0 CHECK (progress_epoch>=0),
 consent_at timestamptz NOT NULL DEFAULT now(),created_at timestamptz NOT NULL DEFAULT now(),updated_at timestamptz NOT NULL DEFAULT now()
);
ALTER TABLE public.ilama_kids_profiles ADD COLUMN IF NOT EXISTS progress_epoch integer NOT NULL DEFAULT 0 CHECK (progress_epoch>=0);
CREATE TABLE IF NOT EXISTS public.ilama_kids_imports (user_id text PRIMARY KEY);
CREATE INDEX IF NOT EXISTS ilama_kids_profiles_owner_idx ON public.ilama_kids_profiles(user_id);
CREATE TABLE IF NOT EXISTS public.ilama_kids_snapshots (
 child_id text NOT NULL REFERENCES public.ilama_kids_profiles(id) ON DELETE CASCADE,
 zone text NOT NULL CHECK (zone IN ('world','hub','farm','egypt','aqua','discover','food','weather','quests','kitchen','movement')),
 state jsonb NOT NULL,revision integer NOT NULL CHECK (revision > 0),updated_at timestamptz NOT NULL DEFAULT now(),
 PRIMARY KEY (child_id,zone)
);`;
export async function owned(sql:Sql,userId:string,childId:string,lock=false){
 const r=await sql.query('SELECT id,progress_epoch FROM public.ilama_kids_profiles WHERE id=$1 AND user_id=$2'+(lock?' FOR UPDATE':''),[childId,userId]);
 if(!r.rows.length)throw new KidsError(404,'Learning profile not found');return r.rows[0] as {id:string;progress_epoch:number};
}
export async function importLegacy(sql:Sql,userId:string){
 await sql.query('SELECT pg_advisory_xact_lock(hashtext($1))',[userId]);
 if((await sql.query('SELECT user_id FROM public.ilama_kids_imports WHERE user_id=$1',[userId])).rows.length)return;
 const exists=await sql.query("SELECT to_regclass('public.child_profiles') AS name");
 if(exists.rows[0]?.name){
  await sql.query('INSERT INTO public.ilama_kids_profiles (id,user_id,nickname,age_band,consent_at,created_at,updated_at) SELECT id,user_id,nickname,age_band,consent_at,created_at,updated_at FROM public.child_profiles WHERE user_id=$1 ON CONFLICT (id) DO NOTHING',[userId]);
  await sql.query('INSERT INTO public.ilama_kids_imports (user_id) VALUES ($1) ON CONFLICT DO NOTHING',[userId]);
 }
}
export async function profiles(sql:Sql,userId:string):Promise<KidsProfile[]>{await importLegacy(sql,userId);return (await sql.query('SELECT id,nickname,age_band,consent_at,progress_epoch FROM public.ilama_kids_profiles WHERE user_id=$1 ORDER BY created_at,id',[userId])).rows}
/** Runs inside a transaction. User lock prevents concurrent creates exceeding the limit. */
export async function saveProfile(sql:Sql,userId:string,body:unknown,id:string):Promise<KidsProfile>{
 const x=parseProfile(body);
 await sql.query('SELECT pg_advisory_xact_lock(hashtext($1))',[userId]);
 if(x.id){await owned(sql,userId,x.id,true);return (await sql.query('UPDATE public.ilama_kids_profiles SET nickname=$1,age_band=$2,consent_at=now(),updated_at=now() WHERE id=$3 AND user_id=$4 RETURNING id,nickname,age_band,consent_at,progress_epoch',[x.nickname,x.ageBand,x.id,userId])).rows[0]}
 if((await profiles(sql,userId)).length>=5)throw new KidsError(409,'This account already has five learning profiles');
 return (await sql.query('INSERT INTO public.ilama_kids_profiles (id,user_id,nickname,age_band) VALUES ($1,$2,$3,$4) RETURNING id,nickname,age_band,consent_at,progress_epoch',[id,userId,x.nickname,x.ageBand])).rows[0];
}
export async function deleteProfile(sql:Sql,userId:string,childId:string){await owned(sql,userId,childId,true);await sql.query('DELETE FROM public.ilama_kids_profiles WHERE id=$1 AND user_id=$2',[childId,userId]);const exists=await sql.query("SELECT to_regclass('public.child_profiles') AS name");if(exists.rows[0]?.name)await sql.query('DELETE FROM public.child_profiles WHERE id=$1 AND user_id=$2',[childId,userId])}
export async function snapshots(sql:Sql,userId:string,childId:string):Promise<Snapshot[]>{await owned(sql,userId,childId);return (await sql.query('SELECT zone,state,revision FROM public.ilama_kids_snapshots WHERE child_id=$1 ORDER BY zone',[childId])).rows}
export async function saveSnapshot(sql:Sql,userId:string,body:unknown){
 const x=parseSnapshot(body);const profile=await owned(sql,userId,x.childId,true);
 if(x.generation!==profile.progress_epoch)return {reset:true as const,generation:profile.progress_epoch};
 const current=(await sql.query('SELECT zone,state,revision FROM public.ilama_kids_snapshots WHERE child_id=$1 AND zone=$2',[x.childId,x.zone])).rows[0] as Snapshot|undefined;
 if((current?.revision||0)!==x.revision)return {conflict:true as const,snapshot:current||{zone:x.zone,state:null,revision:0}};
 const r=await sql.query('INSERT INTO public.ilama_kids_snapshots (child_id,zone,state,revision) VALUES ($1,$2,$3::jsonb,1) ON CONFLICT (child_id,zone) DO UPDATE SET state=EXCLUDED.state,revision=ilama_kids_snapshots.revision+1,updated_at=now() RETURNING zone,state,revision',[x.childId,x.zone,JSON.stringify(x.state)]);
 return {conflict:false as const,snapshot:r.rows[0] as Snapshot};
}
export async function readJourney(sql:Sql,userId:string,childId:string){
 const profile=await owned(sql,userId,childId,true);return {generation:profile.progress_epoch,snapshots:await snapshots(sql,userId,childId)};
}
/** Reset has a new generation: old tabs cannot resurrect deleted progress, even at revision zero. */
export async function clearSnapshots(sql:Sql,userId:string,childId:string){
 await owned(sql,userId,childId,true);
 const result=await sql.query('UPDATE public.ilama_kids_profiles SET progress_epoch=progress_epoch+1,updated_at=now() WHERE id=$1 AND user_id=$2 RETURNING progress_epoch',[childId,userId]);
 await sql.query('DELETE FROM public.ilama_kids_snapshots WHERE child_id=$1',[childId]);
 return {generation:result.rows[0].progress_epoch};
}
