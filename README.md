## V2.0.1 build fix
- Fixed strict TypeScript nullability for Supabase array query results in Admin dashboard/client workspace.
- No database migration changes from V2 PRO.

# RL Footage Growth Intelligence CRM — V2 PRO

This build restructures the earlier intake prototype into the workflow Daniel described:

**Admin creates client → AI researches business + web presence → audit + 90-day PowerPoints → RL Footage reviews/approves → personalized client portal → pricing → private intake → access plan → e-signature → activation → 48-hour strategy stage → 90-day tasks.**

## What is functional in V2 PRO

- Private RL Footage admin login (server-side signed session cookie)
- Client pipeline / command center
- Create client with business, website, contact, industry, start date and pricing
- Automatic website metadata scan for logo/favicon/OG image/title/description
- OpenAI Responses API background analysis job using built-in web search
- Structured evidence-based audit stored in Supabase
- Two generated PowerPoints from the same analysis record:
  - Google Growth Audit
  - 90-Day Execution & Results Roadmap
- Admin review gate before client sees anything
- Random secure client portal token
- High-tech client-branded guided portal
- One-step-at-a-time flow: Analysis → Program → Business → Access → Agreement → Review → Activation
- Program pricing automatically shown in portal and agreement
- Typed e-signature record + agreement snapshot
- Google/platform access planning without collecting passwords
- Final activation moves client to `strategy_48h`
- 90-day tasks automatically generated from the AI treatment plan
- Downloadable onboarding PDF after completion
- Permanent activity timeline

## Important: OpenAI API

The AI research layer uses the **OpenAI Responses API** with built-in web search and Structured Outputs. An OpenAI API key is separate from a ChatGPT subscription and must be added to Vercel as `OPENAI_API_KEY`.

The model is configurable using `OPENAI_MODEL`. The included default is `gpt-5.2`; change it to a model available to your API project if needed.

## 1. Run the V2 database migration

In Supabase → SQL Editor, run:

`supabase/migration_v2_pro.sql`

This is additive. It does not drop your older RL Footage `clients` table or the existing Growth CRM tables.

## 2. Vercel environment variables

Keep the two variables already configured:

- `NEXT_PUBLIC_SUPABASE_URL`
- `SUPABASE_SERVICE_ROLE_KEY` (Secret)

Add:

- `NEXT_PUBLIC_APP_URL` = your production CRM domain, e.g. `https://growth-tawny-one.vercel.app`
- `OPENAI_API_KEY` = OpenAI API secret key (Secret)
- `OPENAI_MODEL` = optional; default `gpt-5.2`
- `ADMIN_PASSWORD` = long private password for RL Footage admin login (Secret)
- `SESSION_SECRET` = long random secret, at least 32 characters (Secret)

Redeploy Production after changing environment variables.

## 3. Health check

Open:

`/api/health`

Expected:

```json
{
  "ok": true,
  "database": "connected",
  "growth_clients_table": "available",
  "openai": "configured",
  "admin_auth": "configured"
}
```

## 4. Test workflow before Adamik's

1. Sign in at `/login`.
2. Create a fake plumbing client.
3. Open the client workspace.
4. Click **Run Complete Business Analysis**.
5. The job runs in OpenAI background mode and the page polls status.
6. When complete, open both PowerPoints and verify findings/sources.
7. Click **Approve & Publish Client Portal**.
8. Open the generated private portal.
9. Complete every client step.
10. Submit and confirm the 48-hour activation screen.
11. Confirm the client has 90-day tasks in Supabase.

## Security rules built into this version

- The Supabase service-role key is server-only and never sent to the browser.
- New Growth CRM tables use RLS and are not granted to `anon` or `authenticated` roles.
- Client portal tokens use cryptographically random values.
- The portal never asks clients to submit Google passwords, MFA codes or recovery credentials.
- AI research is never published automatically; RL Footage must approve it.

## Still recommended before broad production rollout

- Replace the shared admin password with full Supabase Auth + named staff accounts / roles.
- Add real Google OAuth / Google Ads / GA4 / Search Console / Business Profile API connections so access can be verified automatically rather than only recorded as a client checklist.
- Add private file uploads to Supabase Storage for historical SEO reports, assets and signed-document files.
- Have California counsel review the final digital agreement language/e-signature workflow before using it as RL Footage's permanent legal contract.
- Add a background job/queue provider if analysis volume grows substantially.

## OpenAI implementation references

This build follows current OpenAI documentation for the Responses API, background responses, built-in web search and Structured Outputs.


## V2.0.2 build compatibility fix
- Adds backward-compatible `templates` and `admin()` exports for stale V1 files that can remain when a repository is updated via upload instead of a clean replace.
- Overwrites legacy `/intake/[token]` with a redirect to the V2 `/p/[token]` portal.
- Retires the legacy `/api/intake/[token]/submit` endpoint.
- No database migration changes from V2 PRO.
