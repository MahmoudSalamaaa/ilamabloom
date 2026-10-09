import {KidsError,readBody,validId} from '../../../../lib/kids/domain';
import {snapshots,saveSnapshot,clearSnapshots} from '../../../../lib/kids/repository';
import {transaction,json,failure} from '../../../../lib/kids/server';
export async function GET(request:Request){try{const id=new URL(request.url).searchParams.get('childId');if(!validId(id))throw new KidsError(400,'Profile ID is required');return json({snapshots:await transaction((sql,user)=>snapshots(sql,user,id))})}catch(e){return failure(e)}}
export async function PUT(request:Request){try{const body=await readBody(request);const result=await transaction((sql,user)=>saveSnapshot(sql,user,body));return json(result,result.conflict?409:200)}catch(e){return failure(e)}}
export async function DELETE(request:Request){try{const body=await readBody(request) as {childId?:unknown};if(!validId(body?.childId))throw new KidsError(400,'Profile ID is required');const id=body.childId;await transaction((sql,user)=>clearSnapshots(sql,user,id));return json({ok:true})}catch(e){return failure(e)}}
