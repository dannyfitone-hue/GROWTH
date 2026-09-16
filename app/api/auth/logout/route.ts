import { NextResponse } from 'next/server'; import { adminCookieName } from '@/lib/auth';
export async function POST(req:Request){const res=NextResponse.redirect(new URL('/login',req.url),303);res.cookies.set(adminCookieName,'',{httpOnly:true,secure:true,sameSite:'lax',path:'/',maxAge:0});return res;}
