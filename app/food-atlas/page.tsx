import {redirect} from "next/navigation";
export const metadata={title:"Food Atlas — Ilama Bloom"};
export default async function FoodAtlasRoute({searchParams}:{searchParams:Promise<{lang?:string|string[]}>}){const params=await searchParams;const lang=typeof params.lang==="string"&&(params.lang==="ar"||params.lang==="en")?`?lang=${params.lang}`:"";redirect(`/${lang}#/atlas`)}

