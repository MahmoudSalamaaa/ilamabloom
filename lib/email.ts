type TransactionalEmail={to:string;subject:string;html:string};

export async function sendTransactionalEmail({to,subject,html}:TransactionalEmail){
 const apiKey=process.env.RESEND_API_KEY;
 if(!apiKey)throw new Error("RESEND_API_KEY is not configured");
 const from=process.env.SUPPORT_EMAIL||"support@ilamabloom.com";
 const response=await fetch("https://api.resend.com/emails",{method:"POST",headers:{Authorization:`Bearer ${apiKey}`,"Content-Type":"application/json"},body:JSON.stringify({from:`ILAMA BLOOM <${from}>`,to:[to],subject,html})});
 if(!response.ok)throw new Error(`Transactional email failed with ${response.status}`);
}

