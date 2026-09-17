## V2.0.8 transparent logo and visual polish
- Cleans the approved silver/white-and-cyan logo background to genuine transparency and removes the dark logo tile, rounded frame and filters.
- Uses the transparent artwork throughout login, desktop/mobile admin navigation, both portal states, browser icon, PowerPoint reports and the onboarding PDF.
- Refines logo sizes, header alignment, login copy, form spacing and primary action colors.
- Improves small-screen layouts, keeps navigation and sign-out available on mobile, prevents sidebar footer overlap, and adds visible keyboard focus and reduced-motion support.
- Company branding remains Growth Intelligence LLC. No database migration, environment-variable change or paid AI request is required for this update.
- This is the updated source ZIP. The live CRM is not redeployed by downloading it.

## V2.0.7 exact supplied logo
- Replaces the prior artwork with the exact attached silver/white-and-cyan Growth Intelligence LLC logo, without redrawing or modifying its pixels.
- Applies this logo to login, desktop/mobile admin navigation, both client portal states, browser icon, PowerPoint reports and the onboarding PDF.
- Displays the light logo on a dark navy background for legibility.
- Uses Growth Intelligence LLC as the company name throughout the interface, agreements, report branding and page metadata.
- The source package contains no former-company name or former-company logo assets. Existing client data and application workflows are preserved.
- This ZIP has not been published to the live CRM. No database migration or environment-variable changes are required for this branding update.

## V2.0.6 company branding completion
- Includes the exact approved Growth Intelligence LLC logo across the CRM and generated reports.
- Uses the approved artwork for the browser tab icon and the full company name in page metadata.
- Updates the website scanner identity to Growth Intelligence and removes the final former-company name from the source package.
- This is a source-code ZIP update; it does not publish a live deployment.
- Existing database tables, records, login behavior and environment variables are unchanged. No new database migration is needed when upgrading an existing V2 installation.
- For an existing CRM, deploy these source files to its confirmed repository/project while keeping the existing environment configuration. The setup instructions below apply to new installations.

## V2.0.5 approved company logo
- Adds the approved Growth Intelligence LLC logo to admin navigation, the mobile admin header, login, and both client portal states.
- Embeds that exact logo in both generated PowerPoints and the onboarding PDF.
- Keeps the client’s own logo and existing application workflows.
- Uses a bundled static asset; no OpenAI API calls, database migration or new environment variables are required.
- Include `public/brand/` when deploying this complete project to the existing CRM repository and Vercel project.

## V2.0.4 company rebrand
- Rebranded the complete platform, client portal, reports, agreements, PDF exports, AI research instructions and admin experience to **Growth Intelligence LLC**.
- No database migration or environment-variable changes are required for this rebrand.

# Growth Intelligence LLC — Command Center V2 PRO

This build powers the Growth Intelligence LLC client acquisition, analysis, onboarding and execution workflow:

**Admin creates client → AI researches business + web presence → audit + 90-day PowerPoints → Growth Intelligence LLC reviews/approves → personalized client portal → pricing → private intake → access plan → e-signature → activation → 48-hour strategy stage → 90-day tasks.**

## What is functional in V2 PRO

- Private Growth Intelligence LLC admin login (server-side signed session cookie)
- Client pipeline / command center
- Create client with business, website, contact, industry, start date and pricing
- Automatic website metadata scan for logo/favicon/OG image/title/description
- OpenAI Responses API background analysis job using built-in web search
- Structured evidence-based audit stored in Supabase
- Two generated PowerPoints from the same analysis record:
  - Digital Growth Intelligence Audit
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

The model is configurable using `OPENAI_MODEL`. The model is controlled by `OPENAI_MODEL` in Vercel.

## 1. Run the V2 database migration

In Supabase → SQL Editor, run:

`supabase/migration_v2_pro.sql`

This is additive. It does not drop your older legacy `clients` table or the existing Growth CRM tables.

## 2. Vercel environment variables

Keep the two variables already configured:

- `NEXT_PUBLIC_SUPABASE_URL`
- `SUPABASE_SERVICE_ROLE_KEY` (Secret)

Add:

- `NEXT_PUBLIC_APP_URL` = your production CRM domain, e.g. `https://growth-tawny-one.vercel.app`
- `OPENAI_API_KEY` = OpenAI API secret key (Secret)
- `OPENAI_MODEL` = optional; configured with `OPENAI_MODEL`
- `ADMIN_PASSWORD` = long private password for Growth Intelligence LLC admin login (Secret)
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
- AI research is never published automatically; Growth Intelligence LLC must approve it.

## Still recommended before broad production rollout

- Replace the shared admin password with full Supabase Auth + named staff accounts / roles.
- Add real Google OAuth / Google Ads / GA4 / Search Console / Business Profile API connections so access can be verified automatically rather than only recorded as a client checklist.
- Add private file uploads to Supabase Storage for historical SEO reports, assets and signed-document files.
- Have California counsel review the final digital agreement language/e-signature workflow before using it as Growth Intelligence LLC's permanent legal contract.
- Add a background job/queue provider if analysis volume grows substantially.

## OpenAI implementation references

This build follows current OpenAI documentation for the Responses API, background responses, built-in web search and Structured Outputs.


## V2.0.2 build compatibility fix
- Adds backward-compatible `templates` and `admin()` exports for stale V1 files that can remain when a repository is updated via upload instead of a clean replace.
- Overwrites legacy `/intake/[token]` with a redirect to the V2 `/p/[token]` portal.
- Retires the legacy `/api/intake/[token]/submit` endpoint.
- No database migration changes from V2 PRO.
