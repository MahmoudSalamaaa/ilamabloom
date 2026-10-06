import {redirect} from "next/navigation";
export const metadata={title:"Journal — Ilama Bloom"};
export default async function JournalRoute({searchParams}:{searchParams:Promise<{lang?:string|string[]}>}){const params=await searchParams;const lang=typeof params.lang==="string"&&(params.lang==="ar"||params.lang==="en")?`?lang=${params.lang}`:"";redirect(`/${lang}#/journal`)}

