import { NextResponse } from 'next/server';
import { admin } from '../../../lib/supabase';

export async function GET() {
  try {
    const db = admin();
    const { error } = await db.from('growth_clients').select('id').limit(1);
    if (error) return NextResponse.json({ ok: false, error: error.message }, { status: 500 });
    return NextResponse.json({ ok: true, database: 'connected', growth_clients_table: 'available' });
  } catch (e: any) {
    return NextResponse.json({ ok: false, error: e?.message || 'Health check failed' }, { status: 500 });
  }
}
