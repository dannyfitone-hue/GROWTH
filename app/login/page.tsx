import CompanyLogo from '@/components/CompanyLogo';

export default async function Login({searchParams}:{searchParams:Promise<{error?:string}>}){
  const q=await searchParams;
  return <main className="loginPage"><section className="loginCard">
    <div className="loginCompanyBrand"><CompanyLogo variant="login" /><div className="eyebrow">BUSINESS GROWTH COMMAND CENTER</div></div>
    <h1>Intelligence Command Access</h1><p>Private operating system for business intelligence, client strategy, onboarding, account access and 90-day growth execution.</p>
    {q.error&&<div className="error" style={{margin:'14px 0'}}>{q.error}</div>}
    <form action="/api/auth/login" method="post"><label className="field"><div className="fieldLabel">Admin Password</div><input type="password" name="password" required autoFocus/></label><button className="btn" style={{width:'100%'}}>Enter Command Center</button></form>
  </section></main>
}
