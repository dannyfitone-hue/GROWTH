# RL Footage Growth CRM — V1.1 Fix

## Why "Generate Portal" appeared to do nothing in V1
The V1 page did not show API/backend errors. If Supabase was not configured, the schema was not installed, or Vercel environment variables were missing, the request failed silently in the UI.

V1.1 fixes this by:
- showing loading state
- showing exact backend/database errors on screen
- validating Supabase environment variables
- rolling back a client row if link creation fails
- generating an absolute client URL when NEXT_PUBLIC_APP_URL is configured
- adding Copy Link / Preview buttons
- adding `/api/health` to test the deployment

## Required Supabase setup
1. Create/open your Supabase project.
2. Open SQL Editor.
3. Run the entire `supabase/schema.sql` file once.
4. In Supabase Project Settings > API, copy:
   - Project URL
   - service_role key (server only; never expose in browser)

## Required Vercel environment variables
In Vercel > Project > Settings > Environment Variables add:

NEXT_PUBLIC_SUPABASE_URL=https://YOURPROJECT.supabase.co
SUPABASE_SERVICE_ROLE_KEY=YOUR_SERVICE_ROLE_KEY
NEXT_PUBLIC_APP_URL=https://YOUR-VERCEL-DOMAIN.vercel.app

NEXT_PUBLIC_SUPABASE_ANON_KEY is included in `.env.example` for future browser-side auth but is not needed by the current create-client API.

After adding/changing environment variables, redeploy the project.

## Diagnostic test
Open:
`https://YOUR-DOMAIN/api/health`

Expected:
`{"ok":true,"database":"connected","clients_table":"available"}`

If it returns an error, the message identifies the setup problem.

## Security
This build is still a development slice. Before giving real clients public links, add Admin Auth, RLS/private storage, rate limiting, e-sign audit fields, secure file uploads and origin/CSRF controls.
