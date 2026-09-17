import Link from 'next/link';
import AdminShell from '@/components/AdminShell';
import DeleteBusiness from '@/components/DeleteBusiness';
import { AdminDataError, AdminEmptyState, AdminFilters, AdminPagination, AdminStatus } from '@/components/AdminPageUI';
import { requireAdminPage } from '@/lib/auth';
import { dbAdmin } from '@/lib/supabase';
import { ADMIN_PAGE_SIZE, AdminSearch, ClientSummary, displayDate, literalSearch, pageNumber, searchValue } from '@/lib/admin-views';

export default async function ClientPipeline({ searchParams }: { searchParams: Promise<AdminSearch> }) {
  await requireAdminPage();
  const params = await searchParams;
  const q = searchValue(params, 'q'), page = pageNumber(params);
  const stages = ['proposal', 'intake_sent', 'strategy_48h', 'active', 'completed'];
  const stage = stages.includes(searchValue(params, 'stage')) ? searchValue(params, 'stage') : '';
  let query = dbAdmin().from('growth_clients').select('id,business_name,industry,status,analysis_status,onboarding_status,portal_published,management_fee,start_date', { count: 'exact' }).order('created_at', { ascending: false }).order('id');
  if (q) query = query.ilike('business_name', literalSearch(q));
  if (stage) query = query.eq('status', stage);
  const { data, error, count } = await query.range((page - 1) * ADMIN_PAGE_SIZE, page * ADMIN_PAGE_SIZE - 1);
  const clients = (data || []) as ClientSummary[];
  return <AdminShell>
    <div className="pageHead"><div><div className="eyebrow">SALES & ONBOARDING</div><h1>Client Pipeline</h1><p>Find a business, follow its progress, and open its client workspace.</p></div><Link className="btn" href="/admin/clients/new">+ Create Client</Link></div>
    <AdminFilters path="/admin/clients" q={q}><label><span className="fieldLabel">Program stage</span><select name="stage" defaultValue={stage}><option value="">All stages</option><option value="proposal">Proposal</option><option value="intake_sent">Intake sent</option><option value="strategy_48h">Strategy review</option><option value="active">Active</option><option value="completed">Completed</option></select></label></AdminFilters>
    {error ? <AdminDataError section="the client pipeline" /> : <>
      {clients.length ? <div className="tableWrap"><table className="dataTable"><thead><tr><th scope="col">Business</th><th scope="col">Program stage</th><th scope="col">Analysis</th><th scope="col">Portal</th><th scope="col">Onboarding</th><th scope="col">Start date</th><th scope="col">Actions</th></tr></thead><tbody>
        {clients.map(client => <tr key={client.id}><td><Link className="recordLink" href={`/admin/clients/${client.id}`}>{client.business_name}</Link><div className="small muted">{client.industry || 'General'}</div></td><td><AdminStatus value={client.status} /></td><td><AdminStatus value={client.analysis_status} /></td><td><AdminStatus value={client.portal_published ? 'published' : 'private'} /></td><td><AdminStatus value={client.onboarding_status} /></td><td>{displayDate(client.start_date)}</td><td><DeleteBusiness clientId={client.id} businessName={client.business_name} compact /></td></tr>)}
      </tbody></table></div> : <AdminEmptyState title={q || stage || page > 1 ? 'No matching clients' : 'Your pipeline is ready'} href={q || stage || page > 1 ? '/admin/clients' : '/admin/clients/new'} action={q || stage || page > 1 ? 'View all clients' : 'Create your first client'}>{q || stage || page > 1 ? 'Try a different search or remove the filters.' : 'Create a client to begin research and onboarding.'}</AdminEmptyState>}
      <AdminPagination path="/admin/clients" page={page} shown={clients.length} total={count || 0} filters={{ q, stage }} />
    </>}
  </AdminShell>;
}
