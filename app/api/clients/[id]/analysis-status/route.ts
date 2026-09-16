import { NextResponse } from 'next/server';
import { isAdminRequest } from '@/lib/auth';
import { dbAdmin } from '@/lib/supabase';
import { openaiClient } from '@/lib/openai';

export const maxDuration = 60;

export async function GET(_req:Request,{params}:{params:Promise<{id:string}>}){
  if(!(await isAdminRequest())) return NextResponse.json({error:'Unauthorized'},{status:401});
  const {id}=await params; const db=dbAdmin();
  const {data:run}=await db.from('growth_analysis_runs').select('*').eq('client_id',id).order('created_at',{ascending:false}).limit(1).maybeSingle();
  if(!run) return NextResponse.json({status:'not_started',progress:0});
  if(run.status==='complete') return NextResponse.json({status:'complete',progress:100});
  if(run.status==='failed') return NextResponse.json({status:'failed',progress:run.progress||0,error:run.error_message});
  if(!run.openai_response_id) return NextResponse.json({status:run.status||'queued',progress:run.progress||10});
  try{
    const response=await openaiClient().responses.retrieve(run.openai_response_id);
    if(response.status==='completed'){
      let result:any; try{result=JSON.parse(response.output_text||'{}')}catch{throw new Error('AI completed, but the structured analysis could not be parsed.');}
      const sources=(result.sources||[]).filter((x:any)=>x?.url);
      await db.from('growth_analysis_runs').update({status:'complete',progress:100,result_json:result,sources_json:sources,completed_at:new Date().toISOString(),raw_response_meta:{id:response.id,model:response.model,usage:response.usage}}).eq('id',run.id);
      const update:any={analysis_status:'complete'};
      if(result.brand?.primary_color) update.primary_color=result.brand.primary_color;
      if(result.brand?.accent_color) update.accent_color=result.brand.accent_color;
      await db.from('growth_clients').update(update).eq('id',id);
      await db.from('growth_activity').insert({client_id:id,activity_type:'analysis_completed',description:'Deep business intelligence analysis completed',metadata:{source_count:sources.length,finding_count:result.priority_findings?.length||0}});
      return NextResponse.json({status:'complete',progress:100});
    }
    if(response.status==='failed'||response.status==='cancelled'||response.status==='incomplete'){
      const msg=(response as any).error?.message||(response as any).incomplete_details?.reason||`OpenAI response ${response.status}`;
      await db.from('growth_analysis_runs').update({status:'failed',error_message:msg,progress:100}).eq('id',run.id); await db.from('growth_clients').update({analysis_status:'failed'}).eq('id',id);
      return NextResponse.json({status:'failed',progress:100,error:msg});
    }
    const next=Math.min(88,Math.max(run.progress||20,(run.progress||20)+8)); await db.from('growth_analysis_runs').update({status:'running',progress:next}).eq('id',run.id);
    return NextResponse.json({status:'running',progress:next});
  }catch(e:any){return NextResponse.json({status:'running',progress:run.progress||30,warning:e?.message});}
}
