export default async function Login({searchParams}:{searchParams:Promise<{error?:string}>}){
  const q=await searchParams;
  return <main className="loginPage"><section className="loginCard">
    <div className="brandLockup"><div className="mark">RL</div><div><strong>RL FOOTAGE</strong><span>GROWTH INTELLIGENCE CRM</span></div></div>
    <h1>Admin Command Access</h1><p>Private operations console for client research, proposal approval, onboarding, account access and 90-day execution.</p>
    {q.error&&<div className="error" style={{margin:'14px 0'}}>{q.error}</div>}
    <form action="/api/auth/login" method="post"><label className="field"><div className="fieldLabel">Admin Password</div><input type="password" name="password" required autoFocus/></label><button className="btn" style={{width:'100%'}}>Enter Command Center</button></form>
  </section></main>
}
