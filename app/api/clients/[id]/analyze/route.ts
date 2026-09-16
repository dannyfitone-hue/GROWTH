import { NextResponse } from 'next/server';
import { isAdminRequest } from '@/lib/auth';
import { dbAdmin } from '@/lib/supabase';
import { inspectWebsite } from '@/lib/brand';
import { startAudit, modelName } from '@/lib/openai';

export const maxDuration = 60;

export async function POST(_req:Request,{params}:{params:Promise<{id:string}>}){
  if(!(await isAdminRequest())) return NextResponse.json({error:'Unauthorized'},{status:401});
  const {id}=await params; const db=dbAdmin();
  const {data:client,error}=await db.from('growth_clients').select('*').eq('id',id).single();
  if(error||!client) return NextResponse.json({error:'Client not found'},{status:404});
  try{
    const web=await inspectWebsite(client.website);
    const {data:run,error:runErr}=await db.from('growth_analysis_runs').insert({client_id:id,status:'queued',progress:8,model:modelName(),prompt_version:'v2.0-deep-public-audit',website_snapshot:web}).select().single();
    if(runErr) throw runErr;
    await db.from('growth_clients').update({analysis_status:'queued'}).eq('id',id);
    const response=await startAudit(client,web);
    const status=response.status==='completed'?'running':(response.status||'running');
    await db.from('growth_analysis_runs').update({openai_response_id:response.id,status,progress:response.status==='completed'?75:20,started_at:new Date().toISOString()}).eq('id',run.id);
    await db.from('growth_clients').update({analysis_status:'running'}).eq('id',id);
    await db.from('growth_activity').insert({client_id:id,activity_type:'analysis_started',description:'Deep public business intelligence research started',metadata:{response_id:response.id,model:modelName()}});
    return NextResponse.json({ok:true,run_id:run.id,response_id:response.id,status});
  }catch(e:any){
    await db.from('growth_clients').update({analysis_status:'failed'}).eq('id',id);
    await db.from('growth_activity').insert({client_id:id,activity_type:'analysis_failed',description:e?.message||'Analysis failed'});
    return NextResponse.json({error:e?.message||'Analysis could not start'},{status:500});
  }
}
