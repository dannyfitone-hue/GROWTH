# RL Footage Growth CRM — V1 foundation

Implemented:
- Client creation
- Client-specific business name/logo/colors/industry theme
- Cryptographically random onboarding token
- Plumbing/restoration-specific service intake
- Google/website access-status intake (no password collection)
- Intake submission -> active client status
- Activity record
- Database foundation for tasks/files

## Setup
1. Create a Supabase project.
2. Run `supabase/schema.sql` in Supabase SQL Editor.
3. Copy `.env.example` to `.env.local` and fill Supabase URL, anon key, and service-role key.
4. `npm install`
5. `npm run dev`
6. Open `/admin/clients/new`.

## Security before production
V1 is intentionally not production-exposed yet. Before deploying publicly, add Supabase Auth to all `/admin` routes, Row Level Security policies, private Storage buckets, rate limiting, CAPTCHA/abuse controls on public intake, signed upload URLs, e-signature audit fields, contract versioning, CSRF/origin validation, and server-side validation. Never expose the service-role key to the browser.

## Next build slice
- Admin authentication
- Client dashboard/search
- Autosave/resume intake
- Logo upload + brand extraction/approval
- Agreement/e-signature
- Asset uploads
- 90-day task templates
- PDF export
- Email notifications
