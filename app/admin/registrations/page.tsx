"use client";
import {useEffect,useState} from "react";
import {authClient} from "../../../lib/auth/client";

type Registration={id:string;email:string;phone:string;status:string;created_at:string;reviewed_at:string|null;reviewed_by:string|null};
export default function RegistrationAdminPage(){
 const {data:session,isPending}=authClient.useSession();const [rows,setRows]=useState<Registration[]>([]);const [message,setMessage]=useState("");const [busy,setBusy]=useState<string|null>(null);
 const load=()=>fetch("/api/admin/registrations").then(async r=>{const d=await r.json();if(!r.ok)throw new Error(d.error||"Forbidden");setRows(d.registrations||[])}).catch(e=>setMessage(e.message));
 useEffect(()=>{if(session)load()},[session]);
 const decide=async(id:string,decision:"approve"|"reject")=>{setBusy(id);setMessage("");try{const r=await fetch("/api/admin/registrations",{method:"POST",headers:{"content-type":"application/json"},body:JSON.stringify({id,decision})});const d=await r.json();if(!r.ok)throw new Error(d.error);setMessage(d.message||`Registration ${decision}d.`);load()}catch(e){setMessage(e instanceof Error?e.message:"Unable to update registration.")}finally{setBusy(null)}};
 if(isPending)return <main className="adminPage"><section className="adminCard"><p>Loading…</p></section></main>;
 if(!session)return <main className="adminPage"><section className="adminCard"><small>PRIVATE REVIEW</small><h1>Doctor access.</h1><p>Sign in with an approved administration account to review requests.</p><a href="/auth/sign-in?next=%2Fadmin%2Fregistrations">Sign in</a></section></main>;
 return <main className="adminPage" dir="ltr"><section className="adminCard"><small>PRIVATE REVIEW · DOCTOR ACCESS</small><h1>Registration requests.</h1><p>Only the configured administration and Dr Dina approval emails can approve or reject access. Approval creates the account and sends the password setup email from support@ilamabloom.com.</p><p role="status">{message}</p><div className="registrationList">{rows.length?rows.map(row=><article key={row.id}><div><b>{row.email}</b><small>{row.phone}</small><small>{new Date(row.created_at).toLocaleString()}</small><strong>{row.status}</strong></div>{row.status==="pending"&&<div><button disabled={busy===row.id} onClick={()=>decide(row.id,"approve")}>Approve</button><button disabled={busy===row.id} onClick={()=>decide(row.id,"reject")}>Reject</button></div>}</article>):<p>No registration requests yet.</p>}</div></section></main>;
}

