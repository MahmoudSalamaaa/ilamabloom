import {randomBytes} from "node:crypto";
import {auth} from "../../../../lib/auth/server";
import {db,ensureRegistrationTable,registrationApprover} from "../../../../lib/registration";

const json=(body:unknown,status=200)=>Response.json(body,{status,headers:{"Cache-Control":"no-store"}});
const siteUrl=process.env.BETTER_AUTH_URL||process.env.NEXT_PUBLIC_SITE_URL||"https://www.ilamabloom.com";

export async function GET(){
 try{const reviewer=await registrationApprover();if(!reviewer)return json({error:"Forbidden"},403);const sql=db();await ensureRegistrationTable(sql);const rows=await sql`SELECT id,email,phone,status,created_at,reviewed_at,reviewed_by,user_id FROM public.registration_requests ORDER BY created_at DESC LIMIT 200`;return json({registrations:rows})}
 catch(error){console.error("registrations GET failed",error);return json({error:"Unable to load registrations"},500)}
}

export async function POST(request:Request){
 try{
  const reviewer=await registrationApprover();if(!reviewer)return json({error:"Forbidden"},403);
  const body=await request.json().catch(()=>null);const id=String(body?.id||"");const decision=body?.decision==="reject"?"reject":"approve";if(!id)return json({error:"Registration id is required"},400);
  const sql=db();await ensureRegistrationTable(sql);const rows=await sql`SELECT id,email,phone,status FROM public.registration_requests WHERE id=${id} LIMIT 1`;if(!rows.length)return json({error:"Registration not found"},404);const row=rows[0];if(row.status!=="pending")return json({error:"Registration was already reviewed"},409);
  if(decision==="reject"){await sql`UPDATE public.registration_requests SET status='rejected',reviewed_at=now(),reviewed_by=${reviewer.email} WHERE id=${id}`;return json({ok:true,status:"rejected"})}
  const temporaryPassword=randomBytes(32).toString("base64url");
  const signup=await auth.api.signUpEmail({body:{name:row.email.split("@")[0],email:row.email,password:temporaryPassword,callbackURL:"/account"},headers:new Headers({origin:siteUrl})});
  const userId=signup.user?.id||null;
  if(!userId)throw new Error("Approved user could not be created");
  await auth.api.requestPasswordReset({body:{email:row.email,redirectTo:`${siteUrl}/auth/reset-password`},headers:new Headers({origin:siteUrl})});
  await sql`UPDATE public.registration_requests SET status='approved',reviewed_at=now(),reviewed_by=${reviewer.email},user_id=${userId} WHERE id=${id}`;
  return json({ok:true,status:"approved",message:"Approved and activation email queued."});
 }catch(error){console.error("registrations POST failed",error);return json({error:"Unable to approve registration. Confirm email delivery is configured, then try again."},500)}
}

