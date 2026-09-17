import Link from 'next/link';
import AdminShell from '@/components/AdminShell';
import DeleteBusiness from '@/components/DeleteBusiness';
import { requireAdminPage } from '@/lib/auth';
import { dbAdmin } from '@/lib/supabase';

export default async function Admin({searchParams}:{searchParams:Promise<{q?:string}>}){
  await requireAdminPage(); const db=dbAdmin(); const sp=await searchParams; const q=(sp.q||'').trim();
  let query=db.from('growth_clients').select('id,business_name,industry,status,onboarding_status,start_date,created_at,analysis_status,portal_published,management_fee,ad_budget').order('created_at',{ascending:false}).limit(100);
  if(q) query=query.ilike('business_name',`%${q}%`);
  const {data:clientsData}=await query;
  const clients=clientsData ?? [];
  const total=clients.length, active=clients.filter((x:any)=>x.status==='active').length, analysis=clients.filter((x:any)=>['queued','running'].includes(x.analysis_status)).length, pending=clients.filter((x:any)=>!x.portal_published).length;
  return <AdminShell>
    <div className="pageHead"><div><div className="eyebrow">OPERATIONS COMMAND CENTER</div><h1>Command Center</h1><p>Research → approve → onboard → activate → execute.</p></div><Link className="btn gold" href="/admin/clients/new">+ Create Client</Link></div>
    <div className="grid cols4"><div className="kpi"><div className="value">{total}</div><div className="label">Total Clients</div></div><div className="kpi"><div className="value">{analysis}</div><div className="label">Analysis Running</div></div><div className="kpi"><div className="value">{pending}</div><div className="label">Pending Publish</div></div><div className="kpi"><div className="value">{active}</div><div className="label">Active Programs</div></div></div>
    <div className="sectionTitle"><div><h2>Recent Clients</h2><p>Manage each business and its research, onboarding and execution record.</p></div><form method="get" className="formRow"><input name="q" defaultValue={q} placeholder="Search business name…" style={{width:260}}/><button className="btn secondary">Search</button></form></div>
    <div className="tableWrap"><table className="dataTable"><thead><tr><th>Business</th><th>Industry</th><th>Analysis</th><th>Portal</th><th>Onboarding</th><th>Program</th><th>Start</th><th>Actions</th></tr></thead><tbody>
      {clients.map((c:any)=><tr key={c.id}><td><Link href={`/admin/clients/${c.id}`}><b>{c.business_name}</b></Link></td><td>{c.industry||'general'}</td><td><span className={`status ${c.analysis_status==='complete'?'good':c.analysis_status==='running'?'live':'warn'}`}><i className="dot"/>{c.analysis_status||'not started'}</span></td><td><span className={`status ${c.portal_published?'good':'warn'}`}><i className="dot"/>{c.portal_published?'published':'private'}</span></td><td>{c.onboarding_status||'not started'}</td><td>${Number(c.management_fee||0).toLocaleString()}/mo</td><td>{c.start_date||'—'}</td><td><DeleteBusiness clientId={c.id} businessName={c.business_name} compact /></td></tr>)}
      {!clients.length&&<tr><td colSpan={8} className="muted">No clients yet. Create the first client to start the intelligence workflow.</td></tr>}
    </tbody></table></div>
  </AdminShell>
}
