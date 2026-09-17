import CompanyLogo from '@/components/CompanyLogo';

export default async function Login({searchParams}:{searchParams:Promise<{error?:string}>}){
  const q=await searchParams;
  return <main className="loginPage"><section className="loginCard">
    <div className="loginCompanyBrand"><CompanyLogo variant="login" /><div className="eyebrow">BUSINESS GROWTH COMMAND CENTER</div></div>
    <h1>Welcome back.</h1><p>Sign in to manage your clients, insights, and growth plans.</p>
    {q.error&&<div className="error" style={{margin:'14px 0'}}>{q.error}</div>}
    <form action="/api/auth/login" method="post"><label className="field"><div className="fieldLabel">Admin Password</div><input type="password" name="password" autoComplete="current-password" required/></label><button className="btn" style={{width:'100%'}}>Sign in</button></form>
  </section></main>
}
