import { NextResponse } from 'next/server';

// Legacy V1 endpoint. Current portal submissions use /api/portal/[token]/submit.
export async function POST(_req: Request, { params }: { params: Promise<{ token: string }> }) {
  const { token } = await params;
  return NextResponse.json(
    { error: 'Legacy intake endpoint retired.', redirect: `/p/${token}` },
    { status: 410 }
  );
}
