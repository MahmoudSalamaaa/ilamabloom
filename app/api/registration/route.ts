import {db,ensureRegistrationTable} from "../../../lib/registration";

const json=(body:unknown,status=200)=>Response.json(body,{status,headers:{"Cache-Control":"no-store"}});
export async function POST(request:Request){
 try{
  const body=await request.json().catch(()=>null);const email=String(body?.email||"").trim().toLowerCase();const phone=String(body?.phone||"").trim();
  if(!/^\S+@\S+\.\S+$/.test(email)||phone.length<6||phone.length>40)return json({error:"Enter a valid email and phone number."},400);
  const sql=db();await ensureRegistrationTable(sql);
  const existing=await sql`SELECT id,status FROM public.registration_requests WHERE lower(email)=${email} AND status IN ('pending','approved') ORDER BY created_at DESC LIMIT 1`;
  if(existing.length)return json({ok:true,status:existing[0].status,message:existing[0].status==="approved"?"This email has already been approved. Check your inbox for the activation email.":"Your request is already waiting for review."});
  await sql`INSERT INTO public.registration_requests(email,phone) VALUES(${email},${phone})`;
  return json({ok:true,status:"pending",message:"Your request was sent for private review."},201);
 }catch(error){console.error("registration POST failed",error);return json({error:"Unable to submit the registration request."},500)}
}

