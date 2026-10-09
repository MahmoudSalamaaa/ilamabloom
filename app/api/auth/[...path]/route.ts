import {toNextJsHandler} from "better-auth/next-js";
import {auth} from "../../../../lib/auth/server";
const handlers=toNextJsHandler(auth);
function guarded(method:keyof typeof handlers){return (request:Request)=>{
 if(process.env.NODE_ENV==="production"&&!process.env.BETTER_AUTH_SECRET)return Response.json({error:"Authentication is not configured"},{status:503,headers:{"Cache-Control":"no-store"}});
 return handlers[method](request);
}}
export const GET=guarded("GET"),POST=guarded("POST"),PATCH=guarded("PATCH"),PUT=guarded("PUT"),DELETE=guarded("DELETE");
