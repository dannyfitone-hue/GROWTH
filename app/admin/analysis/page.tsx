import Link from 'next/link';
import AdminShell from '@/components/AdminShell';
import { AdminDataError, AdminEmptyState, AdminFilters, AdminPagination, AdminStatus } from '@/components/AdminPageUI';
import { requireAdminPage } from '@/lib/auth';
import { dbAdmin } from '@/lib/supabase';
import { ADMIN_PAGE_SIZE, AdminSearch, ClientSummary, adminPageHref, displayDate, literalSearch, pageNumber, searchValue } from '@/lib/admin-views';

type QueueClient = ClientSummary & { growth_analysis_runs: { progress: number | null; error_message: string | null; created_at: string }[] };

export default async function AnalysisQueue({ searchParams }: { searchParams: Promise<AdminSearch> }) {
  await requireAdminPage();
  const params = await searchParams;
  const q = searchValue(params, 'q'), page = pageNumber(params);
  const status = ['not_started', 'working', 'complete', 'failed'].includes(searchValue(params, 'status')) ? searchValue(params, 'status') : '';
  let query = dbAdmin().from('growth_clients').select('id,business_name,analysis_status,growth_analysis_runs(progress,error_message,created_at)', { count: 'exact' }).order('created_at', { ascending: false }).order('id').order('created_at', { referencedTable: 'growth_analysis_runs', ascending: false }).limit(1, { referencedTable: 'growth_analysis_runs' });
  if (q) query = query.ilike('business_name', literalSearch(q));
  if (status === 'working') query = query.in('analysis_status', ['queued', 'running']);
  else if (status === 'not_started') query = query.or('analysis_status.eq.not_started,analysis_status.is.null');
  else if (status) query = query.eq('analysis_status', status);
  const { data, error, count } = await query.range((page - 1) * ADMIN_PAGE_SIZE, page * ADMIN_PAGE_SIZE - 1);
  const clients = (data || []) as QueueClient[];
  return <AdminShell>
    <div className="pageHead"><div><div className="eyebrow">RESEARCH MONITOR</div><h1>Analysis Queue</h1><p>Review saved research status and open a workspace to run, retry, or review an analysis.</p></div><a className="btn secondary" href={adminPageHref('/admin/analysis', { q, status, page })}>Refresh queue</a></div>
    <p className="adminNote">Starting research requires a funded OpenAI API account. Viewing this queue does not start a new analysis.</p>
    <AdminFilters path="/admin/analysis" q={q}><label><span className="fieldLabel">Analysis status</span><select name="status" defaultValue={status}><option value="">All statuses</option><option value="not_started">Not started</option><option value="working">Queued or running</option><option value="complete">Complete</option><option value="failed">Needs attention</option></select></label></AdminFilters>
    {error ? <AdminDataError section="the analysis queue" /> : <>
      {clients.length ? <div className="adminRecordList">{clients.map(client => {
        const run = client.growth_analysis_runs?.[0];
        const progress = client.analysis_status === 'complete' ? 100 : Math.max(0, Math.min(100, Number(run?.progress) || 0));
        return <article className="card" key={client.id}><div className="adminRecordHead"><div><Link className="recordLink" href={`/admin/clients/${client.id}`}>{client.business_name}</Link><p className="small muted">Latest research request: {displayDate(run?.created_at)}</p></div><AdminStatus value={client.analysis_status} /></div>
          <div className="adminProgressLabel"><span>Saved progress</span><span>{progress}%</span></div><div className="progress" role="progressbar" aria-label={`${client.business_name} research`} aria-valuenow={progress} aria-valuemin={0} aria-valuemax={100}><span style={{ width: `${progress}%` }} /></div>
          {client.analysis_status === 'failed' && <p className="adminNote">{run?.error_message || 'Open the client workspace to review the problem or retry research.'}</p>}
          <div className="adminRecordActions"><Link className="btn secondary" href={`/admin/clients/${client.id}`}>{client.analysis_status === 'complete' ? 'Review analysis' : 'Open client workspace'}</Link></div>
        </article>;
      })}</div> : <AdminEmptyState title="No analyses in this view" href="/admin/clients" action="Open client pipeline">Research appears here after you add a client. Clear the filters to see other statuses.</AdminEmptyState>}
      <AdminPagination path="/admin/analysis" page={page} shown={clients.length} total={count || 0} filters={{ q, status }} />
    </>}
  </AdminShell>;
}
