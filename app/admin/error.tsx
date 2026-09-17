'use client';

import Link from 'next/link';

export default function AdminError({ reset }: { reset: () => void }) {
  return <main className="shell"><section className="card adminEmpty" role="alert"><h1>This section could not load.</h1><p>Please retry. If the problem continues, check the CRM database connection and configuration.</p><div className="formRow"><button className="btn" onClick={reset}>Try again</button><Link className="btn secondary" href="/admin">Command Center</Link></div></section></main>;
}
