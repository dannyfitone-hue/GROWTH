import { NextResponse } from 'next/server';
import crypto from 'crypto';
import { isAdminRequest } from '@/lib/auth';
import { dbAdmin } from '@/lib/supabase';
import { inspectWebsite } from '@/lib/brand';
import { industryThemes } from '@/lib/industry';
import { startAudit, modelName } from '@/lib/openai';

export const maxDuration = 60;

export async function POST(req:Request){
  if(!(await isAdminRequest())) return NextResponse.json({error:'Unauthorized'},{status:401});
  try{
    const b=await req.json();
    for(const k of ['business_name','first_name','last_name','email','website']) if(!b[k]) return NextResponse.json({error:`${k.replaceAll('_',' ')} is required.`},{status:400});
    const db=dbAdmin(); const theme=industryThemes[b.industry]||industryThemes.general; const web=await inspectWebsite(String(b.website));
    const {data,error}=await db.from('growth_clients').insert({
      business_name:String(b.business_name).trim(),first_name:String(b.first_name).trim(),last_name:String(b.last_name).trim(),email:String(b.email).trim(),phone:b.phone||null,address:b.address||null,website:String(b.website).trim(),industry:b.industry||'general',start_date:b.start_date||null,
      logo_url:web.logo||null,primary_color:theme.defaultPrimary,secondary_color:theme.secondary,accent_color:theme.defaultAccent,
      brand_config:{website_title:web.title,website_description:web.description,hero_image:web.hero,favicon:web.favicon,theme_source:'industry+website-metadata'},
      management_fee:b.management_fee?Number(b.management_fee):0,setup_fee:b.setup_fee?Number(b.setup_fee):0,ad_budget:b.ad_budget?Number(b.ad_budget):0,
      status:'proposal',onboarding_status:'not_started',analysis_status:'not_started',portal_published:false
    }).select().single();
    if(error) return NextResponse.json({error:error.message},{status:400});
    const token=crypto.randomBytes(24).toString('base64url');
    const {error:linkError}=await db.from('growth_intake_links').insert({client_id:data.id,token,status:'active'});
    if(linkError){await db.from('growth_clients').delete().eq('id',data.id);return NextResponse.json({error:linkError.message},{status:400});}
    await db.from('growth_activity').insert({client_id:data.id,activity_type:'client_created',description:'Client intelligence workspace created',metadata:{website_scan:web}});

    // Automatically launch the same deep research workflow that RL Footage would otherwise run manually.
    try {
      const {data:run,error:runErr}=await db.from('growth_analysis_runs').insert({client_id:data.id,status:'queued',progress:8,model:modelName(),prompt_version:'v2.0-deep-public-audit',website_snapshot:web}).select().single();
      if(runErr) throw runErr;
      const response=await startAudit(data,web);
      await db.from('growth_analysis_runs').update({openai_response_id:response.id,status:'running',progress:20,started_at:new Date().toISOString()}).eq('id',run.id);
      await db.from('growth_clients').update({analysis_status:'running'}).eq('id',data.id);
      await db.from('growth_activity').insert({client_id:data.id,activity_type:'analysis_started',description:'Automatic deep public business intelligence research started',metadata:{response_id:response.id,model:modelName()}});
    } catch (analysisError:any) {
      await db.from('growth_clients').update({analysis_status:'failed'}).eq('id',data.id);
      await db.from('growth_activity').insert({client_id:data.id,activity_type:'analysis_failed',description:analysisError?.message||'Automatic analysis could not start'});
    }
    return NextResponse.json({id:data.id});
  }catch(e:any){return NextResponse.json({error:e?.message||'Unexpected error'},{status:500});}
}
