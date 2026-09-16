import Link from 'next/link';
export default function AdminShell({children}:{children:React.ReactNode}){
  return <div className="adminLayout">
    <aside className="sidebar">
      <div className="sideBrand"><b>RL FOOTAGE</b><span>GROWTH INTELLIGENCE CRM</span></div>
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
    <main className="adminMain"><div className="shell">{children}</div></main>
  </div>
}
