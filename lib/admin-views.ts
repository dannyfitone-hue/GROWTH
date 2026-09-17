export const ADMIN_PAGE_SIZE = 25;
export type AdminSearch = Record<string, string | string[] | undefined>;

export function searchValue(params: AdminSearch, key: string) {
  return typeof params[key] === 'string' ? params[key].trim() : '';
}

export function pageNumber(params: AdminSearch) {
  const value = Number(searchValue(params, 'page'));
  return Number.isSafeInteger(value) && value > 0 ? Math.min(value, 100000) : 1;
}

export function literalSearch(value: string) {
  return `%${value.replace(/[\\%_]/g, '\\$&')}%`;
}

export function adminPageHref(path: string, values: Record<string, string | number>) {
  const params = new URLSearchParams();
  for (const [key, value] of Object.entries(values)) {
    if (String(value) && !(key === 'page' && Number(value) === 1)) params.set(key, String(value));
  }
  return params.size ? `${path}?${params.toString()}` : path;
}

export function statusLabel(value?: string | null) {
  return (value || 'not_started').replaceAll('_', ' ');
}

export function displayDate(value?: string | null) {
  if (!value) return '—';
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? '—' : date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric', timeZone: 'UTC' });
}

export interface ClientSummary {
  id: string;
  business_name: string;
  industry?: string | null;
  status?: string | null;
  analysis_status?: string | null;
  onboarding_status?: string | null;
  portal_published?: boolean;
  management_fee?: number | null;
  start_date?: string | null;
}
