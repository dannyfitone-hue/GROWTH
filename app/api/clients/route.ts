import { NextResponse } from 'next/server';
import crypto from 'crypto';
import { admin } from '../../../lib/supabase';

export async function POST(req: Request) {
  try {
    const b = await req.json();
    if (!b.business_name || !b.first_name || !b.last_name || !b.email) {
      return NextResponse.json({ error: 'Business name, first name, last name and email are required.' }, { status: 400 });
    }

    const db = admin();
    const token = crypto.randomBytes(24).toString('base64url');
    const { data, error } = await db
      .from('clients')
      .insert({
        business_name: String(b.business_name).trim(),
        first_name: String(b.first_name).trim(),
        last_name: String(b.last_name).trim(),
        email: String(b.email).trim(),
        website: b.website ? String(b.website).trim() : null,
        industry: b.industry || 'general',
        start_date: b.start_date || null,
        logo_url: b.logo_url || null,
        primary_color: b.primary_color || '#0b1f36',
        accent_color: b.accent_color || '#d8a23d',
        status: 'intake_sent'
      })
      .select()
      .single();

    if (error) {
      return NextResponse.json({ error: `Client could not be created: ${error.message}` }, { status: 400 });
    }

    const { error: linkError } = await db.from('intake_links').insert({ client_id: data.id, token, status: 'active' });
    if (linkError) {
      await db.from('clients').delete().eq('id', data.id);
      return NextResponse.json({ error: `Portal link could not be created: ${linkError.message}` }, { status: 400 });
    }

    const appUrl = (process.env.NEXT_PUBLIC_APP_URL || '').replace(/\/$/, '');
    const relativeUrl = `/intake/${token}`;
    return NextResponse.json({ id: data.id, url: appUrl ? `${appUrl}${relativeUrl}` : relativeUrl, relativeUrl });
  } catch (e: any) {
    console.error('create-client-error', e);
    return NextResponse.json({ error: e?.message || 'Unexpected server error while creating the client portal.' }, { status: 500 });
  }
}
