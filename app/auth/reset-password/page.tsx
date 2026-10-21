"use client";
import {FormEvent,useState} from "react";
import {authClient} from "../../../lib/auth/client";

export default function ResetPasswordPage(){
 const token=typeof window!=="undefined"?new URLSearchParams(window.location.search).get("token"):null;
 const [password,setPassword]=useState("");const [busy,setBusy]=useState(false);const [message,setMessage]=useState("");
 const submit=async(event:FormEvent)=>{event.preventDefault();if(!token||password.length<8)return;setBusy(true);setMessage("");try{const result=await authClient.resetPassword({newPassword:password,token});if(result.error)setMessage(result.error.message||"The password could not be changed.");else{setMessage("Your password was set. You can now sign in.");setTimeout(()=>{window.location.href="/auth/sign-in"},900)}}catch{setMessage("The password could not be changed. The link may have expired.")}finally{setBusy(false)}};
 return <main className="authPage"><section className="authCard"><img src="/ilama-bloom-logo.svg" alt="ILAMA BLOOM"/><p>SECURE ACCOUNT ACTIVATION</p><h1>Set your password.</h1>{!token?<p>This activation link is missing or expired. Ask the administration to send a new one.</p>:<form onSubmit={submit}><label>New password<input required minLength={8} type="password" value={password} onChange={e=>setPassword(e.target.value)} autoComplete="new-password" placeholder="At least 8 characters"/></label><button disabled={busy}>{busy?"Saving…":"Set password"}</button></form>}<p role="status">{message}</p><a href="/auth/sign-in">Back to sign in</a></section></main>;
}

