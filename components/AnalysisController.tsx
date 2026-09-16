'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

export default function AnalysisController({clientId,initialStatus}:{clientId:string,initialStatus:string}){
  const [status,setStatus]=useState(initialStatus||'not_started'); const [error,setError]=useState(''); const [progress,setProgress]=useState(initialStatus==='complete'?100:0); const router=useRouter();
  async function start(){setError('');setStatus('queued');setProgress(12);const r=await fetch(`/api/clients/${clientId}/analyze`,{method:'POST'});const j=await r.json().catch(()=>({}));if(!r.ok){setStatus('failed');setError(j.error||'Analysis could not start');return;}setStatus('running');setProgress(22);}
  useEffect(()=>{if(!['queued','running'].includes(status))return;const t=setInterval(async()=>{const r=await fetch(`/api/clients/${clientId}/analysis-status`,{cache:'no-store'});const j=await r.json().catch(()=>({}));if(j.status){setStatus(j.status);setProgress(j.progress||55);}if(j.status==='complete'){clearInterval(t);setProgress(100);router.refresh();}if(j.status==='failed'){clearInterval(t);setError(j.error||'Analysis failed');}},5000);return()=>clearInterval(t);},[status,clientId,router]);
  return <div className="card">
    <div className="formRow" style={{justifyContent:'space-between'}}><div><div className="eyebrow">AI RESEARCH ENGINE</div><h3 style={{marginTop:7}}>Public Business Intelligence Analysis</h3><p className="muted small">Web research + competitor discovery + SEO/local/reputation/conversion analysis + evidence-backed 90-day treatment logic.</p></div><span className={`status ${status==='complete'?'good':status==='running'?'live':status==='failed'?'warn':''}`}><i className="dot"/>{status}</span></div>
    <div className="progress" style={{margin:'15px 0'}}><span style={{width:`${progress}%`}}/></div>
    {status==='not_started'&&<button className="btn gold" onClick={start}>Run Complete Business Analysis</button>}
    {['queued','running'].includes(status)&&<div className="success livePulse">Research is running in the background. You can leave this page; the analysis job is stored and will continue.</div>}
    {status==='failed'&&<><div className="error">{error||'Analysis failed.'}</div><button className="btn" style={{marginTop:10}} onClick={start}>Retry Analysis</button></>}
    {status==='complete'&&<div className="success">Research complete. Review the findings and generated reports below before publishing them to the client.</div>}
  </div>
}
