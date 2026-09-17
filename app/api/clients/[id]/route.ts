import { NextResponse } from 'next/server';
import { isAdminRequest } from '@/lib/auth';
import { dbAdmin } from '@/lib/supabase';

export async function DELETE(request: Request, { params }: { params: Promise<{ id: string }> }) {
  if (!(await isAdminRequest())) return NextResponse.json({ error: 'Please sign in again before deleting a business.' }, { status: 401 });

  // A destructive action must come from this CRM, with an explicit JSON confirmation.
  const allowedOrigins = new Set([new URL(request.url).origin]);
  if (process.env.NEXT_PUBLIC_APP_URL) {
    try { allowedOrigins.add(new URL(process.env.NEXT_PUBLIC_APP_URL).origin); } catch { /* Ignore an invalid optional app URL. */ }
  }
  const origin = request.headers.get('origin');
  if (!origin || !allowedOrigins.has(origin) || request.headers.get('sec-fetch-site') === 'cross-site') {
    return NextResponse.json({ error: 'Open this action from your CRM and try again.' }, { status: 403 });
  }
  if (request.headers.get('content-type')?.split(';')[0].trim().toLowerCase() !== 'application/json') {
    return NextResponse.json({ error: 'A business-name confirmation is required.' }, { status: 415 });
  }

  const { id } = await params;
  if (!/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(id)) {
    return NextResponse.json({ error: 'Invalid business record.' }, { status: 400 });
  }
  let confirmation: unknown;
  try { confirmation = (await request.json())?.confirmation; }
  catch { return NextResponse.json({ error: 'A business-name confirmation is required.' }, { status: 400 }); }
  if (typeof confirmation !== 'string' || !confirmation.trim()) {
    return NextResponse.json({ error: 'Type the business name to confirm deletion.' }, { status: 400 });
  }

  try {
    const db = dbAdmin();
    const { data: client, error: readError } = await db.from('growth_clients').select('id,business_name').eq('id', id).maybeSingle();
    if (readError) return NextResponse.json({ error: 'Could not load this business. Refresh the page and try again.' }, { status: 500 });
    if (!client) return NextResponse.json({ error: 'This business no longer exists. Refresh the page to update your list.' }, { status: 404 });
    if (confirmation.trim() !== client.business_name.trim()) {
      return NextResponse.json({ error: 'The name does not match the current business name. Refresh the page if it has changed.' }, { status: 409 });
    }

    // One database statement: cascading foreign keys remove linked records atomically.
    // Never delete child tables separately: a constraint failure must preserve the whole account.
    // Match the ID and original name so duplicate names and concurrent renames stay safe.
    const { data: deleted, error } = await db.from('growth_clients').delete().eq('id', id).eq('business_name', client.business_name).select('id');
    if (error) {
      if (error.code === '23503') {
        return NextResponse.json({ error: 'This business has protected linked records. Nothing was deleted. The database relationships need to be checked before it can be removed.' }, { status: 409 });
      }
      return NextResponse.json({ error: 'We could not confirm the deletion. Refresh this page before trying again.' }, { status: 500 });
    }
    if (!deleted?.length) {
      return NextResponse.json({ error: 'This business changed or was already removed. Refresh the page before trying again.' }, { status: 409 });
    }
    return NextResponse.json({ ok: true, id });
  } catch {
    return NextResponse.json({ error: 'We could not confirm the deletion. Refresh this page before trying again.' }, { status: 500 });
  }
}
