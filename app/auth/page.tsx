import {redirect} from "next/navigation";

export default async function AuthIndex({searchParams}:{searchParams:Promise<{lang?:string|string[]}>}){
 const params=await searchParams;
 const lang=Array.isArray(params.lang)?params.lang[0]:params.lang;
 redirect(lang==="ar"||lang==="en"?`/auth/sign-in?lang=${lang}`:"/auth/sign-in");
}

