import {redirect} from "next/navigation";
export const metadata={title:"Kids & Games — Ilama Bloom"};
export default async function KidsRoute({searchParams}:{searchParams:Promise<{lang?:string|string[]}>}){const params=await searchParams;const lang=typeof params.lang==="string"&&(params.lang==="ar"||params.lang==="en")?`?lang=${params.lang}`:"";redirect(`/${lang}#/kids`)}

