import Link from 'next/link';
import AdminShell from '@/components/AdminShell';
import { AdminDataError, AdminEmptyState, AdminFilters, AdminPagination, AdminStatus } from '@/components/AdminPageUI';
import { requireAdminPage } from '@/lib/auth';
import { dbAdmin } from '@/lib/supabase';
import { ADMIN_PAGE_SIZE, AdminSearch, literalSearch, pageNumber, searchValue, statusLabel } from '@/lib/admin-views';

interface Task { id: string; client_id: string; title: string; description: string | null; phase: string | null; status: string; priority: string | null }

export default async function Operations({ searchParams }: { searchParams: Promise<AdminSearch> }) {
  await requireAdminPage();
  const params = await searchParams;
  const q = searchValue(params, 'q'), page = pageNumber(params);
  const status = ['todo', 'in_progress', 'done'].includes(searchValue(params, 'status')) ? searchValue(params, 'status') : '';
  const db = dbAdmin();
  let query = db.from('growth_tasks').select('id,client_id,title,description,phase,status,priority', { count: 'exact' }).order('created_at', { ascending: true }).order('id');
  if (q) query = query.ilike('title', literalSearch(q));
  if (status) query = query.eq('status', status);
  const { data, error, count } = await query.range((page - 1) * ADMIN_PAGE_SIZE, page * ADMIN_PAGE_SIZE - 1);
  const tasks = (data || []) as Task[];
  const clientIds = [...new Set(tasks.map(task => task.client_id))];
  const clients = clientIds.length ? await db.from('growth_clients').select('id,business_name').in('id', clientIds) : { data: [], error: null };
  const names = new Map((clients.data || []).map(client => [client.id, client.business_name]));
  return <AdminShell>
    <div className="pageHead"><div><div className="eyebrow">DELIVERY & EXECUTION</div><h1>90-Day Operations</h1><p>Review implementation tasks, treatment phases, and recorded progress across your clients.</p></div><Link className="btn secondary" href="/admin/clients">View clients</Link></div>
    <AdminFilters path="/admin/operations" q={q} placeholder="Search task title…"><label><span className="fieldLabel">Task status</span><select name="status" defaultValue={status}><option value="">All tasks</option><option value="todo">To do</option><option value="in_progress">In progress</option><option value="done">Completed</option></select></label></AdminFilters>
    {error || clients.error ? <AdminDataError section="90-day operations" /> : <>
      {tasks.length ? <div className="adminRecordList">{tasks.map(task => <article className="card" key={task.id}>
        <div className="adminRecordHead"><div><Link className="recordLink" href={`/admin/clients/${task.client_id}`}>{names.get(task.client_id) || 'Client workspace'}</Link><p className="small muted">{task.phase || '90-Day Program'} · {statusLabel(task.priority || 'normal')} priority</p></div><AdminStatus value={task.status} /></div>
        <h2 className="adminTaskTitle">{task.title}</h2>{task.description && <p className="adminTaskDescription">{task.description}</p>}
        <div className="adminRecordActions"><Link className="btn secondary" href={`/admin/clients/${task.client_id}`}>Open client workspace</Link></div>
      </article>)}</div> : <AdminEmptyState title={q || status || page > 1 ? 'No matching tasks' : 'Your execution plan will appear here'} href={q || status || page > 1 ? '/admin/operations' : '/admin/clients'} action={q || status || page > 1 ? 'View all tasks' : 'Open client pipeline'}>{q || status || page > 1 ? 'Try another task title or status.' : 'Tasks are created from the approved roadmap when a client completes onboarding and activates their program.'}</AdminEmptyState>}
      <AdminPagination path="/admin/operations" page={page} shown={tasks.length} total={count || 0} filters={{ q, status }} />
    </>}
  </AdminShell>;
}
