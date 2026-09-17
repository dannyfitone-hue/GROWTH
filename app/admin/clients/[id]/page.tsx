import Link from 'next/link';
import AdminShell from '@/components/AdminShell';
import DeleteBusiness from '@/components/DeleteBusiness';
import AnalysisController from '@/components/AnalysisController';
import PublishController from '@/components/PublishController';
import { requireAdminPage } from '@/lib/auth';
import { dbAdmin } from '@/lib/supabase';
import { notFound } from 'next/navigation';

function money(v:any){return `$${Number(v||0).toLocaleString(undefined,{maximumFractionDigits:0})}`}

export default async function ClientPage({params}:{params:Promise<{id:string}>}){
  await requireAdminPage(); const {id}=await params; const db=dbAdmin();
  const {data:c}=await db.from('growth_clients').select('*').eq('id',id).single(); if(!c) notFound();
  const {data:run}=await db.from('growth_analysis_runs').select('*').eq('client_id',id).order('created_at',{ascending:false}).limit(1).maybeSingle();
  const {data:link}=await db.from('growth_intake_links').select('token,status,opened_at,started_at,submitted_at').eq('client_id',id).order('created_at',{ascending:false}).limit(1).maybeSingle();
  const {data:activityData}=await db.from('growth_activity').select('*').eq('client_id',id).order('created_at',{ascending:false}).limit(12);
  const {data:tasksData}=await db.from('growth_tasks').select('*').eq('client_id',id).order('created_at',{ascending:true}).limit(80);
  const {data:accessData}=await db.from('growth_account_access').select('*').eq('client_id',id).order('platform',{ascending:true});
  const activity=activityData ?? [];
  const tasks=tasksData ?? [];
  const access=accessData ?? [];
  const data=run?.result_json||null; const app=(process.env.NEXT_PUBLIC_APP_URL||'').replace(/\/$/,''); const portalUrl=link?`${app}/p/${link.token}`:'';
  const pipeline=[['01','Research',c.analysis_status==='complete'],['02','Approval',!!c.analysis_approved],['03','Portal',!!c.portal_published],['04','Agreement',c.onboarding_status==='signed'||c.onboarding_status==='complete'],['05','Access',c.onboarding_status==='complete'],['06','Active',c.status==='active']];
  return <AdminShell>
    <div className="pageHead"><div><div className="eyebrow">CLIENT INTELLIGENCE WORKSPACE</div><h1>{c.business_name}</h1><p>{c.website} • {c.industry} • {c.address||'Service area not entered'}</p></div><div className="clientWorkspaceActions"><Link className="btn ghost" href="/admin/clients">← Pipeline</Link><DeleteBusiness clientId={id} businessName={c.business_name} redirectTo="/admin/clients" /></div></div>
    <div className="pipeline">{pipeline.map(([n,label,done]:any)=><div className={`pipelineStep ${done?'done':''}`} key={label}><div className="num">{n}</div><b>{label}</b></div>)}</div>
    <div className="grid cols4"><div className="kpi"><div className="value">{money(c.management_fee)}</div><div className="label">Management / Month</div></div><div className="kpi"><div className="value">{money(c.ad_budget)}</div><div className="label">Recommended Ad Budget</div></div><div className="kpi"><div className="value">{run?.result_json?.priority_findings?.length||0}</div><div className="label">Research Findings</div></div><div className="kpi"><div className="value">{run?.result_json?.sources?.length||0}</div><div className="label">Evidence Sources</div></div></div>
    <div style={{height:16}}/><AnalysisController clientId={id} initialStatus={c.analysis_status||'not_started'}/>
    {data&&<>
      <div className="sectionTitle"><div><h2>Intelligence Review</h2><p>Nothing reaches the client until Growth Intelligence LLC approves the analysis.</p></div></div>
      <div className="grid cols2">
        <div className="card"><div className="eyebrow">EXECUTIVE SUMMARY</div><h3>Current Position</h3><p className="muted" style={{lineHeight:1.7}}>{data.executive_summary}</p></div>
        <div className="card"><div className="eyebrow">PRIORITY FINDINGS</div>{(data.priority_findings||[]).slice(0,5).map((x:any,i:number)=><div key={i} style={{padding:'10px 0',borderBottom:'1px solid #153044'}}><b>{x.area}</b><div className="small muted">{x.finding}</div></div>)}</div>
      </div>
      <div style={{height:16}}/><div className="card"><div className="formRow" style={{justifyContent:'space-between'}}><div><div className="eyebrow">GENERATED CLIENT REPORTS</div><h3>PowerPoint Deliverables</h3><p className="small muted">Generated from the same research record, so the audit and roadmap stay consistent.</p></div><div className="formRow"><a className="btn secondary" href={`/api/reports/${id}/audit`} target="_blank">Open Audit PowerPoint</a><a className="btn secondary" href={`/api/reports/${id}/roadmap`} target="_blank">Open 90-Day Roadmap</a></div></div></div>
      <div style={{height:16}}/><div className="card"><div className="formRow" style={{justifyContent:'space-between'}}><div><div className="eyebrow">CLIENT RELEASE</div><h3>Approve the private client experience</h3><p className="small muted">After approval, the client sees the reports, pricing, guided intake, access checklist, agreement and activation sequence.</p></div><PublishController clientId={id} published={!!c.portal_published}/></div>{c.portal_published&&portalUrl&&<div style={{marginTop:15}}><div className="fieldLabel">Client Portal Link</div><div className="formRow"><input readOnly value={portalUrl}/><a className="btn" href={portalUrl} target="_blank">Preview</a></div></div>}</div>
      <div className="sectionTitle"><div><h2>Evidence Sources</h2><p>The public research trail behind the client-facing conclusions.</p></div></div>
      <div className="card sourceList">{(data.sources||[]).slice(0,15).map((x:any,i:number)=><div className="sourceItem" key={i}><b>{x.title}</b><a href={x.url} target="_blank">{x.url}</a><span className="muted">{x.used_for}</span></div>)}</div>
    </>}
    {(tasks.length>0||access.length>0)&&<><div className="sectionTitle"><div><h2>90-Day Operations</h2><p>Generated from the approved treatment plan and client access status.</p></div></div><div className="grid cols2"><div className="card"><div className="eyebrow">EXECUTION TASKS</div><h3>{tasks.filter((t:any)=>t.status==='done').length} / {tasks.length} completed</h3>{tasks.slice(0,12).map((t:any)=><div key={t.id} style={{padding:'9px 0',borderBottom:'1px solid #142b3d'}}><b className="small">{t.title}</b><div className="small muted">{t.phase||'90-Day Program'} • {t.status}</div></div>)}{!tasks.length&&<p className="small muted">Tasks are created automatically when onboarding is activated.</p>}</div><div className="card"><div className="eyebrow">SYSTEM ACCESS</div><h3>Implementation Permissions</h3>{access.map((a:any)=><div key={a.id} style={{display:'flex',justifyContent:'space-between',gap:10,padding:'10px 0',borderBottom:'1px solid #142b3d'}}><span className="small">{a.platform}</span><span className={`status ${a.status==='granted'?'good':a.status==='need_setup'?'warn':''}`}><i className="dot"/>{a.status}</span></div>)}{!access.length&&<p className="small muted">Access status will appear after the client completes the guided access step.</p>}</div></div></>}
    <div className="sectionTitle"><div><h2>Activity Timeline</h2><p>Permanent account history.</p></div></div>
    <div className="card">{activity.map((a:any)=><div key={a.id} style={{display:'grid',gridTemplateColumns:'160px 1fr',gap:14,padding:'10px 0',borderBottom:'1px solid #142b3d'}}><span className="small muted">{new Date(a.created_at).toLocaleString()}</span><div><b>{a.activity_type}</b><div className="small muted">{a.description}</div></div></div>)}{!activity.length&&<span className="muted small">No activity yet.</span>}</div>
  </AdminShell>
}
