'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function NewClientForm(){
  const [loading,setLoading]=useState(false); const [error,setError]=useState(''); const router=useRouter();
  async function submit(e:React.FormEvent<HTMLFormElement>){e.preventDefault();setLoading(true);setError('');const body=Object.fromEntries(new FormData(e.currentTarget).entries());
    const r=await fetch('/api/clients',{method:'POST',headers:{'content-type':'application/json'},body:JSON.stringify(body)}); const j=await r.json().catch(()=>({error:'Invalid server response'})); setLoading(false); if(!r.ok){setError(j.error||'Could not create client');return;} router.push(`/admin/clients/${j.id}`);}
  return <form className="card" onSubmit={submit}>
    <div className="formGrid">
      <label className="field"><div className="fieldLabel">Business Name</div><input name="business_name" placeholder="Adamik's American Plumbing & Drain" required/></label>
      <label className="field"><div className="fieldLabel">Website</div><input name="website" placeholder="https://example.com" required/></label>
      <label className="field"><div className="fieldLabel">Client First Name</div><input name="first_name" required/></label>
      <label className="field"><div className="fieldLabel">Client Last Name</div><input name="last_name" required/></label>
      <label className="field"><div className="fieldLabel">Client Email</div><input type="email" name="email" required/></label>
      <label className="field"><div className="fieldLabel">Phone</div><input name="phone"/></label>
      <label className="field"><div className="fieldLabel">Business / Service Base</div><input name="address" placeholder="City, State or full business address"/></label>
      <label className="field"><div className="fieldLabel">Industry</div><select name="industry" defaultValue="plumbing"><option value="plumbing">Plumbing & Drain</option><option value="restoration">Restoration</option><option value="general">Other Local Service</option></select></label>
      <label className="field"><div className="fieldLabel">Takeover / Start Date</div><input type="date" name="start_date"/></label>
      <label className="field"><div className="fieldLabel">Monthly Management Fee</div><input type="number" step="0.01" name="management_fee" placeholder="2500"/></label>
      <label className="field"><div className="fieldLabel">Setup / Onboarding Fee</div><input type="number" step="0.01" name="setup_fee" placeholder="0"/></label>
      <label className="field"><div className="fieldLabel">Recommended Google Ad Budget</div><input type="number" step="0.01" name="ad_budget" placeholder="4000"/></label>
    </div>
    <div className="divider"/>
    <div className="formRow"><button className="btn gold" disabled={loading}>{loading?'Building Client Workspace…':'Create Client Intelligence Workspace'}</button><span className="hint">We will scan the website for brand/logo metadata and prepare the private analysis workspace.</span></div>
    {error&&<div className="error" style={{marginTop:14}}>{error}</div>}
  </form>
}
