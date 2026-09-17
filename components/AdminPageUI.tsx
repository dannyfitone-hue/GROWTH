import Link from 'next/link';
import type { ReactNode } from 'react';
import { ADMIN_PAGE_SIZE, adminPageHref, statusLabel } from '@/lib/admin-views';

export function AdminFilters({ path, q, placeholder = 'Search business name…', children }: { path: string; q: string; placeholder?: string; children?: ReactNode }) {
  return <form action={path} method="get" className="adminFilters">
    <label className="adminSearch"><span className="fieldLabel">Search</span><input type="search" name="q" defaultValue={q} placeholder={placeholder} /></label>
    {children}
    <button className="btn secondary" type="submit">Apply filters</button>
    <Link className="btn ghost" href={path}>Clear</Link>
  </form>;
}

export function AdminEmptyState({ title, children, href, action }: { title: string; children: ReactNode; href: string; action: string }) {
  return <section className="card adminEmpty"><h2>{title}</h2><p>{children}</p><Link className="btn secondary" href={href}>{action}</Link></section>;
}

export function AdminDataError({ section }: { section: string }) {
  return <div className="error" role="alert"><b>Unable to load {section}.</b><p>The CRM could not read these records. Refresh this page or check the existing database connection and permissions. Your records have not been changed.</p></div>;
}

export function AdminStatus({ value }: { value?: string | null }) {
  const tone = ['complete', 'completed', 'done', 'active', 'published'].includes(value || '') ? 'good'
    : ['running', 'queued', 'in_progress', 'strategy_48h'].includes(value || '') ? 'live'
    : ['failed', 'not_started', 'todo', 'private'].includes(value || 'not_started') ? 'warn' : '';
  return <span className={`status ${tone}`}><i className="dot" aria-hidden="true" />{statusLabel(value)}</span>;
}

export function AdminPagination({ path, page, total, shown, filters = {} }: { path: string; page: number; total: number; shown: number; filters?: Record<string, string> }) {
  const pages = Math.max(1, Math.ceil(total / ADMIN_PAGE_SIZE));
  return <nav className="adminPagination" aria-label="Results pages">
    <p className="small muted">{shown ? `${(page - 1) * ADMIN_PAGE_SIZE + 1}–${(page - 1) * ADMIN_PAGE_SIZE + shown}` : '0'} of {total} records</p>
    <div className="formRow">
      {page > 1 && <><Link className="btn ghost" href={adminPageHref(path, { ...filters, page: 1 })}>First</Link><Link className="btn secondary" href={adminPageHref(path, { ...filters, page: page - 1 })}>Previous</Link></>}
      {page < pages && <Link className="btn secondary" href={adminPageHref(path, { ...filters, page: page + 1 })}>Next</Link>}
    </div>
  </nav>;
}
