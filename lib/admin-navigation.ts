export const adminNavigation = [
  { href: '/admin', label: 'Command Center' },
  { href: '/admin/clients/new', label: 'New Client' },
  { href: '/admin/clients', label: 'Client Pipeline' },
  { href: '/admin/analysis', label: 'Analysis Queue' },
  { href: '/admin/operations', label: '90-Day Operations' },
  { href: '/admin/reports', label: 'Reports' },
] as const;

export function isAdminNavActive(pathname: string, href: string) {
  if (href === '/admin' || href === '/admin/clients/new') return pathname === href;
  if (href === '/admin/clients' && pathname === '/admin/clients/new') return false;
  return pathname === href || pathname.startsWith(`${href}/`);
}
