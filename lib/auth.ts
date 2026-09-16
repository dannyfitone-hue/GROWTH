import crypto from 'crypto';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';

const COOKIE = 'rl_growth_admin';

function secret() {
  const s = process.env.SESSION_SECRET;
  if (!s) throw new Error('SESSION_SECRET is not configured.');
  return s;
}

export function signSession(value: string) {
  const sig = crypto.createHmac('sha256', secret()).update(value).digest('hex');
  return `${value}.${sig}`;
}

export function verifySession(token?: string) {
  if (!token) return false;
  const idx = token.lastIndexOf('.');
  if (idx < 1) return false;
  const value = token.slice(0, idx);
  const sig = token.slice(idx + 1);
  const expected = crypto.createHmac('sha256', secret()).update(value).digest('hex');
  try { return crypto.timingSafeEqual(Buffer.from(sig), Buffer.from(expected)) && value === 'admin'; }
  catch { return false; }
}

export async function requireAdminPage() {
  const jar = await cookies();
  if (!verifySession(jar.get(COOKIE)?.value)) redirect('/login');
}

export async function isAdminRequest() {
  const jar = await cookies();
  return verifySession(jar.get(COOKIE)?.value);
}

export const adminCookieName = COOKIE;
