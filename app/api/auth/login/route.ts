import { NextResponse } from 'next/server';
import crypto from 'crypto';
import { adminCookieName, signSession } from '@/lib/auth';
export async function POST(req:Request){
  const fd=await req.formData(); const supplied=String(fd.get('password')||''); const expected=process.env.ADMIN_PASSWORD||'';
  if(!expected) return NextResponse.redirect(new URL('/login?error=ADMIN_PASSWORD%20is%20not%20configured',req.url),303);
  const a=Buffer.from(supplied),b=Buffer.from(expected); const ok=a.length===b.length&&crypto.timingSafeEqual(a,b);
  if(!ok) return NextResponse.redirect(new URL('/login?error=Invalid%20password',req.url),303);
  const res=NextResponse.redirect(new URL('/admin',req.url),303); res.cookies.set(adminCookieName,signSession('admin'),{httpOnly:true,secure:true,sameSite:'lax',path:'/',maxAge:60*60*12}); return res;
}
