import {randomUUID} from 'node:crypto';
import {KidsError,readBody,validId} from '../../../../lib/kids/domain';
import {profiles,saveProfile,deleteProfile} from '../../../../lib/kids/repository';
import {transaction,json,failure} from '../../../../lib/kids/server';
export async function GET(){try{return json({profiles:await transaction((sql,user)=>profiles(sql,user))})}catch(e){return failure(e)}}
export async function POST(request:Request){try{const body=await readBody(request);return json({profile:await transaction((sql,user)=>saveProfile(sql,user,body,randomUUID()))},201)}catch(e){return failure(e)}}
export async function DELETE(request:Request){try{const body=await readBody(request) as {id?:unknown};if(!validId(body?.id))throw new KidsError(400,'Profile ID is required');const id=body.id;await transaction((sql,user)=>deleteProfile(sql,user,id));return json({ok:true})}catch(e){return failure(e)}}
