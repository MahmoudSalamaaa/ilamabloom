import {randomBytes} from "node:crypto";
import {betterAuth} from "better-auth";
import {PostgresDialect} from "kysely";
import {Pool} from "pg";
import {headers} from "next/headers";

// Production auth uses the Vercel-linked Neon database.
const databaseUrl=process.env.NutClueDB_DATABASE_URL_UNPOOLED||process.env.NutClueDB_POSTGRES_URL_NON_POOLING||process.env.DATABASE_URL||process.env.POSTGRES_URL||process.env.NutClueDB_DATABASE_URL||process.env.NutClueDB_POSTGRES_URL;
const pool=databaseUrl?new Pool({connectionString:databaseUrl,max:5}):null;
const siteUrl=process.env.BETTER_AUTH_URL||process.env.NEXT_PUBLIC_SITE_URL||"https://www.ilamabloom.com";
const socialProviders={
 ...(process.env.GOOGLE_CLIENT_ID&&process.env.GOOGLE_CLIENT_SECRET?{google:{clientId:process.env.GOOGLE_CLIENT_ID,clientSecret:process.env.GOOGLE_CLIENT_SECRET}}:{}),
 ...(process.env.FACEBOOK_CLIENT_ID&&process.env.FACEBOOK_CLIENT_SECRET?{facebook:{clientId:process.env.FACEBOOK_CLIENT_ID,clientSecret:process.env.FACEBOOK_CLIENT_SECRET}}:{}),
 ...(process.env.X_CLIENT_ID&&process.env.X_CLIENT_SECRET?{twitter:{clientId:process.env.X_CLIENT_ID,clientSecret:process.env.X_CLIENT_SECRET}}:{})
};

const authSecret=process.env.BETTER_AUTH_SECRET||(process.env.NODE_ENV==="production"?randomBytes(32).toString("hex"):"ilama-bloom-development-secret-change-me-32-chars");

export const auth=betterAuth({
 database:pool?new PostgresDialect({pool}):undefined,
 baseURL:siteUrl,
 secret:authSecret,
 trustedOrigins:Array.from(new Set([siteUrl,"https://ilamabloom.com","https://www.ilamabloom.com"])),
 account:{accountLinking:{enabled:true,requireLocalEmailVerified:false,trustedProviders:["google","facebook"]}},
 emailAndPassword:{enabled:true},
 socialProviders
});

export async function currentUser(){
 if(process.env.NODE_ENV==="production"&&!process.env.BETTER_AUTH_SECRET)return null;
 const session=await auth.api.getSession({headers:await headers()});
 return session?.user??null;
}
