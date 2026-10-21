import {neon} from "@neondatabase/serverless";
import {currentUser} from "./auth/server";

export type RegistrationRow={id:string;email:string;phone:string;status:"pending"|"approved"|"rejected";created_at:string;reviewed_at:string|null;reviewed_by:string|null;user_id:string|null};

export function db(){
 const url=process.env.DATABASE_URL||process.env.POSTGRES_URL||process.env.NutClueDB_DATABASE_URL||process.env.NutClueDB_POSTGRES_URL;
 if(!url)throw new Error("Database is not configured");
 return neon(url);
}

export async function ensureRegistrationTable(sql:any){
 await sql`CREATE TABLE IF NOT EXISTS public.registration_requests (id uuid PRIMARY KEY DEFAULT gen_random_uuid(),email text NOT NULL,phone text NOT NULL,status text NOT NULL DEFAULT 'pending' CHECK(status IN ('pending','approved','rejected')),created_at timestamptz NOT NULL DEFAULT now(),reviewed_at timestamptz,reviewed_by text,user_id text)`;
 await sql`CREATE UNIQUE INDEX IF NOT EXISTS registration_requests_email_pending_idx ON public.registration_requests(lower(email)) WHERE status='pending'`;
}

function emailsFromEnv(...keys:string[]){return keys.flatMap((key)=>(process.env[key]||"").split(",")).map((value)=>value.trim().toLowerCase()).filter(Boolean)}
export async function registrationApprover(){
 const user=await currentUser();
 if(!user?.email)return null;
 const allowed=new Set([...emailsFromEnv("ADMIN_EMAILS","DINA_EMAILS","REGISTRATION_APPROVER_EMAILS")]);
 return allowed.has(user.email.toLowerCase())?user:null;
}

