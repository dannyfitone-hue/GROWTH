import { redirect } from 'next/navigation';

// Legacy V1 route retained only so upload-based repositories do not keep an obsolete intake UI.
// All current onboarding is handled by /p/[token].
export default async function LegacyIntake({ params }: { params: Promise<{ token: string }> }) {
  const { token } = await params;
  redirect(`/p/${token}`);
}
