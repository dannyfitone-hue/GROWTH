'use client';

import { FormEvent, useId, useRef, useState } from 'react';

export default function DeleteBusiness({ clientId, businessName, compact = false, redirectTo }: {
  clientId: string;
  businessName: string;
  compact?: boolean;
  redirectTo?: string;
}) {
  const dialog = useRef<HTMLDialogElement>(null);
  const submitting = useRef(false);
  const id = useId();
  const [confirmation, setConfirmation] = useState('');
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const matches = confirmation.trim() === businessName.trim() && confirmation.trim().length > 0;

  function open() {
    setConfirmation('');
    setError('');
    dialog.current?.showModal();
  }

  async function remove(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!matches || submitting.current) return;
    submitting.current = true;
    setBusy(true);
    setError('');
    try {
      const response = await fetch(`/api/clients/${encodeURIComponent(clientId)}`, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ confirmation }),
      });
      const result = await response.json().catch(() => null);
      if (!response.ok || !result?.ok) {
        throw new Error(result?.error || 'We could not confirm the deletion. Refresh this page before trying again.');
      }
      // Reload server data and clear prefetched pages containing the deleted business.
      if (redirectTo) window.location.assign(redirectTo);
      else window.location.reload();
    } catch (failure) {
      setError(failure instanceof Error ? failure.message : 'We could not confirm the deletion. Refresh this page before trying again.');
      submitting.current = false;
      setBusy(false);
    }
  }

  return <>
    <button type="button" className={`btn danger${compact ? ' deleteBusinessCompact' : ''}`} aria-label={`Delete business: ${businessName}`} aria-haspopup="dialog" onClick={open}>
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M3 6h18M9 6V4h6v2M5 6l1 14h12l1-14M10 10v6M14 10v6" /></svg>
      {compact ? 'Delete' : 'Delete business'}
    </button>
    <dialog ref={dialog} className="deleteBusinessDialog" aria-labelledby={`${id}-title`} aria-describedby={`${id}-description`} onCancel={event => { if (submitting.current) event.preventDefault(); }}>
      <form onSubmit={remove} aria-busy={busy}>
        <div className="eyebrow">BUSINESS RECORD</div>
        <h2 id={`${id}-title`}>Delete this business?</h2>
        <div className="deleteBusinessName">{businessName}</div>
        <p id={`${id}-description`}>This permanently removes the business and its linked CRM records. Its client portal link will stop working. This cannot be undone.</p>
        <label htmlFor={`${id}-confirmation`} className="fieldLabel">Type the business name to confirm</label>
        <input id={`${id}-confirmation`} value={confirmation} onChange={event => setConfirmation(event.target.value)} autoComplete="off" autoCorrect="off" autoCapitalize="off" spellCheck={false} disabled={busy} required aria-describedby={`${id}-hint`} />
        <p id={`${id}-hint`} className="hint">Enter the name exactly as shown above.</p>
        {error && <p className="deleteBusinessError" role="alert">{error}</p>}
        <div className="deleteBusinessActions">
          <button type="button" className="btn secondary" autoFocus disabled={busy} onClick={() => dialog.current?.close()}>Cancel</button>
          <button type="submit" className="btn danger" disabled={!matches || busy}>{busy ? 'Deleting…' : 'Permanently delete'}</button>
        </div>
        <span className="deleteBusinessAnnounce" role="status">{busy ? 'Deleting business. Please wait.' : ''}</span>
      </form>
    </dialog>
  </>;
}
