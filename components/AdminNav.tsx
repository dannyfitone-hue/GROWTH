'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { adminNavigation, isAdminNavActive } from '@/lib/admin-navigation';

export default function AdminNav({ mobile = false }: { mobile?: boolean }) {
  const pathname = usePathname();
  return <nav className={mobile ? 'mobileNav' : 'sideNav'} aria-label={mobile ? 'Mobile navigation' : 'Main navigation'}>
    {adminNavigation.map(({ href, label }) => {
      const active = isAdminNavActive(pathname, href);
      return <Link key={href} href={href} className={active ? 'active' : undefined} aria-current={active ? 'page' : undefined}
        onClick={mobile ? (event) => event.currentTarget.closest('details')?.removeAttribute('open') : undefined}>
        {label}
      </Link>;
    })}
    {mobile && <form action="/api/auth/logout" method="post"><button type="submit">Sign Out</button></form>}
  </nav>;
}
