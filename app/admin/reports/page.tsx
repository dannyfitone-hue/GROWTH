import Link from 'next/link';
import AdminShell from '@/components/AdminShell';
import { AdminDataError, AdminEmptyState, AdminFilters, AdminPagination, AdminStatus } from '@/components/AdminPageUI';
import { requireAdminPage } from '@/lib/auth';
import { dbAdmin } from '@/lib/supabase';
import { ADMIN_PAGE_SIZE, AdminSearch, ClientSummary, displayDate, literalSearch, pageNumber, searchValue } from '@/lib/admin-views';

type ReportClient = ClientSummary & { growth_analysis_runs: { id: string; created_at: string; completed_at: string | null }[] };

export default async function Reports({ searchParams }: { searchParams: Promise<AdminSearch> }) {
  await requireAdminPage();
  const params = await searchParams;
  const q = searchValue(params, 'q'), page = pageNumber(params), ready = searchValue(params, 'ready') === 'yes';
  let query = dbAdmin().from('growth_clients').select(`id,business_name,analysis_status,portal_published,growth_analysis_runs${ready ? '!inner' : ''}(id,created_at,completed_at)`, { count: 'exact' })
    .eq('growth_analysis_runs.status', 'complete').not('growth_analysis_runs.result_json', 'is', null)
    .order('created_at', { ascending: false }).order('id').order('created_at', { referencedTable: 'growth_analysis_runs', ascending: false }).limit(1, { referencedTable: 'growth_analysis_runs' });
  if (q) query = query.ilike('business_name', literalSearch(q));
  const { data, error, count } = await query.range((page - 1) * ADMIN_PAGE_SIZE, page * ADMIN_PAGE_SIZE - 1);
  const clients = (data || []) as unknown as ReportClient[];
  return <AdminShell>
    <div className="pageHead"><div><div className="eyebrow">CLIENT DELIVERABLES</div><h1>Reports</h1><p>Download the audit and 90-day roadmap from each client’s latest completed analysis.</p></div><Link className="btn secondary" href="/admin/analysis">View analysis queue</Link></div>
    <AdminFilters path="/admin/reports" q={q}><label><span className="fieldLabel">Availability</span><select name="ready" defaultValue={ready ? 'yes' : ''}><option value="">All clients</option><option value="yes">Ready to download</option></select></label></AdminFilters>
    {error ? <AdminDataError section="reports" /> : <>
      {clients.length ? <div className="adminRecordList">{clients.map(client => {
        const report = client.growth_analysis_runs?.[0];
        return <article className="card" key={client.id}><div className="adminRecordHead"><div><Link className="recordLink" href={`/admin/clients/${client.id}`}>{client.business_name}</Link><p className="small muted">{report ? `Analysis completed ${displayDate(report.completed_at || report.created_at)}` : 'Waiting for a completed analysis'}</p></div><AdminStatus value={report ? 'complete' : client.analysis_status} /></div>
          {report ? <><div className="adminRecordActions"><a className="btn" href={`/api/reports/${client.id}/audit`}>Download Audit</a><a className="btn secondary" href={`/api/reports/${client.id}/roadmap`}>Download 90-Day Roadmap</a><Link className="btn ghost" href={`/admin/clients/${client.id}`}>Review workspace</Link></div><p className="small muted">{client.portal_published ? 'Available in the published client portal.' : 'Private to your team until you approve and publish the client portal.'}</p></>
            : <><p className="adminTaskDescription">Reports will be available after research completes. No report has been generated for this client yet.</p><div className="adminRecordActions"><Link className="btn secondary" href={`/admin/clients/${client.id}`}>Open client workspace</Link></div></>}
        </article>;
      })}</div> : <AdminEmptyState title="No reports in this view" href="/admin/analysis" action="Open analysis queue">Add a client and complete their analysis to generate the audit and roadmap, or clear the filters to see other clients.</AdminEmptyState>}
      <AdminPagination path="/admin/reports" page={page} shown={clients.length} total={count || 0} filters={{ q, ready: ready ? 'yes' : '' }} />
    </>}
  </AdminShell>;
}
