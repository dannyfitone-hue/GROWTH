import Link from 'next/link';
import CompanyLogo from '@/components/CompanyLogo';
import AdminNav from '@/components/AdminNav';
export default function AdminShell({children}:{children:React.ReactNode}){
  return <div className="adminLayout">
    <aside className="sidebar">
      <Link href="/admin" className="companyBrandHome" aria-label="Growth Intelligence LLC command center"><CompanyLogo /><span>BUSINESS GROWTH COMMAND CENTER</span></Link>
      <AdminNav />
      <div className="sidebarFooter">
        <form action="/api/auth/logout" method="post"><button className="btn ghost" style={{width:'100%'}}>Sign Out</button></form>
      </div>
    </aside>
    <main className="adminMain">
      <header className="mobileCompanyHeader">
        <Link href="/admin" aria-label="Growth Intelligence LLC command center"><CompanyLogo variant="mobile" /></Link>
        <details className="mobileMenu">
          <summary>Menu <span aria-hidden="true">☰</span></summary>
          <AdminNav mobile />
        </details>
      </header>
      <div className="shell">{children}</div>
    </main>
  </div>
}
