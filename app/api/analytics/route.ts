import {KidsError,readBody} from "../../../lib/kids/domain";
import {analyticsEvent} from "../../../lib/analytics/privacy";
import {neon} from "@neondatabase/serverless";
function db(){const url=process.env.DATABASE_URL||process.env.POSTGRES_URL||process.env.NutClueDB_DATABASE_URL||process.env.NutClueDB_POSTGRES_URL;if(!url)throw new Error("Database is not configured");return neon(url)}
const json=(body:unknown,status=200)=>Response.json(body,{status,headers:{"Cache-Control":"no-store"}});
export async function POST(request:Request){
 try{
  const event=analyticsEvent(await readBody(request));
  if(!event)return json({ok:true});
  const sql=db();
  await sql`CREATE TABLE IF NOT EXISTS public.analytics_events (id text PRIMARY KEY DEFAULT md5(random()::text || clock_timestamp()::text),anonymous_id text NOT NULL,event text NOT NULL,path text NOT NULL,created_at timestamptz NOT NULL DEFAULT now())`;
  await sql`INSERT INTO public.analytics_events (anonymous_id,event,path) VALUES (${event.anonymousId},${event.event},${event.path})`;
  return json({ok:true});
 }catch(error){
  if(error instanceof KidsError)return json({error:error.message},error.status);
  console.error("Analytics storage request failed");return json({error:"Analytics unavailable"},503);
 }
}
