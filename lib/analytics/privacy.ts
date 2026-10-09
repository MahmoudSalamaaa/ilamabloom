import {KidsError} from '../kids/domain';

export function privateAnalyticsPath(path:string){
 try{
  const url=new URL(path,'https://public.invalid');
  const pathname=decodeURIComponent(url.pathname);
  const hash=decodeURIComponent(url.hash).replace(/^#\/?/,'');
  return /^\/(kids|parent|account|auth|api)(\/|$)/i.test(pathname)||/^(kids|parent|account|auth)(?:$|[/?])/i.test(hash);
 }catch{return true}
}

/** Persist public page counts only; discard query strings and free-form fragments. */
export function analyticsEvent(input:unknown){
 if(!input||typeof input!=='object'||Array.isArray(input))throw new KidsError(400,'Invalid analytics event');
 const body=input as Record<string,unknown>;
 if(body.event!=='page_view'||typeof body.anonymousId!=='string'||!/^[-a-zA-Z0-9_]{1,80}$/.test(body.anonymousId)||typeof body.path!=='string'||body.path.length>500||!body.path.startsWith('/')||body.path.startsWith('//'))throw new KidsError(400,'Invalid analytics event');
 let url:URL;
 try{url=new URL(body.path,'https://public.invalid');decodeURIComponent(url.pathname)}catch{throw new KidsError(400,'Invalid analytics path')}
 // Validate fragments before suppressing sensitive legacy hash routes.
 try{decodeURIComponent(url.hash)}catch{throw new KidsError(400,'Invalid analytics path')}
 if(privateAnalyticsPath(body.path))return null;
 return {event:'page_view',anonymousId:body.anonymousId,path:url.pathname};
}
