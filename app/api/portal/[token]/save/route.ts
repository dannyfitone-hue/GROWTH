import {NextResponse} from 'next/server';
import {dbAdmin} from '@/lib/supabase';

const nextStep:Record<string,string>={business:'access',access:'agreement',agreement:'review'};
const progress:Record<string,number>={business:50,access:66,agreement:83};
const platforms=['Google Business Profile','Google Ads','Google Analytics 4','Google Search Console','Google Tag Manager','Website Admin','Domain / DNS'];

export async function POST(req:Request,{params}:{params:Promise<{token:string}>}){
  const {token}=await params;const fd=await req.formData();const step=String(fd.get('step')||'');const db=dbAdmin();
  const {data:link}=await db.from('growth_intake_links').select('client_id,status').eq('token',token).eq('status','active').maybeSingle();
  if(!link)return new NextResponse('Invalid or completed onboarding link',{status:404});
  const {data:client}=await db.from('growth_clients').select('*').eq('id',link.client_id).single();
  const raw=Object.fromEntries(fd.entries());delete (raw as any).step;
  const {data:existing}=await db.from('growth_onboarding_state').select('*').eq('client_id',link.client_id).maybeSingle();
  const payload={...(existing?.payload||{}),[step]:raw};
  const completed=Array.from(new Set([...(existing?.completed_steps||[]),step]));
  const update:any={client_id:link.client_id,payload,current_step:nextStep[step]||'review',progress:progress[step]||existing?.progress||0,completed_steps:completed,updated_at:new Date().toISOString()};
  if(step==='agreement'){
    if(raw.accept!=='yes'||!raw.signer_name||!raw.signer_title)return new NextResponse('Agreement acceptance and signer information are required.',{status:400});
    update.signature_name=String(raw.signer_name);update.signature_title=String(raw.signer_title);update.signed_at=new Date().toISOString();
    await db.from('growth_agreements').insert({client_id:link.client_id,agreement_version:'v2.0-growth-program',agreement_snapshot:{initial_term_days:90,management_fee:client?.management_fee||0,setup_fee:client?.setup_fee||0,ad_budget:client?.ad_budget||0,scope:['Google Business Profile','Local SEO','Technical/on-page SEO','Google Ads management','Conversion tracking','Review workflow','Monthly reporting']},signer_name:String(raw.signer_name),signer_title:String(raw.signer_title),signature_data:`typed:${String(raw.signer_name)}`,accepted:true,signed_at:new Date().toISOString()});
    await db.from('growth_clients').update({onboarding_status:'signed'}).eq('id',link.client_id);
    await db.from('growth_activity').insert({client_id:link.client_id,activity_type:'agreement_signed',description:'Client electronically accepted the 90-day growth program agreement',metadata:{signer_name:raw.signer_name,signer_title:raw.signer_title}});
  }
  if(step==='business'){
    await db.from('growth_clients').update({phone:raw.phone||client?.phone,address:raw.address||client?.address,onboarding_status:'in_progress'}).eq('id',link.client_id);
    await db.from('growth_activity').insert({client_id:link.client_id,activity_type:'business_intake_saved',description:'Client completed the private business strategy intake'});
  }
  if(step==='access'){
    for(let i=0;i<platforms.length;i++){
      const status=String(raw[`access_${i}`]||'ready');
      await db.from('growth_account_access').upsert({client_id:link.client_id,platform:platforms[i],status,notes:'Client onboarding access plan',granted_at:status==='granted'?new Date().toISOString():null},{onConflict:'client_id,platform'});
    }
    await db.from('growth_activity').insert({client_id:link.client_id,activity_type:'access_plan_saved',description:'Client completed the system access plan'});
  }
  const {error}=await db.from('growth_onboarding_state').upsert(update,{onConflict:'client_id'});if(error)return new NextResponse(error.message,{status:500});
  return NextResponse.redirect(new URL(`/p/${token}?step=${nextStep[step]||'review'}`,req.url),303);
}
