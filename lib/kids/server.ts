import {Pool} from 'pg';
import {currentUser} from '../auth/server';
import {KidsError} from './domain';
import {schema,type Sql} from './repository';
let pool:Pool|undefined;
let initialized:Promise<void>|undefined;
function database(){
 const url=process.env.DATABASE_URL||process.env.POSTGRES_URL||process.env.ILAMA_BLOOM_DATABASE_URL||process.env.ILAMA_BLOOM_POSTGRES_URL||process.env.NutClueDB_DATABASE_URL_UNPOOLED||process.env.NutClueDB_DATABASE_URL||process.env.NutClueDB_POSTGRES_URL;
 if(!url)throw new KidsError(503,'Learning storage is not configured');
 if(!pool)pool=new Pool({connectionString:url,max:4,connectionTimeoutMillis:5000,statement_timeout:8000});return pool;
}
export async function transaction<T>(fn:(sql:Sql,userId:string)=>Promise<T>){
 const user=await currentUser();if(!user)throw new KidsError(401,'Unauthorized');
 const db=database();
 if(!initialized)initialized=db.query(schema).then(()=>{}).catch(error=>{initialized=undefined;throw error});await initialized;
 const client=await db.connect();
 try{await client.query('BEGIN');const result=await fn(client,user.id);await client.query('COMMIT');return result}
 catch(error){await client.query('ROLLBACK');throw error}finally{client.release()}
}
export const json=(body:unknown,status=200)=>Response.json(body,{status,headers:{'Cache-Control':'no-store'}});
export function failure(error:unknown){if(error instanceof KidsError)return json({error:error.message},error.status);console.error('Kids storage request failed');return json({error:'Learning storage is temporarily unavailable'},503)}
