import Link from 'next/link';
import CompanyLogo from '@/components/CompanyLogo';
export default function AdminShell({children}:{children:React.ReactNode}){
  return <div className="adminLayout">
    <aside className="sidebar">
      <Link href="/admin" className="companyBrandHome" aria-label="Growth Intelligence LLC command center"><CompanyLogo /><span>BUSINESS GROWTH COMMAND CENTER</span></Link>
      <nav className="sideNav">
        <Link href="/admin">Command Center</Link>
        <Link href="/admin/clients/new">New Client</Link>
        <Link href="/admin">Client Pipeline</Link>
        <Link href="/admin">Analysis Queue</Link>
        <Link href="/admin">90-Day Operations</Link>
        <Link href="/admin">Reports</Link>
      </nav>
      <div style={{position:'absolute',bottom:18,left:16,right:16}}>
        <form action="/api/auth/logout" method="post"><button className="btn ghost" style={{width:'100%'}}>Sign Out</button></form>
      </div>
    </aside>
    <main className="adminMain"><header className="mobileCompanyHeader"><Link href="/admin" aria-label="Growth Intelligence LLC command center"><CompanyLogo variant="mobile" /></Link><span>Command Center</span></header><div className="shell">{children}</div></main>
  </div>
}
