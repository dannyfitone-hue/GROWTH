'use client';

import { useState } from 'react';

type Result = { id?: string; url?: string; relativeUrl?: string; error?: string };

export default function NewClient() {
  const [r, setR] = useState<Result | null>(null);
  const [loading, setLoading] = useState(false);

  async function submit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setR(null);
    try {
      const form = e.currentTarget;
      const body = Object.fromEntries(new FormData(form).entries());
      const response = await fetch('/api/clients', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify(body)
      });

      const text = await response.text();
      let data: Result;
      try {
        data = JSON.parse(text);
      } catch {
        data = { error: text || `Server returned ${response.status}` };
      }

      if (!response.ok) throw new Error(data.error || `Request failed with status ${response.status}`);
      setR(data);
    } catch (err: any) {
      setR({ error: err?.message || 'Portal generation failed.' });
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="shell">
      <div className="hero">
        <div className="eyebrow">RL FOOTAGE • CLIENT ONBOARDING CRM</div>
        <h1>Create Personalized Client Portal</h1>
        <p>Business identity + industry + brand theme → secure intake link.</p>
      </div>
      <div style={{ height: 18 }} />
      <form className="card" onSubmit={submit}>
        <div className="grid">
          <div><div className="label">Business name</div><input name="business_name" required /></div>
          <div><div className="label">First name</div><input name="first_name" required /></div>
          <div><div className="label">Last name</div><input name="last_name" required /></div>
          <div><div className="label">Email</div><input name="email" type="email" required /></div>
          <div><div className="label">Website</div><input name="website" placeholder="https://example.com" /></div>
          <div><div className="label">Industry</div><select name="industry" defaultValue="general"><option value="plumbing">Plumbing</option><option value="restoration">Restoration</option><option value="general">Other Local Service</option></select></div>
          <div><div className="label">Start date</div><input name="start_date" type="date" /></div>
          <div><div className="label">Logo URL</div><input name="logo_url" placeholder="Optional in V1.1" /></div>
          <div><div className="label">Primary color</div><input name="primary_color" type="color" defaultValue="#0b1f36" /></div>
          <div><div className="label">Accent color</div><input name="accent_color" type="color" defaultValue="#d8a23d" /></div>
        </div>
        <button className="btn" disabled={loading}>{loading ? 'Generating…' : 'Generate Portal'}</button>
      </form>

      {r?.error && (
        <div className="card errorCard" style={{ marginTop: 18 }}>
          <h3>Portal was not generated</h3>
          <p>{r.error}</p>
          <p className="muted">Check Supabase tables and Vercel environment variables. This message now shows the exact backend problem instead of failing silently.</p>
        </div>
      )}

      {r?.url && (
        <div className="card successCard" style={{ marginTop: 18 }}>
          <h3>Portal Created ✓</h3>
          <p className="portalUrl">{r.url}</p>
          <div className="actions">
            <a className="btn gold" href={r.url} target="_blank" rel="noreferrer">Preview Client Portal</a>
            <button className="btn secondary" type="button" onClick={() => navigator.clipboard.writeText(r.url!)}>Copy Link</button>
          </div>
        </div>
      )}
    </main>
  );
}
